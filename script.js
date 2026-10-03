// ===== Данные =====
// Чтобы изменить меню, правьте только этот блок.
// desc, weight, price и badge можно не указывать — тогда они не показываются.

const HOURS = { open: 11, close: 22, timeZone: 'Europe/Moscow' };

// Категория, открытая при загрузке страницы
const DEFAULT_CATEGORY = 'snacks';

const CATEGORIES = [
  { id: 'snacks', title: 'Закуски', icon: 'i-fries' },
  { id: 'shawarma', title: 'Шаверма', icon: 'i-wrap' },
  { id: 'hotdogs', title: 'Хот-доги', icon: 'i-hotdog' },
  { id: 'burgers', title: 'Бургеры', icon: 'i-burger' },
  { id: 'cold', title: 'Холодные напитки', icon: 'i-glass' },
  { id: 'hot', title: 'Горячие напитки', icon: 'i-cup' },
  { id: 'sauces', title: 'Соусы', icon: 'i-drop' },
  { id: 'all', title: 'Всё меню' },
];

const MENU = [
  // Закуски
  { cat: 'snacks', name: 'Сырные палочки, 5 шт.', desc: 'Хрустящая панировка и тягучий сыр внутри.', weight: '110 г', price: 370 },
  { cat: 'snacks', name: 'Стрипсы, 4 шт.', desc: 'Полоски куриного филе в золотистой панировке.', weight: '165 г', price: 420 },
  { cat: 'snacks', name: 'Наггетсы, 8 шт.', desc: 'Сочная курица в хрустящей панировке.', weight: '180 г', price: 380 },
  { cat: 'snacks', name: 'Куриные крылышки, 3 шт.', desc: 'Сочные крылышки в хрустящей панировке.', weight: '260 г', price: 380 },
  { cat: 'snacks', name: 'Картофель фри', desc: 'Хрустящий снаружи и нежный внутри — к любому блюду.', weight: '120 г', price: 250 },
  { cat: 'snacks', name: 'Луковые кольца, 7 шт.', desc: 'Сочный лук в ароматной панировке.', weight: '100 г', price: 249 },
  { cat: 'snacks', name: 'Королевские креветки, 6 шт.', desc: 'Нежные королевские креветки в панировке.', weight: '115 г', price: 690 },
  { cat: 'snacks', name: 'Кольца кальмара', desc: 'Кольца кальмара в хрустящей панировке.', weight: '150 г', price: 500 },
  { cat: 'snacks', name: 'Сырники нежные', desc: 'Воздушные сырники из свежего творога.', weight: '150 г', price: 340 },

  // Шаверма
  { cat: 'shawarma', name: 'Шаверма Snack', desc: 'Куриное филе, чеддер, чипсы, морковь по-корейски, овощи и фирменный соус.', weight: '530 г', price: 590, badge: 'Фирменная' },
  { cat: 'shawarma', name: 'Шаверма Berry Snack', desc: 'Курица, овощи, жареный лук, чипсы и бруснично-вишнёвый джем.', weight: '530 г', price: 670, badge: 'Новинка' },
  { cat: 'shawarma', name: 'Шаверма Strips', desc: 'Четыре стрипса, жареный лук, сыр и овощи; фирменный соус, терияки и горчичный.', weight: '520 г', price: 690, badge: 'Новинка' },
  { cat: 'shawarma', name: 'Шаверма Грибчиз', desc: 'Курица, шампиньоны, сыр и овощи; фирменный, грибной и сливочно-чесночный соусы.', weight: '510 г', price: 690, badge: 'Новинка' },
  { cat: 'shawarma', name: 'Копчёный Цезарь', desc: 'Копчёное филе, овощи, тёртый сыр и сухарики с соусом «Цезарь» и зернистой горчицей.', weight: '520 г', price: 750, badge: 'Хит' },
  { cat: 'shawarma', name: 'Шаверма Классическая', desc: 'Куриное филе, огурцы, помидоры, пекинская капуста и фирменный соус.', weight: '380 г', price: 490 },
  { cat: 'shawarma', name: 'Шаверма Брусничный Хит', desc: 'Курица и свежие овощи с фирменным и брусничным соусами — с лёгкой кислинкой.', weight: '400 г', price: 580 },
  { cat: 'shawarma', name: 'Шаверма Гавайская', desc: 'Курица, кукуруза и ананасы в сырном лаваше с фирменным и сырным соусами.', weight: '400 г', price: 550 },
  { cat: 'shawarma', name: 'Шаверма Мексиканская', desc: 'Курица, овощи, халапеньо и шрирача — для тех, кто любит поострее.', weight: '400 г', price: 550, badge: 'Острая' },
  { cat: 'shawarma', name: 'Шаверма Сырный голод', desc: 'Куриное филе, хрустящие овощи, чеддер, фирменный и сырный соусы.', weight: '400 г', price: 550 },
  { cat: 'shawarma', name: 'Шаверма Грибная', desc: 'Курица, шампиньоны и овощи с грибным и фирменным соусами.', weight: '420 г', price: 550 },
  { cat: 'shawarma', name: 'Шаверма Потато', desc: 'Картофель фри, куриное филе, чеддер и фирменный соус.', weight: '450 г', price: 560 },
  { cat: 'shawarma', name: 'Шаверма Микс', desc: 'Свинина и куриное филе, овощи, фирменный соус и барбекю.', weight: '410 г', price: 570 },
  { cat: 'shawarma', name: 'Шаверма Баварская', desc: 'Курица и баварские колбаски, овощи, морковь по-корейски, фирменный и горчичный соусы.', weight: '520 г', price: 640 },
  { cat: 'shawarma', name: 'Шаверма Нептун', desc: 'Четыре королевские креветки, овощной микс и фирменный соус.', weight: '400 г', price: 640 },
  { cat: 'shawarma', name: 'Шаверма Вегетарианская', desc: 'Помидоры, огурцы, пекинская капуста и чеддер в лаваше с соусом.', weight: '300 г', price: 410 },
  { cat: 'shawarma', name: 'Шаверма в пите Баварская', desc: 'Курица и баварские колбаски с овощами; фирменный соус, барбекю и горчичный.', weight: '480 г', price: 680 },
  { cat: 'shawarma', name: 'Шаверма в пите по-питерски', desc: 'Курица, свежие и маринованные огурцы, помидоры, морковь по-корейски в пите.', weight: '470 г', price: 620 },

  // Хот-доги
  { cat: 'hotdogs', name: 'Хот-дог «Датский»', desc: 'Сосиска, маринованные огурчики, лук и фирменные соусы в мягкой булочке.', weight: '210 г', price: 390 },
  { cat: 'hotdogs', name: 'Фрэнч Дог', desc: 'Свиная сосиска в хрустящей булочке с соусами.', weight: '230 г', price: 370 },
  { cat: 'hotdogs', name: 'Хот-дог Сырный', desc: 'Сосиска в сырном лаваше с помидорами, огурцами, чеддером и сырным соусом.', weight: '350 г', price: 470 },
  { cat: 'hotdogs', name: 'Хот-дог в лаваше классический', desc: 'Свиная сосиска, помидоры, огурцы, фирменный соус, кетчуп и горчичный соус.', weight: '350 г', price: 450 },
  { cat: 'hotdogs', name: 'Хот-дог в лаваше Баварский', desc: 'Баварские колбаски, чипсы, картофель фри и овощи с тремя соусами.', weight: '430 г', price: 490 },

  // Бургеры
  { cat: 'burgers', name: 'Бургер «Говяжий восторг»', desc: 'Говяжья котлета, помидоры, маринованный огурчик, чеддер и соусы.', weight: '180 г', price: 460 },
  { cat: 'burgers', name: 'Бургер «Куриный восторг»', desc: 'Куриная котлета в панировке, огурец, помидор и фирменные соусы.', weight: '300 г', price: 420 },

  // Холодные напитки
  { cat: 'cold', name: 'Айс латте', desc: 'Кофе, молоко и лёд.', weight: '500 мл', price: 380 },
  { cat: 'cold', name: 'Айс латте Ваниль-малина', desc: 'Холодный латте с ванильным и малиновым сиропами.', weight: '500 мл', price: 390 },
  { cat: 'cold', name: 'Айс латте Дубайский шоколад', desc: 'Холодный латте с фисташковым и шоколадным сиропами.', weight: '500 мл', price: 390 },
  { cat: 'cold', name: 'Айс латте Арбуз-дыня', desc: 'Холодный латте с фруктовыми сиропами.', weight: '500 мл', price: 390 },
  { cat: 'cold', name: 'Айс латте Чёрная смородина — шоколадное печенье', desc: 'Холодный латте с ягодной ноткой и вкусом шоколадного печенья.', weight: '500 мл', price: 390 },
  { cat: 'cold', name: 'Бабл ти Голубая матча — ежевика', desc: 'Мороженое, молоко, тапиока, голубая матча и сироп ежевики.', weight: '500 мл', price: 590 },
  { cat: 'cold', name: 'Бабл ти Розовая матча — фисташка', desc: 'Мороженое, молоко, тапиока, розовая матча и фисташка.', weight: '500 мл', price: 590 },
  { cat: 'cold', name: 'Бабл ти Пина колада', desc: 'Мороженое, молоко, тапиока и сироп «Пина колада».', weight: '500 мл', price: 560 },
  { cat: 'cold', name: 'Бабл ти Дубайский шоколад', desc: 'Мороженое, молоко, тапиока и сироп дубайского шоколада.', weight: '500 мл', price: 560 },
  { cat: 'cold', name: 'Бабл ти Кофейно-шоколадный', desc: 'Мороженое, молоко, эспрессо, шоколадный сироп и тапиока.', weight: '500 мл', price: 560 },
  { cat: 'cold', name: 'Бабл ти Малиново-миндальный', desc: 'Мороженое, молоко, тапиока, малиновый и миндальный сиропы.', weight: '500 мл', price: 560 },
  { cat: 'cold', name: 'Бабл ти Черника — шоколадное печенье', desc: 'Мороженое, молоко, тапиока, сиропы черники и шоколадного печенья.', weight: '500 мл', price: 560 },
  { cat: 'cold', name: 'Бабл ти Шоколад-мята', desc: 'Мороженое, молоко, тапиока, шоколадный и мятный сиропы.', weight: '500 мл', price: 560 },
  { cat: 'cold', name: 'Бабл ти Карамельно-кокосовый', desc: 'Молоко, мороженое, тапиока, карамельный сироп и кокос.', weight: '500 мл', price: 560 },
  { cat: 'cold', name: 'Бабл ти Арбуз-дыня', desc: 'Чай со льдом, джус-боллы, сиропы арбуза и дыни.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Манго-маракуйя', desc: 'Чай со льдом, джус-боллы, манго и маракуйя.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Малина-гранат', desc: 'Чай со льдом, джус-боллы, сиропы малины и граната.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Клубника-мята', desc: 'Чай со льдом, джус-боллы, клубника и мята.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Лаванда-смородина', desc: 'Чай со льдом, джус-боллы, лаванда и смородина.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Мохито', desc: 'Чай со льдом, джус-боллы и сироп мохито.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Ежевика-мята', desc: 'Чай со льдом, джус-боллы, ежевика и мята.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Киви-мята', desc: 'Чай со льдом, джус-боллы, киви и мята.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Бабл ти Яблоко-груша', desc: 'Чай со льдом, джус-боллы и яблочно-грушевый сироп.', weight: '500 мл', price: 490 },
  { cat: 'cold', name: 'Лимонад Арбуз-дыня', desc: 'Газированная вода, лёд, сиропы арбуза и дыни.', weight: '500 мл', price: 300 },
  { cat: 'cold', name: 'Лимонад Мохито-лайм', desc: 'Газированная вода, лёд, сиропы мохито и лайма.', weight: '500 мл', price: 300 },
  { cat: 'cold', name: 'Лимонад Яблоко-мята', desc: 'Газированная вода, лёд, яблочный и мятный сиропы.', weight: '500 мл', price: 300 },

  // Горячие напитки
  { cat: 'hot', name: 'Эспрессо', desc: 'Две порции эспрессо: плотный и яркий.', weight: '50 мл', price: 220 },
  { cat: 'hot', name: 'Американо', desc: 'Две порции эспрессо с водой.', weight: '300 мл', price: 250 },
  { cat: 'hot', name: 'Капучино', desc: 'Эспрессо и шелковистая молочная пена.', weight: '300 мл', price: 380 },
  { cat: 'hot', name: 'Латте', desc: 'Эспрессо с мягким молоком.', weight: '300 мл', price: 370 },
  { cat: 'hot', name: 'Флэт уайт', desc: 'Две порции эспрессо с молоком.', weight: '200 мл', price: 320 },
  { cat: 'hot', name: 'Раф', desc: 'Две порции эспрессо и сливки.', weight: '300 мл', price: 380 },
  { cat: 'hot', name: 'Раф Лавандовый', desc: 'Эспрессо, сливки и лавандовый сироп.', weight: '300 мл', price: 380 },
  { cat: 'hot', name: 'Раф Фисташка-малина', desc: 'Эспрессо, сливки, фисташковый и малиновый сиропы.', weight: '300 мл', price: 380 },
  { cat: 'hot', name: 'Раф Сырный', desc: 'Эспрессо, сливки и плавленый сыр.', weight: '300 мл', price: 420 },
  { cat: 'hot', name: 'Раф Баунти', desc: 'Эспрессо, сливки, кокосовый и шоколадный сиропы.', weight: '400 мл', price: 390 },
  { cat: 'hot', name: 'Раф Мята', desc: 'Эспрессо, сливки и мятный сироп.', weight: '400 мл', price: 390 },
  { cat: 'hot', name: 'Горячий шоколад', desc: 'Какао с шоколадным сиропом.', weight: '200 мл', price: 320 },
  { cat: 'hot', name: 'Матча латте Голубая', desc: 'Голубая матча с молоком — без кофе.', weight: '200 мл', price: 370 },
  { cat: 'hot', name: 'Матча латте Розовая', desc: 'Розовая матча с молоком — без кофе.', weight: '200 мл', price: 370 },

  // Соусы
  { cat: 'sauces', name: 'Соус Сырный', weight: '80 г', price: 150 },
  { cat: 'sauces', name: 'Соус Чесночный', weight: '80 г', price: 150 },
  { cat: 'sauces', name: 'Соус Горчичный', weight: '80 г', price: 150 },
  { cat: 'sauces', name: 'Соус Грибной', weight: '80 г', price: 170 },
  { cat: 'sauces', name: 'Соус Шрирача', weight: '80 г', price: 170 },
  { cat: 'sauces', name: 'Соус Брусничный', weight: '80 г', price: 200 },
];

