/* Главная: горизонтальная витрина, этапы, параллакс героя, мини-калькулятор */
(function () {
  'use strict';
  var VV = window.VV, $ = VV.$, $$ = VV.$$;
  var mobile = window.matchMedia('(max-width: 640px)');

  // Горизонтальная витрина: вертикальная прокрутка двигает ленту
  var sc = $('[data-showcase]'), track = $('[data-showcase-track]');
  function setupShowcase() {
    if (!sc || !track) return;
    if (mobile.matches || VV.reduce) { sc.style.height = ''; track.style.transform = ''; return; }
    var extra = track.scrollWidth - innerWidth + 80;
    sc.style.height = (innerHeight + Math.max(0, extra)) + 'px';
  }
  function moveShowcase() {
    if (!sc || mobile.matches || VV.reduce) return;
    var r = sc.getBoundingClientRect(), total = sc.offsetHeight - innerHeight;
    var p = Math.min(1, Math.max(0, -r.top / total));
    var extra = track.scrollWidth - innerWidth + 80;
    track.style.transform = 'translate3d(' + (-p * extra) + 'px,0,0)';
  }

  // картинки витрины грузим заранее: лента уезжает вбок, и ленивая загрузка не успевает
  if (sc && 'IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { $$('img', sc).forEach(function (i) { i.loading = 'eager'; }); o.disconnect(); } }, { rootMargin: '1200px 0px' }).observe(sc);

  // Этапы: шкала прогресса и активный шаг
  var steps = $('[data-steps]'), fill = $('[data-steps-fill]'), items = $$('[data-step]');
  function moveSteps() {
    if (!steps) return;
    var r = steps.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height));
    if (fill) fill.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    items.forEach(function (it) { var ir = it.getBoundingClientRect(); it.classList.toggle('is-active', ir.top < innerHeight * .62); });
  }

  // Параллакс карточек героя за мышью
  var stack = $('[data-parallax]');
  if (stack && window.matchMedia('(pointer: fine)').matches && !VV.reduce) {
    var cards = $$('[data-depth-layer]', stack);
    $('[data-hero]').addEventListener('pointermove', function (e) {
      var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      cards.forEach(function (c) { var d = +c.dataset.depthLayer; c.style.transform = 'translate3d(' + (-x * 22 * d) + 'px,' + (-y * 22 * d) + 'px,0) rotate(' + (x * 2 * d) + 'deg)'; });
    });
  }

  var ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { moveShowcase(); moveSteps(); ticking = false; }); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { setupShowcase(); onScroll(); });
  addEventListener('load', function () { setupShowcase(); onScroll(); });
  setupShowcase(); onScroll();

  // Мини-калькулятор
  var mc = $('[data-mini-calc]');
  if (mc) {
    var tank = $('[data-tank]');
    var upd = function () {
      var L = +mc.l.value, W = +mc.w.value, H = +mc.h.value;
      [mc.l, mc.w, mc.h].forEach(function (r) { r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); $('[data-out="' + r.name + '"]').textContent = r.value; });
      var vol = L * W * H / 1000, g = VV.glass(L, W, H, 3.8);
      var glassKg = ((L * H * 2 + W * H * 2) * g.front / 10 + L * W * g.bottom / 10) / 1000 * 2.5;
      $('[data-res="vol"]').textContent = VV.fmt(vol) + ' л';
      $('[data-res="weight"]').textContent = '≈ ' + VV.fmt(vol * .9 + glassKg) + ' кг';
      $('[data-res="glass"]').textContent = g.front + '–' + g.bottom + ' мм';
      VV.tank(tank, L, W, H);
    };
    mc.addEventListener('input', upd); upd();
  }
})();
