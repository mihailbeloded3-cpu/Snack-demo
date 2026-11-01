"""Этап 0 — разведка Portals и MRKT.

Скрипт только читает данные: ничего не покупает и не выставляет.
Он выясняет:
  * сколько лотов маркет отдаёт за один запрос;
  * сколько новых лотов появляется в минуту;
  * как часто можно делать запросы без ошибок;
  * как выглядят ответы маркетов (образцы сохраняются в recon_out/).
"""

import asyncio
import configparser
import json
import time
from collections import Counter
from datetime import datetime
from pathlib import Path
from urllib.parse import unquote

from curl_cffi import requests as creq
from telethon import TelegramClient, functions, types, utils

HERE = Path(__file__).resolve().parent
CONFIG_PATH = HERE / "config.ini"
OUT_DIR = HERE / "recon_out"
PROBE_SIZES = [20, 50, 100, 200]


# ---------------------------------------------------------------- настройки

def load_config() -> configparser.ConfigParser:
    cfg = configparser.ConfigParser()
    if CONFIG_PATH.exists():
        cfg.read(CONFIG_PATH, encoding="utf-8")
    for section in ("telegram", "recon"):
        if not cfg.has_section(section):
            cfg.add_section(section)

    tg = cfg["telegram"]
    if not tg.get("api_id") or not tg.get("api_hash"):
        print("Нужны api_id и api_hash Telegram (бесплатно):")
        print("  1. Открой https://my.telegram.org и войди по номеру телефона")
        print("  2. API development tools -> создай приложение (любое название)")
        print("  3. Скопируй сюда App api_id и App api_hash\n")
        tg["api_id"] = input("api_id: ").strip()
        tg["api_hash"] = input("api_hash: ").strip()

    rc = cfg["recon"]
    rc.setdefault("minutes", "10")         # сколько минут наблюдать
    rc.setdefault("interval_sec", "3")     # пауза между опросами
    rc.setdefault("page_size", "20")       # лотов за запрос
    rc.setdefault("min_price_ton", "0")    # фильтр цены для вывода
    rc.setdefault("max_price_ton", "100")

    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        cfg.write(f)
    return cfg


# ------------------------------------------------- вход через Telegram

def init_data_from_url(url: str) -> tuple[str, str]:
    """Достаёт initData из ссылки мини-приложения: (раскодированный, как есть)."""
    raw = url.split("tgWebAppData=", 1)[1].split("&tgWebAppVersion", 1)[0]
    return unquote(raw), raw


async def fetch_init_data(cfg) -> dict:
    tg = cfg["telegram"]
    client = TelegramClient(str(HERE / "recon"), int(tg["api_id"]), tg["api_hash"])
    print("\nВход в Telegram (при первом запуске спросит номер и код из Telegram)...")
    await client.start()
    result = {}
    try:
        try:
            peer = await client.get_input_entity("portals")
            app = types.InputBotAppShortName(bot_id=utils.get_input_user(peer), short_name="market")
            res = await client(functions.messages.RequestAppWebViewRequest(
                peer=peer, app=app, platform="desktop"))
            result["portals"] = init_data_from_url(res.url)
        except Exception as e:
            print(f"[Portals] не удалось получить данные входа: {e!r}")
        try:
            peer = await client.get_input_entity("mrkt")
            res = await client(functions.messages.RequestMainWebViewRequest(
                peer=peer, bot=utils.get_input_user(peer), platform="desktop"))
            result["mrkt"] = init_data_from_url(res.url)
        except Exception as e:
            print(f"[MRKT] не удалось получить данные входа: {e!r}")
    finally:
        await client.disconnect()
    return result


# ------------------------------------------------------ разбор ответов

ID_KEYS = ("id", "giftId", "gift_id", "nftId")
NAME_KEYS = ("collectionTitle", "collectionName", "giftName", "name", "title")
MODEL_KEYS = ("modelTitle", "modelName", "model")
BACKDROP_KEYS = ("backdropName", "backdropTitle", "backdrop")
PRICE_KEYS = ("salePrice", "price", "amount")
NESTED_KEYS = ("gift", "nft", "item")


def find_items(data) -> list:
    """Список лотов из ответа, какой бы ни была обёртка."""
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("results", "items", "gifts", "data", "nfts", "events"):
            if isinstance(data.get(key), list):
                return data[key]
        for value in data.values():
            if isinstance(value, list) and value and isinstance(value[0], dict):
                return value
    return []


def pick(item: dict, keys):
    """Первое найденное поле — в самом лоте или во вложенном объекте подарка."""
    layers = [item] + [item[k] for k in NESTED_KEYS if isinstance(item.get(k), dict)]
    for layer in layers:
        for k in keys:
            v = layer.get(k)
            if v not in (None, "", [], {}):
                return v
    return None


