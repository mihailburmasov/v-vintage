<?php
// Оформление заказа. Цены берутся только из серверного каталога (products.json), не из браузера.
define('VV_API', 1);
require __DIR__ . '/lib.php';

$d = vv_input();
vv_rate_limit('order', 6, 600);
$cfg = vv_config();
$company = json_decode(file_get_contents(__DIR__ . '/company.json'), true);

$name = vv_str(isset($d['name']) ? $d['name'] : '', 120);
$phone = vv_str(isset($d['phone']) ? $d['phone'] : '', 40);
$email = vv_str(isset($d['email']) ? $d['email'] : '', 120);
if ($name === '' || !vv_phone_ok($phone)) vv_json(array('ok' => false, 'error' => 'Укажите имя и телефон.'), 422);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) vv_json(array('ok' => false, 'error' => 'Проверьте e-mail.'), 422);
if (empty($d['consent'])) vv_json(array('ok' => false, 'error' => 'Нужно согласие с офертой и обработкой данных.'), 422);

$deliveryTitles = array();
foreach ($company['shop']['delivery'] as $dl) $deliveryTitles[$dl['id']] = $dl['title'];
$delivery = isset($d['delivery']) && isset($deliveryTitles[$d['delivery']]) ? $deliveryTitles[$d['delivery']] : reset($deliveryTitles);

$items = array(); $sum = 0; $ask = 0;
$raw = isset($d['items']) && is_array($d['items']) ? array_slice($d['items'], 0, 50) : array();
foreach ($raw as $it) {
    $p = vv_product(isset($it['slug']) ? (string)$it['slug'] : '');
    if (!$p) continue;
    $qty = max(1, min(99, (int)(isset($it['qty']) ? $it['qty'] : 1)));
    $opts = array();
    if (isset($it['opts']) && is_array($it['opts'])) foreach (array_slice($it['opts'], 0, 10) as $o) {
        $opts[] = array('label' => vv_str(isset($o['label']) ? $o['label'] : '', 60), 'value' => vv_str(isset($o['value']) ? $o['value'] : '', 120));
    }
    $price = isset($p['price']) && $p['price'] !== null ? (float)$p['price'] : null;
    if ($price === null) $ask++; else $sum += $price * $qty;
    $items[] = array('slug' => $p['slug'], 'title' => $p['title'], 'price' => $price, 'qty' => $qty, 'opts' => $opts);
}
if (!$items) vv_json(array('ok' => false, 'error' => 'Корзина пуста.'), 422);

$wantOnline = isset($d['payment']) && $d['payment'] === 'online';
$canOnline = !empty($company['shop']['paymentsEnabled']) && $ask === 0 && $sum > 0 && vv_payment_driver();

$order = array(
    'id' => vv_order_id(), 'created' => date('c'), 'status' => 'new',
    'name' => $name, 'phone' => $phone, 'email' => $email,
    'delivery' => $delivery, 'address' => vv_str(isset($d['address']) ? $d['address'] : '', 300),
    'comment' => vv_str(isset($d['comment']) ? $d['comment'] : '', 2000),
    'payment' => $wantOnline && $canOnline ? 'онлайн картой' : 'после подтверждения менеджером',
    'items' => $items, 'sum' => $sum, 'ask' => $ask,
);
vv_order_save($order);
vv_log('orders.log', $order['id'] . ' ' . $sum . ' RUB, items=' . count($items) . ', ' . $order['payment']);

$payUrl = null;
if ($wantOnline && $canOnline) {
    $fn = 'vv_pay_create_' . $cfg['payment']['driver'];
    try { $payUrl = $fn($order, $cfg); } catch (Exception $e) { vv_log('payments.log', 'create error ' . $order['id'] . ': ' . $e->getMessage()); }
    if ($payUrl) { $order['status'] = 'awaiting_payment'; vv_order_save($order); }
}

vv_notify('Новый заказ ' . $order['id'], vv_order_text($order) . ($payUrl ? "\n\nКлиент перенаправлен на оплату." : ($wantOnline ? "\n\nОнлайн-оплата не создана — свяжитесь с клиентом." : '')));
vv_json(array('ok' => true, 'id' => $order['id'], 'payUrl' => $payUrl));
