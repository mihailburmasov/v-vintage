/* Оформление заказа и страница «Спасибо» */
(function () {
  'use strict';
  var VV = window.VV, $ = VV.$, $$ = VV.$$;

  // Страница «Спасибо»: показать номер заказа и статус оплаты
  var tt = $('[data-thanks-title]');
  if (tt) {
    var q = new URLSearchParams(location.search), id = q.get('order');
    if (id) tt.textContent = 'Заказ ' + id + ' принят';
    // статус берём с сервера: после возврата с платёжной страницы уведомление может прийти с задержкой
    if (id && VV.mode === 'prod') {
      var tries = 0, check = function () {
        fetch(VV.api + 'order-status.php?id=' + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (r) {
          if (r.status === 'paid') $('[data-thanks-text]').textContent = 'Спасибо, оплата получена. Чек придёт на указанный e-mail или телефон. Менеджер свяжется с вами, чтобы согласовать доставку.';
          else if (r.status === 'awaiting_payment' && ++tries < 6) setTimeout(check, 3000);
          else if (r.status === 'awaiting_payment') $('[data-thanks-text]').textContent = 'Мы пока не получили подтверждение оплаты. Если деньги списались, не волнуйтесь: менеджер проверит платёж и свяжется с вами. Телефон: ' + VV.phone + '.';
        }).catch(function () { });
      };
      check();
    }
    if (q.get('demo')) $('[data-thanks-text]').textContent = 'Это демо-версия сайта: заказ никуда не отправлен. Оформить заказ можно по телефону ' + VV.phone + '.';
    return;
  }

  var box = $('[data-checkout]'); if (!box) return;
  var form = $('[data-form="order"]'), itemsEl = $('[data-co-items]'), totalEl = $('[data-co-total]'), online = $('[data-pay="online"]');

  function render() {
    var list = VV.cart.items();
    itemsEl.innerHTML = list.length ? '<h2 class="h3" style="margin-bottom:10px">Ваш заказ</h2>' + list.map(VV.cartItemHTML).join('')
      : '<div class="empty glass"><b>Корзина пуста</b><p>Выберите товары или услуги в <a href="' + VV.base + 'magazin/">магазине</a>.</p></div>';
    totalEl.innerHTML = VV.totalHTML();
    var t = VV.cart.total(), can = VV.paymentsEnabled && t.all;
    online.classList.toggle('is-off', !can);
    $('input', online).disabled = !can;
    $('[data-pay-online-note]').textContent = can ? 'Visa, Mastercard, МИР, СБП — на защищённой странице банка' : (VV.paymentsEnabled ? 'Доступно, когда у всех товаров в заказе есть цена' : 'Онлайн-оплата скоро будет подключена');
    if (!can && $('input', online).checked) form.payment.value = 'confirm';
    $('[data-co-submit] span').textContent = form.payment.value === 'online' && can ? 'Перейти к оплате' : 'Оформить заказ';
    form.querySelector('[data-co-submit]').disabled = !list.length;
  }
  document.addEventListener('vv:cart', render);
  form.addEventListener('change', function (e) {
    if (e.target.name === 'payment') render();
    if (e.target.name === 'delivery') $('[data-address]').hidden = e.target.value === 'pickup';
  });
  $('[data-address]').hidden = true;
  render();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var note = $('[data-form-note]', form), btn = $('[data-co-submit]');
    if (!VV.validate(form)) { note.className = 'form__note err'; note.textContent = 'Укажите имя, телефон и подтвердите согласие.'; return; }
    var list = VV.cart.items(); if (!list.length) return;
    var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
    // на сервер уходят только идентификаторы и опции; цены сервер берёт из своего каталога
    data.items = list.map(function (x) { return { slug: x.slug, qty: x.qty, opts: x.opts }; });
    btn.disabled = true; note.className = 'form__note'; note.textContent = 'Оформляем заказ…';
    VV.post('order.php', data).then(function (r) {
      if (!r.ok) { btn.disabled = false; note.className = 'form__note err'; note.textContent = (r.error || 'Не удалось оформить заказ.') + ' Позвоните: ' + VV.phone; return; }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: { currencyCode: 'RUB', purchase: { actionField: { id: r.id }, products: list.map(function (x) { var p = { id: x.slug, name: x.title, quantity: x.qty }; if (x.price != null) p.price = x.price; return p; }) } } });
      if (window.ym && VV.metrika) ym(VV.metrika, 'reachGoal', 'order');
      VV.cart.clear();
      if (r.payUrl) { location.href = r.payUrl; return; }
      location.href = VV.base + 'spasibo/?order=' + encodeURIComponent(r.id) + (r.demo ? '&demo=1' : '');
    }).catch(function () { btn.disabled = false; note.className = 'form__note err'; note.textContent = 'Нет связи с сервером. Позвоните: ' + VV.phone; });
  });
})();
