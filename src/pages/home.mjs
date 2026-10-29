import { company, url, esc, typo, pic, gal, icon, tel, btn, leadForm, faq, orgLd, imgSrc } from '../lib/ui.mjs';

const SERVICES = [
  { t: 'Пресноводные аквариумы', d: 'Живые растения, коряги и стаи рыб — природный биотоп в интерьере.', h: '/uslugi/presnovodnye-akvariumy/', img: ['presnovodnye-akvariumy', 21], big: true },
  { t: 'Морские аквариумы', d: 'Яркие рыбы южных морей и тумба под ваш интерьер.', h: '/uslugi/morskie-akvariumy/', img: ['morskie-akvariumy', 3] },
  { t: 'Рифовые аквариумы', d: 'Кораллы, анемоны и беспозвоночные с правильным светом и фильтрацией.', h: '/uslugi/rifovye-akvariumy/', img: ['rifovye-akvariumy', 0] },
  { t: 'Палюдариумы', d: 'Вода, суша и тропический лес в одной стеклянной системе.', h: '/uslugi/paludariumy/', img: ['paludariumy', 3] },
  { t: 'Террариумы', d: 'Горизонтальные, вертикальные и угловые, со светом и обогревом.', h: '/uslugi/terrariumy/', img: ['terrariumy', 20], wide: true },
  { t: 'Зимние сады', d: 'Вертикальное озеленение и живые комнаты с климат-контролем.', h: '/uslugi/zimnie-sady-i-landshaft/', img: ['zimnie-sady', 9] },
  { t: '3D-фоны AQUADEKOR', d: 'Рельефные копии скал и корней под размер аквариума.', h: '/dekor/fony-dlya-akvariuma/', img: ['fony-dlya-akvariuma', 9] },
  { t: 'Водоёмы и ландшафт', d: 'Пруды, водопады и искусственные скалы для участка.', h: '/galereya/landshaft-i-vodoemy/', img: ['landshaft-i-vodoemy', 4] },
];

const STEPS = [
  ['Консультация', 'Обсуждаем задачу по телефону или в мессенджере, бесплатно отвечаем на вопросы и присылаем предварительную смету на почту.'],
  ['Выезд и замер', 'Специалист приезжает на объект, делает замеры и предлагает решения. Колонны, ниши и простенки обыгрываем в проекте.'],
  ['Дизайн-проект', 'Готовим три варианта с 3D-визуализацией, чтобы вы увидели результат до начала работ.'],
  ['Изготовление', 'Делаем ёмкость из силикатного или акрилового стекла, тумбу, крышку и декорации: скульпторы и художники создают безопасные и реалистичные элементы.'],
  ['Установка и запуск', 'Монтируем, подключаем оборудование, запускаем систему и подбираем обитателей.'],
  ['Обслуживание', 'Берём на регулярное обслуживание: чистка, подмена воды, контроль параметров. Вам остаётся только любоваться.'],
];

