import { company, url, esc, typo, pic, gal, icon, btn, pageHero, catalog, imgSrc, abs } from '../lib/ui.mjs';

export const fmtPrice = p => p == null ? 'Цена по запросу' : new Intl.NumberFormat('ru-RU').format(p) + ' ₽';

// Фото товара из галерей
export function productImages(p) {
  const im = p.images || {};
  let items = gal(im.gallery);
  if (im.series) items = items.filter(x => x.code && x.code[0] === im.series);
  if (im.ids) items = im.ids.map(i => gal(im.gallery)[i]).filter(Boolean);
  if (im.take) items = items.slice(0, im.take);
  return items;
}
export const seriesModels = s => gal('fony-dlya-akvariuma').filter(x => x.code && x.code[0] === s);

export function productCard(p, i = 0) {
  const imgs = productImages(p);
  const cat = catalog.categories.find(c => c.id === p.cat);
  return `<article class="pcard reveal" data-cat="${p.cat}" style="--i:${i % 4}">
    <a class="pcard__img" href="${url('/magazin/' + p.slug + '/')}" tabindex="-1" aria-hidden="true">${pic(imgs[0], { sizes: '(max-width: 600px) 50vw, 25vw', alt: '' })}${imgs[1] ? pic(imgs[1], { cls: 'pcard__alt', sizes: '(max-width: 600px) 50vw, 25vw', alt: '' }) : ''}</a>
    <div class="pcard__body">
      <p class="pcard__cat">${esc(cat?.title || '')}</p>
      <h3 class="pcard__t"><a href="${url('/magazin/' + p.slug + '/')}">${esc(p.title)}</a></h3>
      <p class="pcard__d">${typo(esc(p.short))}</p>
      <div class="pcard__foot"><span class="price${p.price == null ? ' price--ask' : ''}">${fmtPrice(p.price)}</span><a class="pcard__more" href="${url('/magazin/' + p.slug + '/')}" aria-label="Подробнее: ${esc(p.title)}">${icon('arrow')}</a></div>
    </div>
  </article>`;
}

export function shopIndex() {
  const ph = pageHero({ eyebrow: 'Интернет-магазин', title: 'Магазин V-Vintage', lead: '3D-фоны AQUADEKOR, декор из искусственного камня, террариумы, аквариумы под размер и услуги по обслуживанию. Оформите заказ онлайн — менеджер подтвердит детали и сроки.', img: gal('fony-dlya-akvariuma')[22], trail: [['Магазин', '/magazin/']] });
  const body = `${ph.html}
<section class="section section--tight">
  <div class="wrap">
    <div class="chips" role="tablist" data-filter>
      <button class="chip is-on" type="button" data-f="*">Все <sup>${catalog.products.length}</sup></button>
      ${catalog.categories.map(c => `<button class="chip" type="button" data-f="${c.id}">${esc(c.title)} <sup>${catalog.products.filter(p => p.cat === c.id).length}</sup></button>`).join('')}
    </div>
    <div class="pgrid" data-filter-grid>${catalog.products.map(productCard).join('')}</div>
    <div class="shop-note glass reveal">
      <p><b>Как работает заказ.</b> ${typo('Большинство изделий мы делаем под размер, поэтому окончательную цену и срок менеджер подтверждает после оформления заказа. Онлайн-оплата картой станет доступна для товаров с фиксированной ценой.')} <a href="${url('/dostavka-i-oplata/')}">Доставка и оплата</a></p>
    </div>
  </div>
</section>`;
  return {
    path: '/magazin/', title: 'Интернет-магазин: 3D-фоны AQUADEKOR, террариумы, декор, услуги | V-Vintage',
    desc: 'Купить объёмный фон AQUADEKOR, фон для террариума, искусственный камень, террариум или аквариум под размер. Заказ чистки и обслуживания аквариума онлайн. Симферополь, доставка по России.',
    body, ld: [ph.ld], scripts: ['shop.js'],
  };
}

// вариант с картинкой: o.img[i] — номер фото товара, при выборе оно встаёт главным
const optImg = (o, i, p) => { const m = o.img && o.img[i] != null && productImages(p)[o.img[i]]; return m ? ` data-img="${imgSrc(m.id)}"` : ''; };

