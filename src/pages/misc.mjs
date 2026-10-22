import { company, url, esc, typo, pic, gal, icon, btn, leadForm, pageHero, galleryGrid, faq, galleries, imgSrc, tel, catalog } from '../lib/ui.mjs';
import { productCard } from './shop.mjs';

const P = a => a.map(t => `<p>${typo(t)}</p>`).join('');

// ---------- О студии (старый ?page_id=8) ----------
export function about() {
  const a = gal('about');
  const ph = pageHero({ eyebrow: 'О студии', title: 'Аквариумы: продажа, изготовление и чистка в Симферополе', lead: 'Студия V-Vintage с 2012 года создаёт аквариумы, террариумы, палюдариумы, зимние сады и декоративные водоёмы — как изюминку интерьера.', img: a[4], trail: [['О студии', '/o-studii/']] });
  const free = [['Консультация специалиста по телефону', 'бесплатно'], ['Подробная информация о вариантах', 'бесплатно'], ['Смета по электронной почте', 'бесплатно'], ['Выезд менеджера на объект для оформления заказа', 'бесплатно'], ['Выезд специалиста для замеров и консультации', 'по Крыму'], ['Дизайн-проект в трёх вариантах, эскиз, 3D-визуализация', '% от стоимости']];
  const body = `${ph.html}
<section class="section prose-sec"><div class="wrap prose-grid">
  <div class="prose">
    <div class="prose__block reveal"><h2 class="h3"><span>01</span>Изюминка интерьера</h2>${P(['Аквариумы, террариумы, палюдариумы, зимние сады и декоративные водоёмы всё чаще становятся главным акцентом интерьера. Нестандартные формы, встроенные в пространство, впечатляют даже самый взыскательный вкус. Если вы хотите сделать дом или офис по-настоящему особенным, такое решение стоит сделать на заказ — в магазине его не купить.', 'Изготовленный нами комплекс скроет недостатки помещения и станет достойным украшением интерьера. Колонны, простенки, ниши и выступы можно спрятать или обыграть.'])}</div>
    <div class="prose__block reveal"><h2 class="h3"><span>02</span>Стандартные и нестандартные модели</h2>${P(['Мы изготавливаем на заказ как стандартные, так и нестандартные модели и реализуем любые индивидуальные идеи, поэтому аквариум полностью «вживается» в интерьер. Для производства используем акриловое и силикатное стекло, так что большие аквариумы для наших специалистов не проблема.', 'Скульпторы и художники мастерской декораций создают безопасные и реалистичные элементы для композиций. Каждая модель — законченное изделие высокого качества. Работа идёт по индивидуальному проекту с 3D-визуализацией: такого же аквариума ни у кого больше не будет.'])}</div>
    <div class="prose__block reveal"><h2 class="h3"><span>03</span>Не только изготовление</h2>${P(['Мы обслуживаем, чистим и перезапускаем аквариумы и водоёмы. Работаем по всему Крыму и по России.', 'Отдельное направление — интерьерные работы: 3D-визуализация интерьеров, золочение лепнины и стен, художественная роспись, декоративные и ремонтно-отделочные работы.'])}${btn('Интерьерные работы', '/interer/', 'ghost')}</div>
  </div>
  <aside class="prose-aside">
    <div class="free glass reveal"><p class="aside-cta__t">Что вы получаете</p><ul>${free.map(([t, v]) => `<li><span>${t}</span><b>${v}</b></li>`).join('')}</ul><a class="btn btn--primary btn--wide" href="#lead"><span>Оставить заявку</span>${icon('arrow')}</a></div>
  </aside>
</div></section>
<section class="section section--tight"><div class="wrap"><div class="sec-head"><p class="eyebrow">Галерея</p><h2 class="h2">Аквариумы и террариумы в интерьере</h2></div>${galleryGrid(a)}</div></section>
${leadForm({ topic: 'О студии' })}`;
  return { path: '/o-studii/', title: 'Аквариумы: продажа, изготовление, чистка аквариумов в Симферополе — о студии V-Vintage', desc: 'Студия V-Vintage: изготовление аквариумов любой сложности и размеров, декоративные пруды и ландшафты, обслуживание и чистка, интерьерные работы. Симферополь и весь Крым.', body, ld: [ph.ld], og: a[4]?.id };
}

