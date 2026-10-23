/* Магазин: фильтр каталога и карточка товара */
(function () {
  'use strict';
  var VV = window.VV, $ = VV.$, $$ = VV.$$;

  // Фильтр по категориям (#fony и т.п. в адресе)
  var chips = $('[data-filter]'), grid = $('[data-filter-grid]');
  if (chips && grid) {
    var apply = function (f) {
      $$('.chip', chips).forEach(function (c) { c.classList.toggle('is-on', c.dataset.f === f); });
      $$('.pcard', grid).forEach(function (p) {
        var show = f === '*' || p.dataset.cat === f;
        p.classList.toggle('is-hidden', !show);
        if (show) { p.classList.remove('is-in'); requestAnimationFrame(function () { p.classList.add('is-in'); }); }
      });
    };
    chips.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      apply(c.dataset.f); history.replaceState(null, '', c.dataset.f === '*' ? location.pathname : '#' + c.dataset.f);
    });
    var h = location.hash.slice(1); if (h && $('[data-f="' + h + '"]', chips)) apply(h);
  }

  // Карточка товара
  var form = $('[data-product]');
  if (!form) return;
  var prod = JSON.parse(form.getAttribute('data-product'));
  var main = $('.product__main img'), mainA = $('.product__main');
  function showImg(src) {
    if (!main || !src) return;
    main.style.opacity = .3;
    var im = new Image(); im.onload = function () { main.removeAttribute('srcset'); main.src = src; main.style.opacity = 1; }; im.src = src;
    mainA.href = src;
    $$('.product__thumb').forEach(function (x) { x.classList.toggle('is-on', x.dataset.src === src); });
  }
  $$('.product__thumb').forEach(function (b) {
    b.addEventListener('click', function () { $$('.product__thumb').forEach(function (x) { x.classList.remove('is-on'); }); b.classList.add('is-on'); showImg(b.dataset.src); });
  });
  form.addEventListener('change', function (e) {
    if (e.target.dataset.img) { showImg(e.target.dataset.img); var o = e.target.closest('.models') && $('[data-model-out]'); if (o) o.textContent = e.target.value; }
  });
  // фото должно совпадать с вариантом, выбранным по умолчанию
  var picked = $('input[data-img]:checked', form);
  if (picked && main && main.getAttribute('src') !== picked.dataset.img) showImg(picked.dataset.img);
  var qty = form.qty;
  $$('[data-qty]', form).forEach(function (b) { b.addEventListener('click', function () { qty.value = Math.max(1, Math.min(99, (+qty.value || 1) + (+b.dataset.qty))); }); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var opts = [];
    $$('input[type=radio][data-opt]:checked', form).forEach(function (r) { opts.push({ label: r.dataset.label, value: r.value }); });
    $$('[data-dims]', form).forEach(function (fs) {
      var v = $$('input', fs).map(function (i) { return i.value.trim(); });
      if (v.some(Boolean)) opts.push({ label: fs.dataset.label, value: v.map(function (x) { return x || '?'; }).join(' × ') });
    });
    var model = $('input[data-img]:checked', form);
    VV.cart.add({ slug: prod.slug, title: prod.title, price: prod.price, unit: prod.unit, img: model ? model.dataset.img.replace('-1000.webp', '-480.webp') : prod.img, opts: opts, qty: Math.max(1, +qty.value || 1) });
    VV.toast(prod.price == null ? 'Добавлено в заказ — цену подтвердит менеджер' : 'Добавлено в корзину');
    setTimeout(VV.cartOpen, 350);
  });
})();
