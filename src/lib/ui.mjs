// Общие хелперы и разметка страниц (шапка, подвал, layout).
import fs from 'fs';

export const company = JSON.parse(fs.readFileSync('src/data/company.json', 'utf8'));
export const galleries = JSON.parse(fs.readFileSync('src/data/galleries.json', 'utf8'));
export const catalog = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

// MODE=preview — github.io (noindex, без Метрики/Jivo, форма в демо-режиме); MODE=prod — v-vintage.ru
export const MODE = process.env.MODE === 'prod' ? 'prod' : 'preview';
export const BASE = MODE === 'prod' ? '/' : (process.env.BASE_URL || '/v-vintage/');
export const VERSION = Date.now().toString(36);

export const url = p => BASE + String(p).replace(/^\//, '');
export const abs = p => company.domain + '/' + String(p).replace(/^\//, '');
export const asset = p => url('assets/' + p) + (/\.(css|js)$/.test(p) ? `?v=${VERSION}` : '');
export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// неразрывный пробел после коротких предлогов и союзов
export const typo = s => String(s).replace(/(^|[\s(«])(в|во|и|с|со|к|ко|о|об|у|а|но|на|по|за|из|от|до|не|для|без|под|над|при|про)\s/gi, '$1$2 ');
export const tel = `tel:${company.phone}`;

export function imgSrc(id, w = 1000) { return url(`assets/img/${id}-${w}.webp`); }

// Картинка из галереи: item = {id,w,h,alt}
export function pic(item, { cls = '', sizes = '(max-width: 700px) 100vw, 50vw', eager = false, alt } = {}) {
  if (!item) return '';
  const h = Math.round(1000 * item.h / item.w);
  const small = item.w > 480;
  return `<img class="${cls}" src="${imgSrc(item.id, 1000)}" ${small ? `srcset="${imgSrc(item.id, 480)} 480w, ${imgSrc(item.id, 1000)} ${Math.min(1000, item.w)}w" sizes="${sizes}"` : ''} width="${Math.min(1000, item.w)}" height="${Math.min(h, item.h)}" alt="${esc(alt ?? item.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
export const gal = (key) => galleries[key]?.items || [];

// ---------- Навигация ----------
export const NAV = [
  { title: 'Услуги', href: '/uslugi/', mega: [
    { title: 'Аквариумы', links: [['Пресноводные', '/uslugi/presnovodnye-akvariumy/'], ['Морские', '/uslugi/morskie-akvariumy/'], ['Рифовые', '/uslugi/rifovye-akvariumy/'], ['Торговые', '/galereya/torgovye-akvariumy/'], ['Чистка и обслуживание', '/obsluzhivanie/']] },
    { title: 'Террариумы', links: [['Террариумы на заказ', '/uslugi/terrariumy/'], ['Палюдариумы', '/uslugi/paludariumy/'], ['Фоны для террариумов', '/dekor/fony-dlya-terrariuma/']] },
    { title: 'Декор', links: [['3D-фоны AQUADEKOR', '/dekor/fony-dlya-akvariuma/'], ['Искусственный камень', '/dekor/iskusstvennyj-kamen/'], ['Все декорации', '/dekor/']] },
    { title: 'Сады и интерьер', links: [['Зимние сады и ландшафт', '/uslugi/zimnie-sady-i-landshaft/'], ['Водоёмы', '/galereya/landshaft-i-vodoemy/'], ['Золочение и декор интерьера', '/interer/']] },
  ] },
  { title: 'Магазин', href: '/magazin/' },
  { title: 'Обслуживание', href: '/obsluzhivanie/' },
  { title: 'Галерея', href: '/galereya/' },
  { title: 'Калькулятор', href: '/kalkulyator/' },
  { title: 'О студии', href: '/o-studii/' },
  { title: 'Контакты', href: '/kontakty/' },
];

const ICON = {
  cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h3.5l1.8 4.6-2.4 1.5a12 12 0 0 0 7 7l1.5-2.4L21 15.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
};
export const icon = n => ICON[n];

export const logo = () => `<a class="logo" href="${url('/')}" aria-label="${esc(company.fullName)} — на главную">
  <svg class="logo__mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9cf9c"/><stop offset="1" stop-color="#b68a4e"/></linearGradient></defs><path d="M6 8h9l9 24 9-24h9L28.5 42h-9z" fill="none" stroke="url(#lg)" stroke-width="2.2"/><path d="M14 30c3-2 6-2 10 0s7 2 10 0" fill="none" stroke="#5ee6c8" stroke-width="2" stroke-linecap="round" class="logo__wave"/></svg>
  <span class="logo__text"><b>V-Vintage</b><small>студия аквадизайна</small></span></a>`;

function header(path) {
  const active = h => path === h || (h !== '/' && path.startsWith(h)) ? ' is-active' : '';
  const items = NAV.map(n => n.mega
    ? `<li class="nav__item has-mega${active(n.href)}"><a href="${url(n.href)}" class="nav__link" aria-haspopup="true">${n.title}<i class="nav__caret"></i></a>
       <div class="mega"><div class="mega__inner">${n.mega.map(c => `<div class="mega__col"><p class="mega__title">${c.title}</p>${c.links.map(([t, h]) => `<a href="${url(h)}">${t}</a>`).join('')}</div>`).join('')}
       <a class="mega__promo" href="${url('/kalkulyator/')}"><span>Калькулятор аквариума</span><small>Объём, вес и толщина стекла за минуту</small>${icon('arrow')}</a></div></div></li>`
    : `<li class="nav__item${active(n.href)}"><a href="${url(n.href)}" class="nav__link">${n.title}</a></li>`).join('');
  return `<header class="hdr" data-hdr>
  <div class="hdr__inner">
    ${logo()}
    <nav class="nav" aria-label="Основное меню"><ul class="nav__list">${items}</ul></nav>
    <div class="hdr__actions">
      <a class="hdr__phone" href="${tel}">${icon('phone')}<span>${company.phoneDisplay}</span></a>
      <button class="hdr__cart" type="button" data-cart-open aria-label="Корзина">${icon('cart')}<span class="hdr__badge" data-cart-count hidden>0</span></button>
      <button class="hdr__burger" type="button" data-burger aria-label="Меню" aria-expanded="false"><i></i><i></i><i></i></button>
    </div>
  </div>
</header>
<div class="mnav" data-mnav hidden>
  <div class="mnav__inner">
    ${NAV.map(n => n.mega ? `<details class="mnav__group"><summary>${n.title}</summary>${n.mega.map(c => `<p class="mnav__sub">${c.title}</p>${c.links.map(([t, h]) => `<a href="${url(h)}">${t}</a>`).join('')}`).join('')}<a href="${url(n.href)}">Все услуги</a></details>` : `<a class="mnav__link" href="${url(n.href)}">${n.title}</a>`).join('')}
    <a class="btn btn--primary mnav__call" href="${tel}">${icon('phone')} ${company.phoneDisplay}</a>
  </div>
</div>`;
}

function footer() {
  const credit = `https://sitomika.ru/?utm_source=${company.creditSlug}&amp;utm_medium=footer&amp;utm_campaign=client-sites`;
  return `<footer class="ftr">
  <div class="ftr__wave" aria-hidden="true"></div>
  <div class="wrap ftr__grid">
    <div class="ftr__brand">${logo()}<p>${esc(company.tagline)}. ${esc(company.city)} и весь Крым, отправка фонов и декора по России.</p>
      <a class="ftr__big" href="${tel}">${company.phoneDisplay}</a><a class="ftr__mail" href="mailto:${company.email}">${company.email}</a></div>
    <div><p class="ftr__h">Услуги</p><a href="${url('/uslugi/presnovodnye-akvariumy/')}">Пресноводные аквариумы</a><a href="${url('/uslugi/morskie-akvariumy/')}">Морские аквариумы</a><a href="${url('/uslugi/rifovye-akvariumy/')}">Рифовые аквариумы</a><a href="${url('/uslugi/paludariumy/')}">Палюдариумы</a><a href="${url('/uslugi/terrariumy/')}">Террариумы</a><a href="${url('/uslugi/zimnie-sady-i-landshaft/')}">Зимние сады</a><a href="${url('/obsluzhivanie/')}">Чистка аквариумов</a><a href="${url('/interer/')}">Интерьерные работы</a></div>
    <div><p class="ftr__h">Магазин</p><a href="${url('/magazin/')}">Каталог</a><a href="${url('/dekor/fony-dlya-akvariuma/')}">3D-фоны AQUADEKOR</a><a href="${url('/dekor/iskusstvennyj-kamen/')}">Искусственный камень</a><a href="${url('/korzina/')}">Корзина</a><a href="${url('/dostavka-i-oplata/')}">Доставка и оплата</a><a href="${url('/oferta/')}">Публичная оферта</a></div>
    <div><p class="ftr__h">Студия</p><a href="${url('/o-studii/')}">О студии</a><a href="${url('/galereya/')}">Галерея</a><a href="${url('/atlas-obitatelej/')}">Атлас обитателей</a><a href="${url('/kalkulyator/')}">Калькулятор аквариума</a><a href="${url('/kontakty/')}">Контакты</a></div>
  </div>
  <div class="wrap ftr__bottom">
    <span>© ${company.since}–${new Date().getFullYear()} ${esc(company.fullName)}</span>
    <span class="ftr__links"><a href="${url('/politika-konfidencialnosti/')}">Политика конфиденциальности</a><a href="${url('/oferta/')}">Оферта</a><a class="footer-credit" href="${credit}" target="_blank" rel="noopener">Разработано в sitomika.ru</a></span>
  </div>
</footer>`;
}

function cartDrawer() {
  return `<aside class="drawer" data-drawer aria-label="Корзина" hidden>
  <div class="drawer__bg" data-cart-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-t">
    <div class="drawer__head"><p class="drawer__title" id="drawer-t">Корзина</p><button class="icon-btn" type="button" data-cart-close aria-label="Закрыть">${icon('close')}</button></div>
    <div class="drawer__body" data-cart-list></div>
    <div class="drawer__foot" data-cart-foot></div>
  </div>
</aside>`;
}

function cookie() {
  return `<div class="cookie" data-cookie hidden><p>Мы используем cookie и Яндекс.Метрику, чтобы сайт работал корректно и становился удобнее, а также онлайн-чат. Продолжая пользоваться сайтом, вы соглашаетесь с <a href="${url('/politika-konfidencialnosti/')}">политикой конфиденциальности</a>.</p><button class="btn btn--sm" type="button" data-cookie-ok>Понятно</button></div>`;
}

function metrika() {
  if (MODE !== 'prod') return '';
  return `<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${company.metrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,ecommerce:"dataLayer"});</script><noscript><div><img src="https://mc.yandex.ru/watch/${company.metrikaId}" style="position:absolute;left:-9999px" alt=""></div></noscript>`;
}

export function breadcrumbs(trail) {
  // trail: [[title, path], ...] последний — текущая страница
  const items = [['Главная', '/'], ...trail];
  const html = `<nav class="crumbs" aria-label="Хлебные крошки">${items.map(([t, p], i) => i < items.length - 1 ? `<a href="${url(p)}">${esc(t)}</a><span>/</span>` : `<span aria-current="page">${esc(t)}</span>`).join('')}</nav>`;
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([t, p], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: abs(p) })) };
  return { html, ld };
}