function optionField(o, p) {
  const name = `opt-${o.id}`;
  if (o.type === 'select') return `<fieldset class="opt"><legend>${esc(o.label)}</legend><div class="opt__pills">${o.values.map((v, i) => `<label class="pill"><input type="radio" name="${name}" value="${esc(v)}" ${i === 0 ? 'checked' : ''} data-opt="${o.id}" data-label="${esc(o.label)}"${optImg(o, i, p)}><span>${esc(v)}</span></label>`).join('')}</div></fieldset>`;
  if (o.type === 'dims2' || o.type === 'dims3') {
    const f = o.type === 'dims3' ? [['l', 'Длина'], ['w', 'Ширина'], ['h', 'Высота']] : [['w', 'Ширина'], ['h', 'Высота']];
    return `<fieldset class="opt" data-dims="${o.id}" data-label="${esc(o.label)}"><legend>${esc(o.label)}</legend><div class="opt__dims">${f.map(([k, t]) => `<label class="dim"><span>${t}</span><input type="number" inputmode="numeric" min="10" max="1000" step="1" name="${o.id}-${k}" placeholder="см"></label>`).join('<i>×</i>')}</div><p class="opt__hint">Можно не заполнять — уточним при подтверждении заказа.</p></fieldset>`;
  }
  if (o.type === 'models') {
    const models = seriesModels(o.series);
    return `<fieldset class="opt"><legend>${esc(o.label)} <output data-model-out>${models[0]?.code || ''}</output></legend><div class="models">${models.map((m, i) => `<label class="model" title="Модель ${m.code}"><input type="radio" name="${name}" value="${m.code}" ${i === 0 ? 'checked' : ''} data-opt="${o.id}" data-label="${esc(o.label)}" data-img="${imgSrc(m.id)}">${pic(m, { sizes: '90px', alt: 'Фон AQUADEKOR ' + m.code })}<span>${m.code}</span></label>`).join('')}</div></fieldset>`;
  }
  return '';
}

