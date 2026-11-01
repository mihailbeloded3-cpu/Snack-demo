# Gift Sniper

План: [PLAN.md](PLAN.md). Сейчас готов **этап 0 — разведка** (`recon.py`).
Скрипт только читает данные с Portals и MRKT: ничего не покупает и не выставляет.

## Запуск на Windows
1. Установи Python 3.12 с https://www.python.org/downloads/ —
   при установке отметь галочку **Add python.exe to PATH**.
2. Получи `api_id` и `api_hash`: https://my.telegram.org → API development tools →
   создай приложение (название любое).
3. Скачай архив: https://github.com/mihailbeloded3-cpu/Snack-demo/archive/refs/heads/claude/gift-search-software-plan-5xkhvf.zip
   Распакуй и открой внутри папку `gift-sniper`.
4. Дважды кликни `run_recon.bat`.
5. При первом запуске скрипт спросит `api_id`, `api_hash`, номер телефона
   и код из Telegram. Затем ~10 минут наблюдает за маркетами.

## Результат
В папке `recon_out/`:
- `summary.txt` — итог: размер страницы, новых лотов в минуту, ошибки, скорость;
- `portals_sample.json`, `mrkt_sample.json` — образцы ответов маркетов.

Эти три файла пришли Claude — по ним делаем этап 1.

## Настройки
После первого запуска появится `config.ini`, секция `[recon]`:
`minutes` (длительность), `interval_sec` (пауза между опросами),
`page_size` (лотов за запрос), `min_price_ton` / `max_price_ton`.

## Важно
- Файл `recon.session` — это вход в твой Telegram-аккаунт.
  **Никому его не отправляй.** Удалишь его — скрипт просто попросит войти заново.
- Telegram пришлёт уведомление о новом входе — это нормально, это скрипт.