// ---------- Галереи ----------
export const GALLERY_PAGES = [
  { key: 'presnovodnye-akvariumy', title: 'Пресноводные аквариумы — галерея: Судак, Симферополь, Севастополь, Ялта | V-Vintage', desc: 'Галерея пресноводных аквариумов в интерьере. Изготовление аквариумных комплексов под ключ и обслуживание. Чистка аквариумов в Севастополе, Ялте, Симферополе, Евпатории, Алуште.', h1: 'Пресноводные аквариумы', svc: '/uslugi/presnovodnye-akvariumy/' },
  { key: 'morskie-akvariumy', title: 'Морские аквариумы — галерея: продажа в Симферополе, Севастополе, Ялте | V-Vintage', desc: 'Морские аквариумы в интерьере: идеи для дома, офиса, ресторана. Проектирование, изготовление и чистка аквариумов в Симферополе, Керчи, Севастополе, Феодосии, Евпатории, Ялте.', h1: 'Морские аквариумы', svc: '/uslugi/morskie-akvariumy/' },
  { key: 'rifovye-akvariumy', title: 'Рифовые аквариумы — галерея: Симферополь, Севастополь, Ялта, Феодосия, Керчь | V-Vintage', desc: 'Рифовые аквариумы с кораллами. Изготавливаем аквариумы любой сложности под ключ, чистка аквариумов в Симферополе, Севастополе, Ялте, Феодосии, Алуште, Евпатории.', h1: 'Рифовые аквариумы', svc: '/uslugi/rifovye-akvariumy/' },
  { key: 'torgovye-akvariumy', title: 'Торговые аквариумы для живой рыбы и морепродуктов — Крым | V-Vintage', desc: 'Торговые аквариумы для живой рыбы и морепродуктов для магазинов и ресторанов. Чистка аквариумов, водоёмов и бассейнов: Ялта, Симферополь, Севастополь, Евпатория, Судак, Керчь.', h1: 'Торговые аквариумы', lead: 'Аквариумы и системы передержки для живой рыбы и морепродуктов — для магазинов, рыбных отделов и ресторанов.', product: 'torgovyj-akvarium' },
  { key: 'paludariumy', title: 'Палюдариумы на заказ — галерея: аквариум и сад у вас дома | V-Vintage', desc: 'Галерея палюдариумов: изготовление палюдариумов любых размеров, частичка природы у вас дома.', h1: 'Палюдариумы', svc: '/uslugi/paludariumy/' },
  { key: 'terrariumy', title: 'Террариумы — галерея: изготовление в Симферополе, Севастополе, Феодосии | V-Vintage', desc: 'Галерея террариумов с объёмными фонами. Террариумы — лучший дом для ваших питомцев, которые украсят любой интерьер.', h1: 'Террариумы', svc: '/uslugi/terrariumy/' },
  { key: 'zimnie-sady', title: 'Зимние сады и подвесные (вертикальные) сады для интерьеров — галерея | V-Vintage', desc: 'Зимние и вертикальные сады: природа любой части мира у вас дома или в офисе, гармонично вписанная в интерьер.', h1: 'Зимние и вертикальные сады', svc: '/uslugi/zimnie-sady-i-landshaft/' },
  { key: 'fony-dlya-akvariuma', title: 'Объёмные фоны для аквариума, коралловые рифы — галерея AQUADEKOR | V-Vintage', desc: 'Лучшие объёмные фоны для аквариума, имитирующие природные скалы, камни и корни: более 90 моделей AQUADEKOR. Изготовление под размер.', h1: 'Объёмные фоны для аквариума', svc: '/dekor/fony-dlya-akvariuma/' },
  { key: 'landshaft-i-vodoemy', title: 'Ландшафтный дизайн и декоративные водоёмы — Симферополь, Севастополь, Керчь, Феодосия | V-Vintage', desc: 'Ландшафтный дизайн: разработка и обслуживание. Декоративные водоёмы, пруды, водопады и скалы из искусственного камня в Крыму.', h1: 'Ландшафт и декоративные водоёмы', svc: '/uslugi/zimnie-sady-i-landshaft/' },
  { key: 'interer', title: 'Золочение лепнины, стен, художественная роспись — галерея: Севастополь, Ялта, Симферополь, Керчь | V-Vintage', desc: 'Золочение лепнины, стен и потолков, художественная роспись стен, патинирование и декор мебели. Симферополь, Севастополь, Ялта, Керчь, Судак, Евпатория, Феодосия.', h1: 'Интерьер: золочение и декор', svc: '/interer/' },
];