def to_ton(value) -> float | None:
    try:
        v = float(value)
    except (TypeError, ValueError):
        return None
    return v / 1e9 if v > 1e6 else v  # MRKT, вероятно, отдаёт нанотоны


def portals_attr(item: dict, kind: str):
    for attr in item.get("attributes") or []:
        if attr.get("type") == kind:
            return attr.get("value")
    return None


def describe(market: str, item: dict) -> dict:
    lot_id = pick(item, ID_KEYS)
    if lot_id is None:
        lot_id = json.dumps(item, sort_keys=True, ensure_ascii=False)
    model = portals_attr(item, "model") or pick(item, MODEL_KEYS)
    backdrop = portals_attr(item, "backdrop") or pick(item, BACKDROP_KEYS)
    return {
        "id": f"{market}:{lot_id}",
        "name": pick(item, NAME_KEYS),
        "model": model if not isinstance(model, dict) else model.get("name"),
        "backdrop": backdrop if not isinstance(backdrop, dict) else backdrop.get("name"),
        "number": pick(item, ("external_collection_number", "number", "giftNumber")),
        "price": to_ton(pick(item, PRICE_KEYS)),
        "event": item.get("type"),
    }


# ----------------------------------------------------------- маркеты

class Market:
    name = "?"

    def __init__(self):
        self.http = creq.Session(impersonate="chrome")
        self.stats = Counter()
        self.latencies: list[float] = []
        self.backoff_until = 0.0

    def request(self, method: str, url: str, **kw):
        t0 = time.perf_counter()
        try:
            r = self.http.request(method, url, timeout=15, **kw)
        except Exception as e:
            self.stats["network_errors"] += 1
            print(f"[{self.name}] ошибка сети: {e}")
            return None
        self.latencies.append((time.perf_counter() - t0) * 1000)
        self.stats["requests"] += 1
        self.stats[f"http_{r.status_code}"] += 1
        if r.status_code == 429:
            self.backoff_until = time.time() + 15
            print(f"[{self.name}] 429: слишком частые запросы, пауза 15 с")
        return r

    def latest(self, limit: int):
        raise NotImplementedError


class Portals(Market):
    name = "Portals"
    API = "https://portal-market.com/api/"

    def __init__(self, init_data: str):
        super().__init__()
        self.headers = {
            "Authorization": f"tma {init_data}",
            "Accept": "application/json, text/plain, */*",
            "Origin": "https://portal-market.com",
            "Referer": "https://portal-market.com/",
        }

    def latest(self, limit: int):
        url = (f"{self.API}nfts/search?offset=0&limit={limit}"
               "&sort_by=listed_at+desc&status=listed"
               "&exclude_bundled=true&premarket_status=all")
        return self.request("GET", url, headers=self.headers)


class Mrkt(Market):
    name = "MRKT"
    API = "https://api.tgmrkt.io/api/v1/"
    BASE_HEADERS = {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Origin": "https://cdn.tgmrkt.io",
        "Referer": "https://cdn.tgmrkt.io/",
    }

    def __init__(self, init_data_variants):
        super().__init__()
        token = None
        for data in init_data_variants:
            r = self.request("POST", self.API + "auth", json={"data": data},
                             headers=self.BASE_HEADERS)
            if r is not None and r.ok:
                try:
                    token = r.json().get("token")
                except ValueError:
                    token = None
            if token:
                break
        if not token:
            code = r.status_code if r is not None else "нет ответа"
            raise RuntimeError(f"MRKT не выдал токен (ответ: {code})")
        self.headers = {**self.BASE_HEADERS,
                        "Authorization": f"Bearer {token}",
                        "Cookie": f"access_token={token}"}

    def latest(self, limit: int):
        payload = {
            "count": limit, "cursor": "",
            "collectionNames": [], "modelNames": [], "backdropNames": [],
            "type": ["listing", "change_price"],
            "ordering": "Latest", "lowToHigh": False,
        }
        return self.request("POST", self.API + "feed", json=payload, headers=self.headers)


# ------------------------------------------------------------ разведка

def save_json(name: str, data):
    OUT_DIR.mkdir(exist_ok=True)
    if isinstance(data, dict):
        data = {k: (v[:3] if isinstance(v, list) else v) for k, v in data.items()}
    elif isinstance(data, list):
        data = data[:3]
    (OUT_DIR / name).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def probe_page_size(m: Market) -> dict:
    print(f"\n[{m.name}] Проверяю размер страницы...")
    results = {}
    for size in PROBE_SIZES:
        r = m.latest(size)
        if r is None:
            results[size] = "нет ответа"
        elif not r.ok:
            results[size] = f"ошибка {r.status_code}"
        else:
            try:
                data = r.json()
            except ValueError:
                results[size] = "не JSON"
                continue
            if size == PROBE_SIZES[0]:
                save_json(f"{m.name.lower()}_sample.json", data)
            results[size] = f"вернул {len(find_items(data))}"
        print(f"  запросил {size}: {results[size]}")
        time.sleep(1.5)
    return results


