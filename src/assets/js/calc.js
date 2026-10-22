/* Калькулятор аквариума */
(function () {
  'use strict';
  var VV = window.VV, $ = VV.$;
  var form = $('[data-calc-form]'), out = $('[data-calc-res]'), tank = $('[data-tank]');
  if (!form) return;
  var TURN = { fresh: 4, marine: 6, reef: 10 }, HEAT = { fresh: 1, marine: 1.2, reef: 1.2 }, DENS = { fresh: 1, marine: 1.025, reef: 1.025 };
  function cell(t, v, sub, warn) { return '<div' + (warn ? ' class="is-warn"' : '') + '><dt>' + t + '</dt><dd>' + v + (sub ? '<small>' + sub + '</small>' : '') + '</dd></div>'; }
  function upd() {
    var L = Math.max(10, +form.l.value || 0), W = Math.max(10, +form.w.value || 0), H = Math.max(10, +form.h.value || 0);
    var type = form.type.value, sf = +form.sf.value;
    var gross = L * W * H / 1000, net = gross * .85;
    var g = VV.glass(L, W, H, sf);
    var glassKg = ((L * H * 2 * g.front) + (W * H * 2 * g.side) + (L * W * g.bottom)) / 10 / 1000 * 2.5;
    var water = net * DENS[type], decor = gross * .12, total = water + glassKg + decor;
        out.innerHTML =
      cell('Полный объём', VV.fmt(gross) + ' л', 'воды ≈ ' + VV.fmt(net) + ' л с учётом грунта и уровня') +
      cell('Вес в сборе', '≈ ' + VV.fmt(total) + ' кг', 'вода ' + VV.fmt(water) + ' · стекло ' + VV.fmt(glassKg) + ' · грунт и декор ≈ ' + VV.fmt(decor)) +
      cell('Стекло: стенки', g.front + ' мм', 'дно ' + g.bottom + ' мм, силикатное') +
      cell('Перекрытие', total > 500 ? 'Проверить' : 'Обычно без усиления', total > 500 ? 'Аквариум тяжелее 500 кг: перед установкой проверяем несущую способность пола и ставим распределяющую тумбу' : 'Ставьте у несущей стены, на ровную жёсткую тумбу', total > 500) +
      cell('Фильтр', '≈ ' + VV.fmt(gross * TURN[type]) + ' л/ч', 'оборот ×' + TURN[type] + ' в час' + (type === 'reef' ? ', плюс самп и течение' : '')) +
      cell('Нагреватель', '≈ ' + VV.fmt(Math.ceil(net * HEAT[type] / 25) * 25) + ' Вт', 'для комнаты +20…22 °C') +
      (g.braces || H > 80 ? cell('Внимание', 'Нужны рёбра жёсткости', 'Для таких размеров обязательно делаем инженерный расчёт', true) : '');
    VV.tank(tank, L, W, H);
    var send = $('[data-calc-send]');
    if (send) send.dataset.text = 'Калькулятор: ' + L + '×' + W + '×' + H + ' см, ' + { fresh: 'пресноводный', marine: 'морской', reef: 'рифовый' }[type] + ', ~' + VV.fmt(gross) + ' л, стекло ' + g.front + '/' + g.side + '/' + g.bottom + ' мм';
  }
  form.addEventListener('input', upd); form.addEventListener('change', upd); upd();
  var send = $('[data-calc-send]');
  if (send) send.addEventListener('click', function () { var m = $('#lead-msg'); if (m) { m.value = send.dataset.text; m.dispatchEvent(new Event('input')); } });
})();