export function galleryPage(g) {
  const items = gal(g.key);
  const ph = pageHero({ eyebrow: 'Галерея', title: g.h1, lead: g.lead || `${items.length} фото. Нажмите на снимок, чтобы открыть его крупно.`, img: items[Math.min(3, items.length - 1)], trail: [['Галерея', '/galereya/'], [g.h1, '/galereya/' + g.key + '/']], actions: (g.svc ? btn('Об услуге', g.svc) : '') + (g.product ? btn('Заказать', '/magazin/' + g.product + '/') : '') + btn('Обсудить проект', '#lead', 'ghost') });
  const body = `${ph.html}<section class="section section--tight"><div class="wrap">${galleryGrid(items)}</div></section>${leadForm({ topic: 'Галерея: ' + g.h1 })}`;
  return { path: '/galereya/' + g.key + '/', title: g.title, desc: g.desc, body, ld: [ph.ld], og: items[0]?.id };
}

// «Аквариумы» — объединённая галерея (старый ?page_id=77)
export function galleryAquariums() {
  const keys = ['presnovodnye-akvariumy', 'morskie-akvariumy', 'rifovye-akvariumy', 'torgovye-akvariumy'];
  const ph = pageHero({ eyebrow: 'Галерея', title: 'Аквариумы на заказ: галерея', lead: 'Пресноводные, морские, рифовые и торговые аквариумы в интерьерах домов, офисов и ресторанов.', img: gal('morskie-akvariumy')[44], trail: [['Галерея', '/galereya/'], ['Аквариумы', '/galereya/akvariumy/']] });
  const body = `${ph.html}${keys.map(k => `<section class="section section--tight"><div class="wrap"><div class="sec-head sec-head--row"><h2 class="h2">${esc(galleries[k].title)}</h2>${btn('Все фото', '/galereya/' + k + '/', 'ghost')}</div>${galleryGrid(gal(k), { limit: 8 })}</div></section>`).join('')}${leadForm({ topic: 'Галерея аквариумов' })}`;
  return { path: '/galereya/akvariumy/', title: 'Аквариумы на заказ: Севастополь, Ялта, Феодосия — галерея | V-Vintage', desc: 'Аквариумы на заказ любой сложности: Симферополь, Севастополь, Ялта, Феодосия, Керчь, Евпатория, Алушта. Чистка аквариумов и водоёмов.', body, ld: [ph.ld] };
}

