/* V-Vintage: общий скрипт всех страниц (без зависимостей) */
(function () {
  'use strict';
  var VV = window.VV || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  VV.$ = $; VV.$$ = $$; VV.store = store; VV.reduce = reduce;
  VV.fmt = function (n) { return new Intl.NumberFormat('ru-RU').format(Math.round(n)); };
  VV.money = function (n) { return n == null ? 'по запросу' : VV.fmt(n) + ' ₽'; };

  // Превью на GitHub Pages: старые адреса ?page_id=N → новые страницы (на боевом это делает .htaccess 301)
  if (VV.mode !== 'prod' && /[?&]page_id=\d+/.test(location.search)) {
    fetch(VV.base + 'assets/js/redirects.json').then(function (r) { return r.json(); }).then(function (m) {
      var id = location.search.match(/page_id=(\d+)/)[1];
      location.replace(VV.base + (m[id] || '/').replace(/^\//, ''));
    });
  }

  // ---------- Тост ----------
  var toastEl = $('[data-toast]'), toastT;
  VV.toast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2800);
  };

  // ---------- Шапка ----------
  var hdr = $('[data-hdr]'), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (hdr) {
      hdr.classList.toggle('is-scrolled', y > 30);
      hdr.classList.toggle('is-hidden', y > 400 && y > lastY + 4 && !document.body.classList.contains('menu-open'));
      if (y < lastY - 4) hdr.classList.remove('is-hidden');
    }
    lastY = y;
    // глубиномер: 0 → 40 м
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, y / max) : 0;
    document.documentElement.style.setProperty('--depth', p.toFixed(3));
    var dv = $('[data-depth-val]'); if (dv) dv.textContent = Math.round(p * 40) + ' м';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Мобильное меню
  var burger = $('[data-burger]'), mnav = $('[data-mnav]');
  if (burger && mnav) burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); mnav.hidden = !open;
    document.body.classList.toggle('menu-open', open); document.body.style.overflow = open ? 'hidden' : '';
  });
  if (mnav) mnav.addEventListener('click', function (e) { if (e.target.closest('a') && burger.getAttribute('aria-expanded') === 'true') burger.click(); });

  // ---------- Разбивка заголовков на слова + появление ----------
  function splitWords(el) {
    var wi = 0;
    (function walk(node) {
      
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/( +)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (t) {
            if (!t) return;
            if (/^ +$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var i = document.createElement('span'); i.textContent = t; i.style.setProperty('--wi', wi++);
            w.appendChild(i); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
  }
  $$('.split').forEach(splitWords);
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 }) : null;
  $$('.reveal, .split').forEach(function (el) { io ? io.observe(el) : el.classList.add('is-in'); });
  VV.observe = function (el) { io ? io.observe(el) : el.classList.add('is-in'); };

  // ---------- Наклон карточек и подсветка ----------
  if (fine && !reduce) {
    $$('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-4px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
    document.addEventListener('pointermove', function (e) {
      var it = e.target.closest && e.target.closest('.masonry__item');
      if (!it) return;
      var r = it.getBoundingClientRect();
      it.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      it.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }

  // ---------- Каустика (WebGL): световые блики, как на дне ----------
  var FRAG = 'precision mediump float;uniform float t;uniform vec2 r;uniform vec2 m;uniform float q;' +
    'float c(vec2 p){vec2 i=p;float v=1.;float k=.005;for(int n=0;n<4;n++){float tt=t*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));v+=1./length(vec2(p.x/(sin(i.x+tt)/k),p.y/(cos(i.y+tt)/k)));}v/=4.;v=1.17-pow(v,1.4);return pow(abs(v),8.);}' +
    'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=mod(uv*vec2(r.x/r.y,1.)*6.28318*1.3,6.28318)-250.;float v=c(p);' +
    'float d=distance(uv,m);float glow=smoothstep(.45,0.,d)*.35*q;' +
    'vec3 deep=mix(vec3(.01,.08,.1),vec3(.03,.24,.27),uv.y);vec3 col=deep+vec3(.3,.85,.78)*v*(.18+uv.y*.42)+vec3(.4,1.,.9)*glow*.7;' +
    'gl_FragColor=vec4(col,1.);}';
  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  function caustics(cv) {
    var gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uT = gl.getUniformLocation(pr, 't'), uR = gl.getUniformLocation(pr, 'r'), uM = gl.getUniformLocation(pr, 'm'), uQ = gl.getUniformLocation(pr, 'q');
    var isHero = cv.getAttribute('data-caustics') === 'hero';
    var drawn = false, scale = isHero ? .5 : .35, mx = .6, my = .7, tx = .6, ty = .7, visible = true, raf, t0 = performance.now();
    function size() { var w = cv.clientWidth, h = cv.clientHeight; cv.width = Math.max(1, w * scale); cv.height = Math.max(1, h * scale); gl.viewport(0, 0, cv.width, cv.height); }
    size(); addEventListener('resize', size);
    if (isHero && fine) cv.parentNode.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height; });
    function frame(now) {
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      gl.uniform1f(uT, (now - t0) / 1000 * .35 + 23); gl.uniform2f(uR, cv.width, cv.height); gl.uniform2f(uM, mx, my); gl.uniform1f(uQ, isHero && fine ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!drawn) { drawn = true; cv.classList.add('is-live'); }
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(frame);
    }).observe(cv);
    raf = requestAnimationFrame(frame);
  }
  $$('[data-caustics]').forEach(caustics);

  // Пузырьки
  $$('[data-bubbles]').forEach(function (box) {
    if (reduce) return;
    var on = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting; }).observe(box);
    setInterval(function () {
      if (!on || document.hidden) return;
      var b = document.createElement('i'), s = 4 + Math.random() * 14, d = 7 + Math.random() * 9;
      b.className = 'bubble'; b.style.cssText = 'left:' + (Math.random() * 100) + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + d + 's;--dx:' + ((Math.random() - .5) * 120) + 'px';
      box.appendChild(b); setTimeout(function () { b.remove(); }, d * 1000);
    }, 420);
  });

  // ---------- Лайтбокс ----------
  var lb, lbImg, lbCap, lbList = [], lbI = 0;
  function lbShow(i) {
    lbI = (i + lbList.length) % lbList.length; var a = lbList[lbI];
    lbImg.style.opacity = 0;
    var im = new Image(); im.onload = function () { lbImg.src = a.href; lbImg.alt = a.getAttribute('data-caption') || ''; lbImg.style.opacity = 1; }; im.src = a.href;
    lbCap.textContent = (a.getAttribute('data-caption') || '') + (lbList.length > 1 ? '  ·  ' + (lbI + 1) + ' / ' + lbList.length : '');
  }
  function lbClose() { if (!lb) return; lb.classList.remove('is-on'); setTimeout(function () { lb.hidden = true; }, 300); document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-lightbox]');
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (!lb) {
      lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<img alt=""><p class="lb__cap"></p><button class="lb__btn lb__close" aria-label="Закрыть">✕</button><button class="lb__btn lb__prev" aria-label="Предыдущее">‹</button><button class="lb__btn lb__next" aria-label="Следующее">›</button>';
      document.body.appendChild(lb); lbImg = $('img', lb); lbCap = $('.lb__cap', lb);
      lb.addEventListener('click', function (ev) {
        if (ev.target.closest('.lb__prev')) lbShow(lbI - 1); else if (ev.target.closest('.lb__next')) lbShow(lbI + 1); else if (ev.target !== lbImg) lbClose();
      });
      var sx = 0; lb.addEventListener('touchstart', function (ev) { sx = ev.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (ev) { var dx = ev.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) lbShow(lbI + (dx < 0 ? 1 : -1)); });
    }
    var group = a.closest('[data-lightbox-group], .aside-pics, .atlas, .product__media') || document;
    lbList = $$('[data-lightbox]', group); lbI = Math.max(0, lbList.indexOf(a));
    lb.hidden = false; requestAnimationFrame(function () { lb.classList.add('is-on'); }); document.body.style.overflow = 'hidden';
    lbShow(lbI); $('.lb__close', lb).focus();
  });
  document.addEventListener('keydown', function (e) {
    if (lb && !lb.hidden) { if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbShow(lbI - 1); if (e.key === 'ArrowRight') lbShow(lbI + 1); }
    if (e.key === 'Escape') cartClose();
  });

  // ---------- Корзина ----------
  var CART_KEY = 'vv-cart';
  var Cart = VV.cart = {
    items: function () { return store.get(CART_KEY, []); },
    save: function (list) { store.set(CART_KEY, list); renderCart(); },
    add: function (it) {
      var list = Cart.items(), key = it.slug + '|' + JSON.stringify(it.opts || []);
      var ex = list.filter(function (x) { return x.key === key; })[0];
      if (ex) ex.qty = Math.min(99, ex.qty + it.qty); else { it.key = key; list.push(it); }
      Cart.save(list); ecom('add', it);
      var c = $('.hdr__cart'); if (c) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
    },
    setQty: function (key, q) {
      var list = Cart.items();
      list.forEach(function (x) { if (x.key === key) x.qty = Math.max(1, Math.min(99, q)); });
      Cart.save(list);
    },
    remove: function (key) { var list = Cart.items(); var it = list.filter(function (x) { return x.key === key; })[0]; Cart.save(list.filter(function (x) { return x.key !== key; })); if (it) ecom('remove', it); },
    clear: function () { Cart.save([]); },
    count: function () { return Cart.items().reduce(function (s, x) { return s + x.qty; }, 0); },
    total: function () {
      var list = Cart.items(), sum = 0, ask = 0;
      list.forEach(function (x) { if (x.price == null) ask++; else sum += x.price * x.qty; });
      return { sum: sum, ask: ask, all: list.length && !ask };
    }
  };
  function ecom(action, it) { // Яндекс.Метрика: электронная коммерция
    window.dataLayer = window.dataLayer || [];
    var p = { id: it.slug, name: it.title, quantity: it.qty }; if (it.price != null) p.price = it.price;
    var o = { ecommerce: { currencyCode: 'RUB' } }; o.ecommerce[action] = { products: [p] }; window.dataLayer.push(o);
  }
  VV.ecom = ecom;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  VV.esc = esc;
  VV.cartItemHTML = function (x) {
    return '<div class="citem" data-key="' + esc(x.key) + '">' + (x.img ? '<img src="' + esc(x.img) + '" alt="" loading="lazy">' : '<span></span>') +
      '<div><p class="citem__t">' + esc(x.title) + '</p>' + (x.opts || []).map(function (o) { return '<p class="citem__o">' + esc(o.label) + ': ' + esc(o.value) + '</p>'; }).join('') +
      '<p class="citem__p">' + (x.price == null ? 'цена по запросу' : VV.money(x.price * x.qty)) + '</p></div>' +
      '<div class="citem__ctrl"><div class="citem__q"><button type="button" data-q="-1" aria-label="Меньше">−</button><span>' + x.qty + '</span><button type="button" data-q="1" aria-label="Больше">+</button></div><button type="button" class="citem__rm" data-rm>Удалить</button></div></div>';
  };
  VV.totalHTML = function () {
    var t = Cart.total();
    if (!Cart.items().length) return '';
    return '<div class="sum"><span>Итого' + (t.ask ? '<br><small>' + t.ask + ' поз. по запросу — цену подтвердит менеджер</small>' : '') + '</span><b>' + (t.sum ? VV.money(t.sum) : '—') + '</b></div>';
  };
  var drawer = $('[data-drawer]');
  function renderCart() {
    var n = Cart.count();
    $$('[data-cart-count]').forEach(function (b) { b.textContent = n; b.hidden = !n; });
    if (!drawer) return;
    var list = Cart.items();
    $('[data-cart-list]', drawer).innerHTML = list.length ? list.map(VV.cartItemHTML).join('') : '<div class="empty"><b>Корзина пуста</b>Загляните в магазин: 3D-фоны, террариумы, услуги.</div>';
    $('[data-cart-foot]', drawer).innerHTML = list.length
      ? VV.totalHTML() + '<a class="btn btn--primary btn--wide" href="' + VV.base + 'korzina/"><span>Оформить заказ</span></a>'
      : '<a class="btn btn--ghost btn--wide" href="' + VV.base + 'magazin/"><span>Перейти в магазин</span></a>';
    document.dispatchEvent(new CustomEvent('vv:cart'));
  }
  VV.renderCart = renderCart;
  document.addEventListener('click', function (e) {
    var t = e.target;
    var row = t.closest && t.closest('.citem');
    if (row && t.closest('[data-q]')) { var it = Cart.items().filter(function (x) { return x.key === row.dataset.key; })[0]; if (it) Cart.setQty(it.key, it.qty + (+t.closest('[data-q]').dataset.q)); }
    if (row && t.closest('[data-rm]')) Cart.remove(row.dataset.key);
    if (t.closest && t.closest('[data-cart-open]')) cartOpen();
    if (t.closest && t.closest('[data-cart-close]')) cartClose();
  });
  function cartOpen() { if (!drawer) return; drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add('is-open'); }); document.body.style.overflow = 'hidden'; }
  function cartClose() { if (!drawer || drawer.hidden) return; drawer.classList.remove('is-open'); setTimeout(function () { drawer.hidden = true; }, 450); document.body.style.overflow = ''; }
  VV.cartOpen = cartOpen;
  addEventListener('storage', function (e) { if (e.key === CART_KEY) renderCart(); });
  renderCart();

  // ---------- Отправка форм ----------
  VV.post = function (endpoint, data) {
    if (VV.mode !== 'prod') return new Promise(function (res) { setTimeout(function () { res({ ok: true, demo: true, id: 'DEMO-' + Date.now().toString(36).toUpperCase() }); }, 700); });
    return fetch(VV.api + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Сервер вернул неожиданный ответ' }; }); });
  };
  VV.validate = function (form) {
    var ok = true;
    $$('[required]', form).forEach(function (el) {
      var bad = el.type === 'checkbox' ? !el.checked : !el.value.trim() || (el.type === 'tel' && el.value.replace(/\D/g, '').length < 10);
      var f = el.closest('.field'); if (f) f.classList.toggle('is-bad', bad);
      if (bad) ok = false;
    });
    return ok;
  };
  $$('[data-form="lead"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('[data-form-note]', form), btn = $('button[type=submit]', form);
      if (!VV.validate(form)) { note.className = 'form__note err'; note.textContent = 'Заполните имя, телефон и подтвердите согласие.'; return; }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; }); data.page = location.pathname;
      btn.disabled = true; note.className = 'form__note'; note.textContent = 'Отправляем…';
      VV.post('lead.php', data).then(function (r) {
        btn.disabled = false;
        if (r.ok) {
          note.className = 'form__note ok';
          note.textContent = r.demo ? 'Демо-версия сайта: заявка не отправлена. Позвоните нам: ' + VV.phone : 'Спасибо! Перезвоним в ближайшее рабочее время.';
          if (!r.demo) form.reset();
          if (window.ym && VV.metrika) ym(VV.metrika, 'reachGoal', 'lead');
        } else { note.className = 'form__note err'; note.textContent = (r.error || 'Не удалось отправить.') + ' Позвоните: ' + VV.phone; }
      }).catch(function () { btn.disabled = false; note.className = 'form__note err'; note.textContent = 'Нет связи с сервером. Позвоните: ' + VV.phone; });
    });
  });

  // Маска телефона (мягкая)
  document.addEventListener('input', function (e) {
    var el = e.target; if (el.type !== 'tel') return;
    var d = el.value.replace(/\D/g, ''); if (!d) return;
    if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
    var f = '+7'; if (d.length > 1) f += ' (' + d.slice(1, 4); if (d.length >= 4) f += ')'; if (d.length > 4) f += ' ' + d.slice(4, 7); if (d.length > 7) f += '-' + d.slice(7, 9); if (d.length > 9) f += '-' + d.slice(9, 11);
    el.value = f;
  });

  // ---------- Cookie ----------
  var ck = $('[data-cookie]');
  if (ck && !store.get('vv-cookie', false)) { ck.hidden = false; $('[data-cookie-ok]', ck).addEventListener('click', function () { store.set('vv-cookie', true); ck.hidden = true; }); }

  // ---------- Расчёт стекла (общий для калькуляторов) ----------
  VV.glass = function (Lcm, Wcm, Hcm, sf) {
    var H = Hcm * 10, table = [[.5, .085], [.667, .116], [1, .16], [1.5, .26], [2, .34], [2.5, .38], [3, .43]];
    function beta(ratio) {
      if (ratio <= table[0][0]) return table[0][1];
      for (var i = 1; i < table.length; i++) if (ratio <= table[i][0]) { var a = table[i - 1], b = table[i]; return a[1] + (b[1] - a[1]) * (ratio - a[0]) / (b[0] - a[0]); }
      return table[table.length - 1][1];
    }
    var sigma = 73 / (sf || 3.8), g = 0.00000981;
    function t(len) { return Math.sqrt(beta(len / Hcm) * g * Math.pow(H, 3) / sigma); }
    var std = [4, 5, 6, 8, 10, 12, 15, 19, 25];
    function round(x) { for (var i = 0; i < std.length; i++) if (std[i] >= x) return std[i]; return Math.ceil(x); }
    var front = round(t(Lcm)), side = front; // стенки делаем одной толщины
    var bottom = round(front + 1.5);
    return { front: front, side: side, bottom: bottom, braces: Lcm / Hcm > 3 || Lcm > 150 };
  };
  VV.tank = function (el, L, W, H) {
    if (!el) return;
    var maxL = 400;
    el.style.setProperty('--tl', (.45 + .55 * Math.min(1, L / maxL)).toFixed(3));
    el.style.setProperty('--th', Math.max(.2, Math.min(1.4, H / L)).toFixed(3));
    el.style.setProperty('--tw', Math.max(.1, Math.min(1, W / 150)).toFixed(3));
  };

  // ---------- Jivo: подгружаем лениво, чтобы не тормозить первый экран ----------
  if (VV.jivo) {
    var jl = false;
    var loadJivo = function () { if (jl) return; jl = true; var s = document.createElement('script'); s.async = true; s.src = 'https://code.jivosite.com/widget/' + VV.jivo; document.body.appendChild(s); };
    ['pointerdown', 'scroll', 'keydown'].forEach(function (ev) { addEventListener(ev, loadJivo, { once: true, passive: true }); });
    setTimeout(loadJivo, 9000);
  }
})();