export function productPage(p) {
  const imgs = productImages(p);
  const cat = catalog.categories.find(c => c.id === p.cat);
  const trail = [['Магазин', '/magazin/'], [cat.title, '/magazin/#' + cat.id], [p.title, '/magazin/' + p.slug + '/']];
  const crumbs = `<nav class="crumbs" aria-label="Хлебные крошки"><a href="${url('/')}">Главная</a><span>/</span><a href="${url('/magazin/')}">Магазин</a><span>/</span><span aria-current="page">${esc(p.title)}</span></nav>`;
  const related = catalog.products.filter(x => x.cat === p.cat && x.slug !== p.slug).slice(0, 4);
  const body = `
<section class="product">
  <div class="wrap">
    ${crumbs}
    <div class="product__grid">
      <div class="product__media" data-pgallery>
        <a class="product__main" href="${imgSrc(imgs[0]?.id)}" data-lightbox data-caption="${esc(p.title)}">${pic(imgs[0], { sizes: '(max-width: 900px) 100vw, 55vw', eager: true, alt: p.title })}</a>
        ${imgs.length > 1 ? `<div class="product__thumbs">${imgs.slice(0, 8).map((m, i) => `<button type="button" class="product__thumb${i === 0 ? ' is-on' : ''}" data-src="${imgSrc(m.id)}" aria-label="Фото ${i + 1}">${pic(m, { sizes: '120px', alt: '' })}</button>`).join('')}</div>` : ''}
      </div>
      <div class="product__info">
        <p class="eyebrow">${esc(cat.title)}</p>
        <h1 class="h2 product__title">${esc(p.title)}</h1>
        <p class="product__short">${typo(esc(p.short))}</p>
        <div class="product__price"><span class="price price--lg${p.price == null ? ' price--ask' : ''}">${fmtPrice(p.price)}</span><small>${esc(p.unit)}</small></div>
        <form class="product__form" data-product='${esc(JSON.stringify({ slug: p.slug, title: p.title, price: p.price, unit: p.unit, img: imgs[0] ? imgSrc(imgs[0].id, 480) : '' }))}'>
          ${(p.options || []).map(o => optionField(o, p)).join('')}
          <div class="product__buy">
            <div class="qty"><button type="button" data-qty="-1" aria-label="Меньше">−</button><input type="number" name="qty" value="1" min="1" max="99" aria-label="Количество"><button type="button" data-qty="1" aria-label="Больше">+</button></div>
            <button class="btn btn--primary btn--grow" type="submit"><span>${p.price == null ? 'Добавить в заказ' : 'В корзину'}</span>${icon('cart')}</button>
          </div>
          ${p.price == null ? `<p class="product__ask">${typo('Цена зависит от размера и комплектации. Добавьте товар в заказ — менеджер рассчитает стоимость и пришлёт ссылку на оплату или счёт.')}</p>` : ''}
        </form>
        <div class="product__desc">${p.desc.map(t => `<p>${typo(t)}</p>`).join('')}</div>
        ${p.specs?.length ? `<dl class="specs">${p.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
        <ul class="product__trust"><li>Консультация бесплатно</li><li>Доставка по Крыму и России</li><li><a href="${url('/dostavka-i-oplata/')}">Оплата и возврат</a></li></ul>
      </div>
    </div>
  </div>
</section>
${related.length ? `<section class="section section--tight"><div class="wrap"><div class="sec-head"><h2 class="h2">Похожие товары</h2></div><div class="pgrid">${related.map(productCard).join('')}</div></div></section>` : ''}`;
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: p.desc.join(' '), image: imgs.slice(0, 4).map(m => abs(`assets/img/${m.id}-1000.webp`)), brand: { '@type': 'Brand', name: p.cat === 'fony' ? 'AQUADEKOR' : company.name }, category: cat.title };
  // Offer добавляем только при наличии цены: оффер без цены невалиден для Яндекса/Google
  if (p.price != null) ld.offers = { '@type': 'Offer', price: p.price, priceCurrency: 'RUB', availability: 'https://schema.org/InStock', url: abs('/magazin/' + p.slug + '/') };
  const bl = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Главная', '/'], ['Магазин', '/magazin/'], [p.title, '/magazin/' + p.slug + '/']].map(([t, u], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: abs(u) })) };
  return {
    path: '/magazin/' + p.slug + '/', title: `${p.title} — купить в Симферополе | V-Vintage`,
    desc: `${p.title}: ${p.short} Заказ онлайн, доставка по Крыму и России. ${p.price == null ? 'Цену рассчитаем бесплатно.' : 'Цена ' + fmtPrice(p.price) + '.'}`,
    body, ld: [ld, bl], og: imgs[0]?.id, scripts: ['shop.js'],
  };
}

export function cartPage() {
  const body = `
<section class="phero phero--compact"><div class="wrap phero__inner">
  <nav class="crumbs" aria-label="Хлебные крошки"><a href="${url('/')}">Главная</a><span>/</span><a href="${url('/magazin/')}">Магазин</a><span>/</span><span aria-current="page">Корзина</span></nav>
  <h1 class="h1">Оформление заказа</h1>
</div></section>
<section class="section section--tight checkout" data-checkout>
  <div class="wrap checkout__grid">
    <div>
      <div class="checkout__items" data-co-items><p class="muted">Загружаем корзину…</p></div>
    </div>
    <form class="form glass checkout__form" data-form="order" novalidate>
      <h2 class="h3">Контакты и доставка</h2>
      <label class="hp" aria-hidden="true">Не заполняйте<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
      <div class="field"><input id="co-name" name="name" autocomplete="name" placeholder=" " required><label for="co-name">Имя и фамилия</label></div>
      <div class="field"><input id="co-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder=" " required><label for="co-phone">Телефон</label></div>
      <div class="field"><input id="co-email" name="email" type="email" autocomplete="email" placeholder=" "><label for="co-email">E-mail (для чека и счёта)</label></div>
      <fieldset class="opt"><legend>Получение</legend><div class="radios">${company.shop.delivery.map((d, i) => `<label class="radio"><input type="radio" name="delivery" value="${d.id}" ${i === 0 ? 'checked' : ''}><span><b>${esc(d.title)}</b><small>${esc(d.note)}</small></span></label>`).join('')}</div></fieldset>
      <div class="field" data-address><input id="co-addr" name="address" autocomplete="street-address" placeholder=" "><label for="co-addr">Город и адрес</label></div>
      <fieldset class="opt"><legend>Оплата</legend><div class="radios" data-pay-methods>
        <label class="radio" data-pay="online"><input type="radio" name="payment" value="online"><span><b>Картой онлайн</b><small data-pay-online-note>Доступно, когда у всех товаров в заказе есть цена</small></span></label>
        <label class="radio"><input type="radio" name="payment" value="confirm" checked><span><b>После подтверждения менеджером</b><small>Пришлём ссылку на оплату или счёт для юрлица</small></span></label>
      </div></fieldset>
      <div class="field"><textarea id="co-comment" name="comment" rows="3" placeholder=" "></textarea><label for="co-comment">Комментарий к заказу</label></div>
      <label class="check"><input type="checkbox" name="consent" value="1" checked required><span>Согласен с <a href="${url('/oferta/')}" target="_blank">условиями оферты</a> и на обработку персональных данных по <a href="${url('/politika-konfidencialnosti/')}" target="_blank">политике конфиденциальности</a></span></label>
      <div class="checkout__total" data-co-total></div>
      <button class="btn btn--primary btn--wide" type="submit" data-co-submit><span>Оформить заказ</span>${icon('arrow')}</button>
      <p class="form__note" data-form-note></p>
    </form>
  </div>
</section>`;
  return { path: '/korzina/', title: 'Корзина и оформление заказа | V-Vintage', desc: 'Оформление заказа в интернет-магазине студии V-Vintage.', body, noindex: true, scripts: ['checkout.js'] };
}

export function thanksPage() {
  const body = `<section class="phero phero--center"><canvas class="phero__caustics" data-caustics></canvas><div class="wrap phero__inner">
  <p class="eyebrow">Спасибо!</p><h1 class="h1" data-thanks-title>Заказ принят</h1>
  <p class="phero__lead" data-thanks-text>Мы свяжемся с вами в рабочее время, чтобы подтвердить детали, цену и сроки. Если вопрос срочный — позвоните: <a href="tel:${company.phone}">${company.phoneDisplay}</a>.</p>
  <div class="phero__actions">${btn('Вернуться в магазин', '/magazin/')}${btn('На главную', '/', 'ghost')}</div>
</div></section>`;
  return { path: '/spasibo/', title: 'Спасибо за заказ | V-Vintage', desc: 'Заказ принят.', body, noindex: true, scripts: ['checkout.js'] };
}