export function galleryHub() {
  const ph = pageHero({ eyebrow: 'Галерея', title: 'Галерея: аквариумы, террариумы, сады', lead: 'Идеи для дома, офиса и ресторана — выберите направление.', img: gal('presnovodnye-akvariumy')[10], trail: [['Галерея', '/galereya/']] });
  const list = [{ key: 'akvariumy', h1: 'Все аквариумы', cover: gal('morskie-akvariumy')[44], n: ['presnovodnye-akvariumy', 'morskie-akvariumy', 'rifovye-akvariumy', 'torgovye-akvariumy'].reduce((s, k) => s + gal(k).length, 0) }, ...GALLERY_PAGES.map(g => ({ key: g.key, h1: g.h1, cover: gal(g.key)[Math.min(3, gal(g.key).length - 1)], n: gal(g.key).length })), { key: '../atlas-obitatelej', h1: 'Атлас морских обитателей', cover: gal('atlas')[3], n: gal('atlas').length }];
  const body = `${ph.html}<section class="section"><div class="wrap"><div class="cards3">${list.map((g, i) => `<a class="card card--gal reveal tilt" href="${url(g.key.startsWith('..') ? '/atlas-obitatelej/' : '/galereya/' + g.key + '/')}" style="--i:${i % 3}">${pic(g.cover, { sizes: '(max-width: 700px) 100vw, 33vw', alt: '' })}<span class="card__body"><span class="card__t">${esc(g.h1)}</span><span class="card__d">${g.n} фото</span><span class="card__go">${icon('arrow')}</span></span></a>`).join('')}</div></div></section>${leadForm({ topic: 'Галерея' })}`;
  return { path: '/galereya/', title: 'Аквариумы на заказ, чистка аквариумов — галерея работ и идей: Симферополь, Ялта | V-Vintage', desc: 'Галерея аквариумов, палюдариумов, террариумов, зимних садов, фонов для аквариума и ландшафтного дизайна. Изготовление и обслуживание по всему Крыму.', body, ld: [ph.ld] };
}

// ---------- Атлас обитателей ----------
export function atlas() {
  const items = gal('atlas');
  const ph = pageHero({ eyebrow: 'Атлас', title: 'Атлас морских обитателей', lead: 'Рыбы, которых чаще всего выбирают для морских и рифовых аквариумов. Поможем подобрать совместимых соседей под ваш объём.', img: items[4], trail: [['Атлас обитателей', '/atlas-obitatelej/']] });
  const body = `${ph.html}<section class="section section--tight"><div class="wrap"><div class="atlas">${items.map((it, i) => `<a class="atlas__card reveal tilt" href="${imgSrc(it.id)}" data-lightbox data-caption="${esc(it.name)}" style="--i:${i % 4}">${pic(it, { sizes: '(max-width: 600px) 50vw, 25vw', alt: it.name })}<span>${esc(it.name)}</span></a>`).join('')}</div>
  <div class="shop-note glass reveal"><p>${typo('Совместимость, размер взрослой особи и требования к воде у этих видов сильно различаются. Перед покупкой обитателей проконсультируйтесь со специалистом — подберём сообщество под ваш аквариум.')} <a href="${tel}">${company.phoneDisplay}</a></p></div></div></section>${leadForm({ topic: 'Подбор обитателей', title: 'Подберём обитателей для вашего аквариума' })}`;
  return { path: '/atlas-obitatelej/', title: 'Атлас морских рыб для аквариума: рыба-клоун, хирург, ангелы, бабочки | V-Vintage', desc: 'Атлас популярных морских аквариумных рыб: рыба-клоун, рыба-хирург, императорский ангел, мавританский идол, зебрасома и другие. Подбор обитателей для морского аквариума в Крыму.', body, ld: [ph.ld], og: items[4]?.id };
}