def fmt_lot(lot: dict) -> str:
    price = f"{lot['price']:.2f} TON" if lot["price"] is not None else "цена ?"
    num = f" #{lot['number']}" if lot["number"] else ""
    event = f" [{lot['event']}]" if lot["event"] else ""
    return (f"{lot['name'] or '?'}{num} | модель: {lot['model'] or '?'} | "
            f"фон: {lot['backdrop'] or '?'} | {price}{event}")


def watch(markets: list[Market], cfg):
    rc = cfg["recon"]
    minutes = float(rc["minutes"])
    interval = float(rc["interval_sec"])
    page = int(rc["page_size"])
    lo, hi = float(rc["min_price_ton"]), float(rc["max_price_ton"])

    seen = {m.name: set() for m in markets}
    first_poll = {m.name: True for m in markets}
    print(f"\nНаблюдаю {minutes:g} мин, опрос каждые {interval:g} с, "
          f"{page} лотов за запрос. Показываю лоты {lo:g}–{hi:g} TON. "
          "Остановить раньше: Ctrl+C\n")

    started = time.time()
    try:
        while time.time() - started < minutes * 60:
            cycle_start = time.time()
            for m in markets:
                if time.time() < m.backoff_until:
                    continue
                r = m.latest(page)
                if r is None or not r.ok:
                    continue
                try:
                    items = find_items(r.json())
                except ValueError:
                    m.stats["bad_json"] += 1
                    continue
                lots = [describe(m.name.lower(), it) for it in items if isinstance(it, dict)]
                new = [l for l in lots if l["id"] not in seen[m.name]]
                seen[m.name].update(l["id"] for l in lots)
                if first_poll[m.name]:
                    first_poll[m.name] = False
                    continue  # первая страница — это старые лоты, не считаем
                if lots and len(new) == len(lots):
                    m.stats["full_new_pages"] += 1  # возможно, часть лотов пропущена
                m.stats["new_lots"] += len(new)
                for lot in new:
                    if lot["price"] is not None and lo <= lot["price"] <= hi:
                        m.stats["new_in_range"] += 1
                        print(f"{datetime.now():%H:%M:%S} {m.name:<7} {fmt_lot(lot)}")
            time.sleep(max(0.0, interval - (time.time() - cycle_start)))
    except KeyboardInterrupt:
        print("\nОстановлено.")
    return (time.time() - started) / 60


def summary(markets, probes, elapsed_min, cfg) -> str:
    lines = [f"Разведка {datetime.now():%Y-%m-%d %H:%M}",
             f"Длительность: {elapsed_min:.1f} мин, опрос каждые "
             f"{cfg['recon']['interval_sec']} с, страница {cfg['recon']['page_size']}", ""]
    for m in markets:
        s = m.stats
        lat = m.latencies
        per_min = s["new_lots"] / elapsed_min if elapsed_min > 0 else 0
        codes = ", ".join(f"{k[5:]}: {v}" for k, v in sorted(s.items()) if k.startswith("http_"))
        lines += [
            f"== {m.name} ==",
            f"Размер страницы: " + "; ".join(f"{k} -> {v}" for k, v in probes[m.name].items()),
            f"Запросов: {s['requests']} (коды ответов: {codes or '—'}; ошибок сети: {s['network_errors']})",
            f"Время ответа: среднее {sum(lat) / len(lat):.0f} мс, макс {max(lat):.0f} мс" if lat else "Время ответа: —",
            f"Новых лотов: {s['new_lots']} (~{per_min:.1f} в минуту), из них в диапазоне цены: {s['new_in_range']}",
            f"Опросов, где вся страница новая (могли пропустить лоты): {s['full_new_pages']}",
            "",
        ]
    return "\n".join(lines)


def main():
    cfg = load_config()
    init = asyncio.run(fetch_init_data(cfg))

    markets: list[Market] = []
    if "portals" in init:
        markets.append(Portals(init["portals"][0]))
    if "mrkt" in init:
        try:
            markets.append(Mrkt(init["mrkt"]))
        except Exception as e:
            print(f"[MRKT] {e}")
    if not markets:
        print("Ни один маркет не подключился. Пришли этот вывод Claude.")
        return

    probes = {m.name: probe_page_size(m) for m in markets}
    elapsed = watch(markets, cfg)
    text = summary(markets, probes, elapsed, cfg)
    OUT_DIR.mkdir(exist_ok=True)
    (OUT_DIR / "summary.txt").write_text(text, encoding="utf-8")
    print("\n" + text)
    print(f"Итог сохранён в {OUT_DIR / 'summary.txt'}")


if __name__ == "__main__":
    main()