export default function home() {
  const f = faq([
    ['Из какого стекла вы делаете аквариумы?', 'Работаем с силикатным и акриловым стеклом. Для панорамных и крупных аквариумов советуем осветлённое стекло: оно не даёт зеленоватого оттенка. Толщину рассчитываем под размеры — ориентировочно её можно прикинуть в нашем калькуляторе.'],
    ['Можно ли встроить аквариум в нишу, колонну или перегородку?', 'Да. Нестандартные формы, встроенные в интерьер, — наша основная работа. Колонны, простенки, ниши и выступы помещения можно скрыть или обыграть аквариумом.'],
    ['Сколько стоит аквариум на заказ?', 'Цена зависит от размера, типа стекла, оборудования и оформления. Консультация и смета по электронной почте бесплатны — оставьте заявку, и мы рассчитаем ваш вариант.'],
    ['Вы работаете только в Симферополе?', 'Изготавливаем и обслуживаем аквариумы по всему Крыму: Симферополь, Севастополь, Ялта, Евпатория, Феодосия, Керчь, Алушта, Судак. Работы выполняем и по России, а фоны и декор отправляем транспортными компаниями.'],
    ['Обслуживаете аквариумы, которые делали не вы?', 'Да, мы предлагаем обслуживание, чистку и перезапуск ваших аквариумов и водоёмов, даже если их делали не мы.'],
    ['Чем палюдариум отличается от аквариума?', 'Палюдариум, или акватеррариум, объединяет воду и сушу: кусочек реки, болото или тропический лес под стеклом. В нём живут растения, небольшие рыбы и земноводные, которым нужна высокая влажность.'],
  ]);

  const presn = gal('presnovodnye-akvariumy'), mor = gal('morskie-akvariumy'), pal = gal('paludariumy'), ter = gal('terrariumy'), zim = gal('zimnie-sady'), land = gal('landshaft-i-vodoemy');
  const showcase = [
    [mor[34], 'Морской аквариум', '/galereya/morskie-akvariumy/'], [presn[46], 'Пресноводный аквариум', '/galereya/presnovodnye-akvariumy/'],
    [pal[8], 'Палюдариум', '/galereya/paludariumy/'], [ter[22], 'Террариум', '/galereya/terrariumy/'],
    [mor[50], 'Аквариум-перегородка', '/galereya/morskie-akvariumy/'], [zim[4], 'Вертикальный сад', '/galereya/zimnie-sady/'],
    [presn[10], 'Аквариум с живыми растениями', '/galereya/presnovodnye-akvariumy/'], [land[46], 'Декоративный водоём', '/galereya/landshaft-i-vodoemy/'],
    [mor[44], 'Аквариум в гостиной', '/galereya/morskie-akvariumy/'], [ter[13], 'Объёмный фон в террариуме', '/galereya/terrariumy/'],
  ];
  const fony = gal('fony-dlya-akvariuma');
  const series = [['A', 'Скалы', 9], ['B', 'Слоистый камень', 55], ['C', 'Валуны', 72], ['D', 'Пористый камень и коряга', 87], ['G', 'Корни', 95]];
  // Соты первого экрана. Маленькая сота: апофема 1, зазор G, соседи в решётке через 2 + G.
  // Большая сота (апофема 2 + G/2) стоит в узле решётки и прилегает к шести соседям с тем же зазором.
  const G = 0.14, D = 2 + G, K = Math.sqrt(3) / 2;
  const cell = (i, j) => [3 + 1.5 * G + D * (i + j / 2), -1 / Math.sqrt(3) - G / 4 / K + D * K * j];
  const rif = gal('rifovye-akvariumy');
  const hive = [
    { at: [0, 0], big: true, img: mor[3] },
    { at: cell(0, -1), img: pal[15] },
    { at: cell(0, 0), img: presn[60] },
    { at: cell(1, -2), img: rif[0] },
    { at: cell(0, 1), img: ter[5] },
    { at: cell(-2, 2), cta: true },
    { at: cell(-1, 2), kind: 'glass' },
    { at: cell(-3, 2), kind: 'line' },
  ];
  const X0 = -2.07 - G / 2, X1 = cell(0, 1)[0] + 1, Y0 = cell(1, -2)[1] - 1 / K, Y1 = cell(-2, 2)[1] + 1 / K;
  const W = X1 - X0, H = Y1 - Y0, pct = v => (v * 100).toFixed(3) + '%';
  const hexStyle = h => { const a = h.big ? 2 + G / 2 : 1; return `left:${pct((h.at[0] - a - X0) / W)};top:${pct((h.at[1] - a / K - Y0) / H)};width:${pct(2 * a / W)}`; };
  const hex = (h, i) => h.cta
    ? `<a class="hex hex--cta" href="${url('/galereya/')}" style="${hexStyle(h)}"><span>Смотреть<br>работы</span>${icon('arrow')}</a>`
    : `<figure class="hex${h.big ? ' hex--big' : ''}${h.kind ? ` hex--${h.kind}` : ''}" style="${hexStyle(h)}" aria-hidden="true">${h.img ? pic(h.img, { sizes: h.big ? '(max-width: 900px) 50vw, 24vw' : '(max-width: 900px) 25vw, 12vw', eager: i === 0, alt: '' }) : ''}</figure>`;
  // фон первого экрана на телефоне: <source> только для узких экранов, на компьютере не грузится
  const heroPhone = mor.find(p => p.id.startsWith('hotel-h2o'));

  const body = `
<section class="hero" data-hero>
  <canvas class="hero__gl" data-caustics="hero" aria-hidden="true"></canvas>
  <div class="hero__rays" aria-hidden="true"></div>
  ${heroPhone ? `<picture class="hero__photo" aria-hidden="true"><source media="(max-width: 640px)" srcset="${imgSrc(heroPhone.id, 1000)}"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" fetchpriority="high" decoding="async"></picture>` : ''}
  <div class="hero__bubbles" data-bubbles aria-hidden="true"></div>
  <div class="wrap hero__inner">
    <div class="hero__copy">
      <p class="eyebrow reveal">Студия аквадизайна · ${esc(company.city)} · с ${company.since} года</p>
      <h1 class="hero__title split">Аквариумы и&nbsp;террариумы <em>на&nbsp;заказ</em> в&nbsp;Крыму</h1>
      <p class="hero__lead reveal">${typo('Проектируем, изготавливаем и обслуживаем живые интерьерные системы: аквариумы, палюдариумы, террариумы и зимние сады. Объёмные 3D-фоны AQUADEKOR и декор из искусственного камня — с доставкой по России.')}</p>
      <div class="hero__actions reveal">
        ${btn('Рассчитать аквариум', '/kalkulyator/')}
        ${btn('Перейти в магазин', '/magazin/', 'ghost')}
      </div>
      <ul class="hero__facts reveal">
        <li><b>3D</b><span>дизайн-проект в трёх вариантах</span></li>
        <li><b>0 ₽</b><span>консультация и смета</span></li>
        <li><b>8</b><span>городов Крыма с выездом</span></li>
      </ul>
    </div>
    <div class="hero__stack" data-parallax>
      <div class="hero__glow" aria-hidden="true"></div>
      <div class="hive" style="aspect-ratio:${(W / H).toFixed(4)}">${hive.map(hex).join('')}</div>
    </div>
  </div>
  <a class="hero__scroll" href="#directions" aria-label="Листать вниз"><span></span></a>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee__track">${Array(2).fill(['Пресноводные аквариумы', 'Морские аквариумы', 'Рифовые системы', 'Палюдариумы', 'Террариумы', 'Зимние сады', '3D-фоны AQUADEKOR', 'Декоративные водоёмы', 'Чистка и обслуживание'].map(t => `<span>${t}</span><i>✦</i>`).join('')).join('')}</div></div>

<section class="section" id="directions">
  <div class="wrap">
    <div class="sec-head">
      <p class="eyebrow reveal">Что мы создаём</p>
      <h2 class="h2 split">Природа, встроенная <em>в&nbsp;интерьер</em></h2>
      <p class="sec-head__p reveal">${typo('Стандартные и нестандартные модели: в нишу, колонну, перегородку или как центр комнаты. Каждый проект — под ваше пространство и ваших питомцев.')}</p>
    </div>
    <div class="bento">
      ${SERVICES.map((s, i) => `<a class="bento__card${s.big ? ' bento__card--big' : ''}${s.wide ? ' bento__card--wide' : ''} reveal tilt" href="${url(s.h)}" style="--i:${i}">
        ${pic(gal(s.img[0])[s.img[1]], { sizes: s.big ? '(max-width: 700px) 100vw, 50vw' : '(max-width: 700px) 100vw, 25vw', alt: '' })}
        <span class="bento__shade"></span>
        <span class="bento__body"><span class="bento__num">0${i + 1}</span><span class="bento__t">${s.t}</span><span class="bento__d">${typo(s.d)}</span><span class="bento__go">${icon('arrow')}</span></span>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="section steps" data-steps>
  <div class="wrap steps__grid">
    <div class="steps__sticky">
      <p class="eyebrow reveal">Как мы работаем</p>
      <h2 class="h2 split">От идеи <em>до первой рыбки</em></h2>
      <p class="sec-head__p reveal">${typo('Шесть шагов, на каждом из которых вы знаете, что происходит. Консультация, смета и выезд менеджера — бесплатно.')}</p>
      <div class="steps__meter" aria-hidden="true"><i data-steps-fill></i></div>
    </div>
    <ol class="steps__list">
      ${STEPS.map(([t, d], i) => `<li class="steps__item reveal" data-step><span class="steps__n">${String(i + 1).padStart(2, '0')}</span><div><h3>${t}</h3><p>${typo(d)}</p></div></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section showcase" data-showcase>
  <div class="showcase__pin">
    <div class="wrap showcase__head">
      <div><p class="eyebrow">Галерея</p><h2 class="h2">Живые интерьеры</h2></div>
      ${btn('Вся галерея', '/galereya/', 'ghost')}
    </div>
    <div class="showcase__track" data-showcase-track>
      ${showcase.map(([p, t, h], i) => `<a class="showcase__item" href="${url(h)}">${pic(p, { sizes: '(max-width: 700px) 80vw, 40vw', alt: t })}<span class="showcase__cap"><small>${String(i + 1).padStart(2, '0')}</small>${t}</span></a>`).join('')}
    </div>
  </div>
</section>

<section class="section calc-teaser">
  <div class="wrap calc-teaser__grid">
    <div class="reveal">
      <p class="eyebrow">Калькулятор</p>
      <h2 class="h2">Каким будет <em>ваш аквариум?</em></h2>
      <p class="sec-head__p">${typo('Подвигайте ползунки: посчитаем объём, вес с водой и ориентировочную толщину стекла. Подробный расчёт с оборудованием — на странице калькулятора.')}</p>
      <form class="mini-calc" data-mini-calc>
        <label><span>Длина <output data-out="l">120</output> см</span><input type="range" name="l" min="30" max="400" step="5" value="120"></label>
        <label><span>Глубина <output data-out="w">50</output> см</span><input type="range" name="w" min="20" max="150" step="5" value="50"></label>
        <label><span>Высота <output data-out="h">60</output> см</span><input type="range" name="h" min="20" max="150" step="5" value="60"></label>
      </form>
      <dl class="mini-calc__res">
        <div><dt>Объём</dt><dd data-res="vol">360 л</dd></div>
        <div><dt>Вес с водой</dt><dd data-res="weight">≈ 430 кг</dd></div>
        <div><dt>Стекло</dt><dd data-res="glass">10 мм</dd></div>
      </dl>
      ${btn('Подробный расчёт', '/kalkulyator/')}
    </div>
    <div class="tank3d reveal" data-tank aria-hidden="true">
      <div class="tank3d__box">
        <div class="tank3d__water"><span class="tank3d__surface"></span><i class="tank3d__fish"></i><i class="tank3d__fish tank3d__fish--2"></i></div>
        <div class="tank3d__plants"></div>
      </div>
      <div class="tank3d__stand"></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head sec-head--row">
      <div><p class="eyebrow reveal">Магазин</p><h2 class="h2 split">Объёмные фоны <em>AQUADEKOR</em></h2></div>
      <p class="sec-head__p reveal">${typo('Рельефные копии скал, камней и корней ручной работы. Безопасны для рыб и растений, прячут оборудование и делают аквариум глубже. Изготавливаются под размер.')}</p>
    </div>
    <div class="series">
      ${series.map(([c, t, i], k) => `<a class="series__card reveal tilt" href="${url('/magazin/fon-aquadekor-seriya-' + c.toLowerCase() + '/')}" style="--i:${k}">${pic(fony[i], { sizes: '(max-width: 700px) 50vw, 20vw', alt: 'Фон AQUADEKOR, серия ' + c })}<span class="series__code">${c}</span><span class="series__t">${t}</span><span class="series__n">${fony.filter(x => x.code && x.code[0] === c).length} моделей</span></a>`).join('')}
    </div>
  </div>
</section>

<section class="section service-band">
  <div class="wrap service-band__grid">
    <div class="service-band__img reveal">${pic(mor[15], { sizes: '(max-width: 900px) 100vw, 45vw', alt: 'Обслуживание морского аквариума' })}<span class="service-band__badge"><b>Чистка</b>аквариумов по Крыму</span></div>
    <div class="reveal">
      <p class="eyebrow">Обслуживание</p>
      <h2 class="h2">Чистый аквариум <em>без ваших усилий</em></h2>
      <p class="sec-head__p">${typo('Разовая чистка, перезапуск или регулярное обслуживание по графику. Пресноводные, морские и рифовые аквариумы, декоративные водоёмы.')}</p>
      <ul class="cities">${company.areaServed.map(c => `<li>${c}</li>`).join('')}</ul>
      <div class="row-actions">${btn('Заказать чистку', '/magazin/chistka-akvariuma/')}${btn('Подробнее', '/obsluzhivanie/', 'ghost')}</div>
    </div>
  </div>
</section>

<section class="section why">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow reveal">Почему V-Vintage</p><h2 class="h2 split">Делаем то, чего <em>не&nbsp;купить в&nbsp;магазине</em></h2></div>
    <div class="why__grid">
      ${[
        ['Индивидуальный проект', 'Любые идеи и формы. Аквариум полностью «вживается» в интерьер и скрывает недостатки помещения.'],
        ['Своя мастерская декора', 'Скульпторы и художники создают безопасные и реалистичные декорации: камни, скалы, рифы, корни.'],
        ['Стекло и акрил', 'Работаем с силикатным и акриловым стеклом, поэтому большие аквариумы для нас не проблема.'],
        ['Под ключ', 'От 3D-проекта до подбора обитателей, запуска и регулярного обслуживания.'],
        ['Крым и вся Россия', 'Выезжаем по Крыму, работы выполняем и в других регионах, декор отправляем транспортными компаниями.'],
        ['Бесплатно', 'Консультация по телефону, смета по почте и выезд менеджера для оформления заказа.'],
      ].map(([t, d], i) => `<div class="why__item reveal" style="--i:${i}"><span class="why__ico" aria-hidden="true"></span><h3>${t}</h3><p>${typo(d)}</p></div>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap faq-wrap">
    <div class="sec-head"><p class="eyebrow reveal">Вопросы</p><h2 class="h2 split">Часто <em>спрашивают</em></h2>
    <p class="sec-head__p reveal">Не нашли ответ? Позвоните: <a href="${tel}">${company.phoneDisplay}</a></p></div>
    ${f.html}
  </div>
</section>

${leadForm({ topic: 'Главная' })}
`;
  return {
    path: '/',
    title: 'Аквариумы и террариумы на заказ в Симферополе и Крыму — студия V-Vintage',
    desc: 'Изготовление аквариумов, террариумов и палюдариумов на заказ в Симферополе и по Крыму. Чистка и обслуживание аквариумов, 3D-фоны AQUADEKOR, зимние сады. Бесплатная консультация и смета.',
    body, ld: [orgLd(), f.ld, { '@context': 'https://schema.org', '@type': 'WebSite', name: company.fullName, url: company.domain + '/' }],
    bodyClass: 'is-home', og: mor[34].id, scripts: ['home.js'],
  };
}