// ---------- Обслуживание ----------
export function service() {
  const mor = gal('morskie-akvariumy');
  const ph = pageHero({ eyebrow: 'Обслуживание', title: 'Чистка и обслуживание аквариумов в Крыму', lead: 'Разовая чистка, перезапуск и регулярное обслуживание пресноводных, морских и рифовых аквариумов, водоёмов и бассейнов.', img: mor[15], trail: [['Обслуживание', '/obsluzhivanie/']], actions: btn('Заказать чистку', '/magazin/chistka-akvariuma/') + btn('Регулярное обслуживание', '/magazin/obsluzhivanie-akvariuma-abonement/', 'ghost') });
  const f = faq([
    ['Как часто нужно чистить аквариум?', 'Зависит от объёма, количества обитателей и фильтрации. Обычно частичную подмену воды и чистку стёкол делают раз в одну-две недели, а полную чистку декора и фильтров — реже. Точный график подскажет специалист после осмотра.'],
    ['Вы обслуживаете аквариумы, которые делали не вы?', 'Да. Обслуживаем, чистим и перезапускаем любые аквариумы и декоративные водоёмы.'],
    ['Что делать, если вода мутнеет или зеленеет?', 'Частые причины — перекорм, избыток или недостаток света, слабая фильтрация. Специалист найдёт причину и, если нужно, выполнит перезапуск аквариума.'],
    ['В каких городах вы работаете?', `${company.areaServed.join(', ')}. В другие населённые пункты Крыма — по договорённости.`],
  ]);
  const prods = ['chistka-akvariuma', 'obsluzhivanie-akvariuma-abonement', 'perezapusk-akvariuma', 'vyezd-specialista'].map(s => catalog.products.find(p => p.slug === s));
  const body = `${ph.html}
<section class="section"><div class="wrap">
  <div class="tiles">${[
    ['Разовая чистка', 'Стёкла, грунт, декор, фильтры, подмена воды и проверка оборудования за один выезд.'],
    ['Регулярное обслуживание', 'Выезды по графику, контроль параметров воды, здоровья рыб и растений.'],
    ['Перезапуск', 'Новый грунт и оформление, настройка оборудования и запуск системы заново.'],
    ['Водоёмы и бассейны', 'Чистка декоративных водоёмов, прудов и бассейнов на участке.'],
  ].map(([t, d], i) => `<div class="tile reveal" style="--i:${i}"><span class="tile__n">0${i + 1}</span><h2 class="h3">${t}</h2><p>${typo(d)}</p></div>`).join('')}</div>
</div></section>
<section class="section section--tight"><div class="wrap"><div class="sec-head"><p class="eyebrow">Заказ онлайн</p><h2 class="h2">Выберите услугу</h2></div><div class="pgrid">${prods.map(productCard).join('')}</div></div></section>
<section class="section section--tight"><div class="wrap service-band__grid">
  <div class="reveal"><p class="eyebrow">География</p><h2 class="h2">Выезжаем <em>по всему Крыму</em></h2><ul class="cities">${company.areaServed.map(c => `<li>${c}</li>`).join('')}</ul></div>
  <div class="reveal">${f.html}</div>
</div></section>
${leadForm({ topic: 'Обслуживание аквариума', title: 'Нужна чистка аквариума?' })}`;
  return { path: '/obsluzhivanie/', title: 'Чистка и обслуживание аквариумов — Симферополь, Севастополь, Ялта, Евпатория, Керчь | V-Vintage', desc: 'Чистка аквариумов, водоёмов и бассейнов в Симферополе, Севастополе, Ялте, Алуште, Судаке, Феодосии, Керчи, Евпатории. Регулярное обслуживание и перезапуск аквариумов.', body, ld: [ph.ld, f.ld, { '@context': 'https://schema.org', '@type': 'Service', name: 'Чистка и обслуживание аквариумов', areaServed: company.areaServed, provider: { '@id': company.domain + '/#org' } }], og: mor[15]?.id };
}