export function layout(page) {
  const { path, title, desc, body, ld = [], og, noindex, bodyClass = '', scripts = [] } = page;
  const robots = MODE !== 'prod' || noindex ? '<meta name="robots" content="noindex, nofollow">' : '';
  const ogImg = og ? abs(`assets/img/${og}-1000.webp`) : abs('assets/og.jpg');
  const ldAll = [...ld].map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('');
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${robots}
<link rel="canonical" href="${abs(path)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="${esc(company.fullName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#03141a">
<link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${url('favicon.png')}" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${url('apple-touch-icon.png')}">
<link rel="preload" href="${url('assets/fonts/Manrope-normal-300-700-cyrillic.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url('assets/fonts/CormorantGaramond-normal-500-cyrillic.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('css/fonts.css')}">
<link rel="stylesheet" href="${asset('css/main.css')}">
<script>document.documentElement.classList.add('js');window.VV=${JSON.stringify({ base: BASE, mode: MODE, api: url('api/'), currency: company.shop.currency, paymentsEnabled: company.shop.paymentsEnabled, phone: company.phoneDisplay, tel: company.phone, email: company.email, jivo: MODE === 'prod' ? company.jivoId : null, metrika: MODE === 'prod' ? company.metrikaId : null })};</script>
${ldAll}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">К содержимому</a>
<div class="depth" data-depth aria-hidden="true"><span class="depth__line"><i data-depth-fill></i></span><span class="depth__val" data-depth-val>0 м</span></div>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
${cartDrawer()}
${cookie()}
<div class="toast" data-toast role="status" aria-live="polite"></div>
<script src="${asset('js/main.js')}" defer></script>
${scripts.map(s => `<script src="${asset('js/' + s)}" defer></script>`).join('\n')}
${metrika()}
</body>
</html>`;
}

// ---------- Переиспользуемые блоки ----------
export function leadForm({ id = 'lead', title = 'Обсудим ваш проект', text = 'Оставьте телефон — перезвоним, ответим на вопросы и бесплатно подготовим смету.', topic = '' } = {}) {
  return `<section class="section lead" id="${id}">
  <div class="wrap lead__grid">
    <div class="lead__text reveal">
      <p class="eyebrow">Консультация бесплатно</p>
      <h2 class="h2">${typo(title)}</h2>
      <p class="lead__p">${typo(text)}</p>
      <ul class="lead__free">
        <li>Консультация по телефону</li><li>Смета по электронной почте</li><li>Выезд менеджера на объект для оформления заказа</li>
      </ul>
      <a class="lead__phone" href="${tel}">${company.phoneDisplay}</a>
    </div>
    <form class="form glass reveal" data-form="lead" novalidate>
      <input type="hidden" name="topic" value="${esc(topic)}">
      <label class="hp" aria-hidden="true">Не заполняйте<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
      <div class="field"><input id="${id}-name" name="name" type="text" autocomplete="name" placeholder=" " required><label for="${id}-name">Ваше имя</label></div>
      <div class="field"><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder=" " required><label for="${id}-phone">Телефон</label></div>
      <div class="field"><textarea id="${id}-msg" name="message" rows="3" placeholder=" "></textarea><label for="${id}-msg">Что хотите сделать? Размеры, место, пожелания</label></div>
      <label class="check"><input type="checkbox" name="consent" value="1" checked required><span>Согласен на обработку персональных данных согласно <a href="${url('/politika-konfidencialnosti/')}" target="_blank">политике конфиденциальности</a></span></label>
      <button class="btn btn--primary btn--wide" type="submit"><span>Получить консультацию</span>${icon('arrow')}</button>
      <p class="form__note" data-form-note></p>
    </form>
  </div>
</section>`;
}

export function galleryGrid(items, { limit = 0, cls = '' } = {}) {
  const list = limit ? items.slice(0, limit) : items;
  return `<div class="masonry ${cls}" data-lightbox-group>${list.map((it, i) => `<a class="masonry__item reveal" href="${imgSrc(it.id, 1000)}" data-lightbox data-caption="${esc(it.alt)}" style="--i:${i % 6}">${pic(it, { sizes: '(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw' })}</a>`).join('')}</div>`;
}

export function pageHero({ eyebrow, title, lead, img, trail, actions = '' }) {
  const bc = breadcrumbs(trail);
  return {
    ld: bc.ld,
    html: `<section class="phero">
  <div class="phero__bg" aria-hidden="true">${img ? pic(img, { sizes: '100vw', eager: true, alt: '' }) : ''}<canvas class="phero__caustics" data-caustics></canvas></div>
  <div class="wrap phero__inner">
    ${bc.html}
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1 class="h1 split">${typo(title)}</h1>
    ${lead ? `<p class="phero__lead">${typo(lead)}</p>` : ''}
    ${actions ? `<div class="phero__actions">${actions}</div>` : ''}
  </div>
</section>`,
  };
}

export const btn = (text, href, kind = 'primary') => `<a class="btn btn--${kind}" href="${href.startsWith('http') || href.startsWith('tel:') || href.startsWith('#') ? href : url(href)}"><span>${text}</span>${icon('arrow')}</a>`;

export function faq(items) {
  const html = `<div class="faq">${items.map(([q, a]) => `<details class="faq__item reveal"><summary>${typo(q)}<i></i></summary><div class="faq__a"><p>${typo(a)}</p></div></details>`).join('')}</div>`;
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return { html, ld };
}

export function orgLd() {
  return {
    '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', '@id': company.domain + '/#org',
    name: company.fullName, alternateName: company.name, url: company.domain + '/', telephone: company.phone, email: company.email,
    address: { '@type': 'PostalAddress', addressLocality: company.city, addressRegion: company.region, addressCountry: 'RU' },
    areaServed: company.areaServed.map(c => ({ '@type': 'City', name: c })),
    image: abs('assets/og.jpg'), logo: abs('favicon.png'), foundingDate: String(company.since),
  };
}