// ===== Меню и фильтр =====

document.documentElement.classList.add('js');

const filtersEl = document.getElementById('filters');
const gridEl = document.getElementById('menu-grid');
const iconByCat = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.icon]));

function dishCard(item) {
  const badge = item.badge ? `<span class="badge">${item.badge}</span>` : '';
  const desc = item.desc ? `<p>${item.desc}</p>` : '';
  const weight = item.weight ? `<span>${item.weight}</span>` : '';
  const price = item.price ? `<span class="dish__price">${item.price} ₽</span>` : '';
  const foot = weight || price ? `<div class="dish__foot">${weight}${price}</div>` : '';
  return `
    <article class="dish">
      <div class="dish__top">
        <span class="dish__icon"><svg class="icon"><use href="#${iconByCat[item.cat]}"/></svg></span>
        ${badge}
      </div>
      <h3>${item.name}</h3>
      ${desc}
      ${foot}
    </article>`;
}

function renderMenu(cat) {
  const items = cat === 'all' ? MENU : MENU.filter((item) => item.cat === cat);
  gridEl.innerHTML = items.map(dishCard).join('');
}

filtersEl.innerHTML = CATEGORIES.map(
  (c) => `<button class="filter" type="button" data-cat="${c.id}" aria-pressed="${c.id === DEFAULT_CATEGORY}">${c.title}</button>`
).join('');

filtersEl.addEventListener('click', (event) => {
  const button = event.target.closest('.filter');
  if (!button) return;
  filtersEl.querySelectorAll('.filter').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
  renderMenu(button.dataset.cat);
});

renderMenu(DEFAULT_CATEGORY);

// ===== Мобильное меню =====

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setNav(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setNav(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setNav(false);
});

// ===== «Сейчас открыто» по времени Брянска =====

const statusEl = document.getElementById('status');
const hour = Number(
  new Intl.DateTimeFormat('ru-RU', { hour: 'numeric', hourCycle: 'h23', timeZone: HOURS.timeZone }).format(new Date())
);
const isOpen = hour >= HOURS.open && hour < HOURS.close;
statusEl.classList.toggle('is-open', isOpen);
document.getElementById('status-text').textContent = isOpen
  ? `Сейчас открыто · до ${HOURS.close}:00`
  : `Сейчас закрыто · откроемся в ${HOURS.open}:00`;
statusEl.hidden = false;

// ===== Появление блоков при прокрутке =====

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();