// ---------- Интерьер (старые ?page_id=21 и 194) ----------
export function interior() {
  const items = gal('interer');
  const list = ['Золочение сусальным золотом и серебром: лепнина, стены, мебель, люстры', 'Патинирование мебели, люстр, радиаторов', 'Покраска и перекраска мебели и люстр', 'Резная деревянная мебель, кровати, декоративные зеркала', 'Разработка интерьеров в 3D', 'Ремонтно-отделочные работы', 'Подбор светильников европейских брендов, LED-освещение', 'Художественная роспись стен и потолков', 'Написание картин', 'Состаривание дерева'];
  const ph = pageHero({ eyebrow: 'Интерьер', title: 'Дизайн интерьера, золочение лепнины и декор', lead: 'Нестандартные интерьерные работы: золото и серебро, патина, роспись, резная мебель и 3D-проекты.', img: items[23], trail: [['Интерьер', '/interer/']] });
  const body = `${ph.html}
<section class="section prose-sec"><div class="wrap prose-grid">
  <div class="prose"><div class="prose__block reveal"><h2 class="h3"><span>01</span>Что мы делаем</h2><ul class="ticks">${list.map(t => `<li>${typo(t)}</li>`).join('')}</ul>
  <p>${typo('Хотите, чтобы вещи заиграли по-новому и гармонично вписались в интерьер? Обратитесь к специалистам — мы воплотим ваши идеи.')}</p></div></div>
  <aside class="prose-aside"><div class="aside-pics">${items.slice(20, 23).map((p, i) => `<a href="${imgSrc(p.id)}" data-lightbox data-caption="${esc(p.alt)}" class="aside-pics__i reveal" style="--i:${i}">${pic(p, { sizes: '25vw' })}</a>`).join('')}</div></aside>
</div></section>
<section class="section section--tight"><div class="wrap"><div class="sec-head sec-head--row"><h2 class="h2">Галерея</h2>${btn('Все фото', '/galereya/interer/', 'ghost')}</div>${galleryGrid(items, { limit: 12 })}</div></section>
${leadForm({ topic: 'Интерьерные работы', title: 'Обсудим ваш интерьер' })}`;
  return { path: '/interer/', title: 'Дизайн интерьеров, золочение лепнины, роспись — Симферополь, Севастополь | V-Vintage', desc: 'Проектирование и дизайн интерьеров, золочение лепнины и стен, художественная роспись, патинирование, изготовление эксклюзивных интерьерных вещей: зеркал, мебели, светильников.', body, ld: [ph.ld], og: items[23]?.id };
}

// ---------- Калькулятор ----------
export function calculator() {
  const ph = pageHero({ eyebrow: 'Калькулятор', title: 'Калькулятор аквариума', lead: 'Объём, вес, толщина стекла и рекомендации по оборудованию. Результат ориентировочный — точный расчёт делает инженер.', trail: [['Калькулятор', '/kalkulyator/']] });
  const body = `${ph.html}
<section class="section section--tight calc" data-calc>
  <div class="wrap calc__grid">
    <form class="form glass calc__form" data-calc-form>
      <h2 class="h3">Размеры, см</h2>
      <div class="calc__dims">
        <label class="dim"><span>Длина</span><input type="number" name="l" value="120" min="20" max="600" inputmode="numeric"></label>
        <label class="dim"><span>Глубина</span><input type="number" name="w" value="50" min="15" max="300" inputmode="numeric"></label>
        <label class="dim"><span>Высота</span><input type="number" name="h" value="60" min="15" max="250" inputmode="numeric"></label>
      </div>
      <fieldset class="opt"><legend>Тип аквариума</legend><div class="opt__pills">
        <label class="pill"><input type="radio" name="type" value="fresh" checked><span>Пресноводный</span></label>
        <label class="pill"><input type="radio" name="type" value="marine"><span>Морской</span></label>
        <label class="pill"><input type="radio" name="type" value="reef"><span>Рифовый</span></label>
      </div></fieldset>
      <fieldset class="opt"><legend>Запас прочности</legend><div class="opt__pills">
        <label class="pill"><input type="radio" name="sf" value="3.8" checked><span>Стандартный ×3,8</span></label>
        <label class="pill"><input type="radio" name="sf" value="5"><span>Повышенный ×5</span></label>
      </div></fieldset>
      <p class="calc__note">${typo('Расчёт толщины — по стандартной формуле для стеклянной пластины под гидростатической нагрузкой (силикатное стекло, предел прочности 19,2 МПа при запасе ×3,8). Для аквариумов выше 80 см, панорамных и встроенных конструкций обязательно нужен инженерный расчёт и рёбра жёсткости.')}</p>
    </form>
    <div class="calc__out">
      <div class="tank3d tank3d--calc" data-tank aria-hidden="true"><div class="tank3d__box"><div class="tank3d__water"><span class="tank3d__surface"></span><i class="tank3d__fish"></i><i class="tank3d__fish tank3d__fish--2"></i></div><div class="tank3d__plants"></div></div><div class="tank3d__stand"></div></div>
      <dl class="calc__res" data-calc-res></dl>
      <div class="calc__cta glass"><p>${typo('Нужен точный расчёт со стоимостью? Отправьте параметры — смета бесплатно.')}</p><a class="btn btn--primary" href="#lead" data-calc-send><span>Получить смету</span>${icon('arrow')}</a></div>
    </div>
  </div>
</section>
${leadForm({ topic: 'Калькулятор аквариума', title: 'Рассчитаем стоимость вашего аквариума' })}`;
  return { path: '/kalkulyator/', title: 'Калькулятор аквариума: объём, вес, толщина стекла онлайн | V-Vintage', desc: 'Онлайн-калькулятор аквариума: рассчитайте объём в литрах, вес с водой, толщину стекла, мощность фильтра и нагревателя. Изготовление аквариумов на заказ в Крыму.', body, ld: [ph.ld], scripts: ['calc.js'] };
}

// ---------- Контакты ----------
export function contacts() {
  const ph = pageHero({ eyebrow: 'Контакты', title: 'Контакты студии V-Vintage', lead: `${company.city}, ${company.region}. Работаем по всему Крыму и по России.`, trail: [['Контакты', '/kontakty/']] });
  const body = `${ph.html}
<section class="section section--tight"><div class="wrap contacts">
  <a class="contact glass reveal" href="${tel}">${icon('phone')}<span><small>Телефон</small><b>${company.phoneDisplay}</b></span></a>
  <a class="contact glass reveal" href="mailto:${company.email}">${icon('mail')}<span><small>E-mail</small><b>${company.email}</b></span></a>
  <div class="contact glass reveal">${icon('pin')}<span><small>Город</small><b>${company.city}, ${company.region}</b></span></div>
</div></section>
${leadForm({ topic: 'Контакты', title: 'Напишите нам' })}`;
  return { path: '/kontakty/', title: 'Контакты: аквариумы, террариумы, водоёмы — Симферополь | V-Vintage', desc: `Студия V-Vintage, ${company.city}, Крым. Тел. ${company.phoneDisplay}, e-mail ${company.email}. Аквариумы, террариумы, водоёмы на заказ.`, body, ld: [ph.ld] };
}

// ---------- Юридические страницы ----------
const L = company.legal;
function legalPage(path, title, h1, html) {
  const ph = pageHero({ title: h1, trail: [[h1, path]] });
  return { path, title, desc: `${h1} — ${company.fullName}.`, body: `${ph.html}<section class="section section--tight"><div class="wrap legal">${html}</div></section>`, ld: [ph.ld] };
}
const req = `<p><b>Продавец / оператор:</b> ${esc(L.entity)}<br>ИНН ${esc(L.inn)}, ОГРН/ОГРНИП ${esc(L.ogrn)}<br>Адрес: ${esc(L.legalAddress)}<br>Телефон: ${company.phoneDisplay}, e-mail: ${company.email}</p>`;

export function privacy() {
  return legalPage('/politika-konfidencialnosti/', 'Политика конфиденциальности | V-Vintage', 'Политика конфиденциальности', `
<p>Настоящая политика описывает, как ${esc(company.fullName)} (далее — Оператор) обрабатывает персональные данные посетителей сайта v-vintage.ru в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».</p>
${req}
<h2>Какие данные мы получаем</h2><p>Имя, номер телефона, адрес электронной почты, адрес доставки и комментарий — только те данные, которые вы сами указываете в формах заявки и оформления заказа. Данные банковских карт мы не получаем и не храним: оплата проходит на защищённой странице платёжного сервиса.</p>
<h2>Зачем</h2><p>Чтобы связаться с вами, ответить на вопрос, рассчитать стоимость, оформить, оплатить и доставить заказ, а также выполнить требования законодательства (в том числе об онлайн-кассах).</p>
<h2>Сроки и условия</h2><p>Данные хранятся не дольше, чем нужно для этих целей, и не передаются третьим лицам, кроме случаев, необходимых для исполнения заказа (служба доставки, платёжный сервис, оператор фискальных данных) или предусмотренных законом.</p>
<h2>Cookie и статистика</h2><p>Сайт использует файлы cookie, сервис веб-аналитики Яндекс.Метрика и онлайн-чат. Они помогают сайту работать корректно и становиться удобнее. Вы можете отключить cookie в настройках браузера.</p>
<h2>Ваши права</h2><p>Вы можете запросить сведения о своих данных, потребовать их уточнения или удаления и отозвать согласие на обработку, написав на ${company.email}.</p>
<p class="muted">Редакция от ${new Date().toLocaleDateString('ru-RU')}.</p>`);
}

export function offer() {
  return legalPage('/oferta/', 'Публичная оферта интернет-магазина | V-Vintage', 'Публичная оферта', `
<p class="notice">Шаблон. Перед подключением онлайн-оплаты текст должен проверить и утвердить продавец.</p>
${req}
<h2>1. Общие положения</h2><p>Настоящий документ является публичной офертой Продавца о продаже товаров и оказании услуг, представленных на сайте v-vintage.ru. Оформление заказа на сайте означает полное принятие условий оферты.</p>
<h2>2. Заказ и цена</h2><p>Цены указаны в рублях. Для товаров, изготавливаемых под размер, и товаров с пометкой «цена по запросу» окончательная стоимость и срок исполнения согласовываются с покупателем после оформления заказа, до оплаты.</p>
<h2>3. Оплата</h2><p>Оплата банковской картой на сайте через платёжный сервис, по ссылке на оплату или по счёту для юридических лиц. Покупатель получает кассовый чек в электронном виде в соответствии с 54-ФЗ.</p>
<h2>4. Доставка и выполнение услуг</h2><p>Самовывоз в г. ${company.city}, доставка и установка по Крыму, отправка транспортной компанией по России. Сроки и стоимость доставки согласовываются индивидуально.</p>
<h2>5. Возврат</h2><p>Товар надлежащего качества, изготовленный по индивидуальным размерам покупателя, возврату не подлежит (п. 4 ст. 26.1 Закона РФ «О защите прав потребителей»). Товар ненадлежащего качества подлежит замене или возврату в установленном законом порядке. Возврат денежных средств производится тем же способом, которым была произведена оплата.</p>
<h2>6. Реквизиты</h2>${req}`);
}

export function delivery() {
  return legalPage('/dostavka-i-oplata/', 'Доставка и оплата | V-Vintage', 'Доставка и оплата', `
<h2>Как оформить заказ</h2><p>Добавьте товары или услуги в корзину и оформите заказ. Для изделий под размер и позиций с пометкой «цена по запросу» менеджер свяжется с вами, уточнит параметры и подтвердит стоимость и сроки.</p>
<h2>Способы получения</h2><ul>${company.shop.delivery.map(d => `<li><b>${esc(d.title)}.</b> ${esc(d.note)}.</li>`).join('')}</ul>
<h2>Способы оплаты</h2><ul><li>Банковской картой онлайн на защищённой странице платёжного сервиса — для товаров с фиксированной ценой.</li><li>По ссылке на оплату, которую пришлёт менеджер после подтверждения заказа.</li><li>По счёту — для юридических лиц.</li></ul>
<p>После оплаты вы получите электронный чек на e-mail или телефон.</p>
<h2>Возврат</h2><p>Условия возврата описаны в <a href="${url('/oferta/')}">публичной оферте</a>. Вопросы по заказу: ${company.phoneDisplay}, ${company.email}.</p>
${req}`);
}

export function notFound() {
  const body = `<section class="phero phero--center"><canvas class="phero__caustics" data-caustics></canvas><div class="wrap phero__inner"><p class="eyebrow">Ошибка 404</p><h1 class="h1">Эта страница уплыла</h1><p class="phero__lead">Возможно, она переехала после обновления сайта. Попробуйте начать с главной или каталога.</p><div class="phero__actions">${btn('На главную', '/')}${btn('Услуги', '/uslugi/', 'ghost')}${btn('Магазин', '/magazin/', 'ghost')}</div></div></section>`;
  return { path: '/404.html', file: '404.html', title: 'Страница не найдена | V-Vintage', desc: 'Страница не найдена.', body, noindex: true };
}
