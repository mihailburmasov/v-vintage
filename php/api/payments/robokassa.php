<?php
// Робокасса. Документация: https://docs.robokassa.ru/
if (!defined('VV_API')) { http_response_code(403); exit; }

function vv_robo_inv($orderId) { return (int)(sprintf('%u', crc32($orderId)) % 2000000000) + 1; }

function vv_pay_create_robokassa($order, $cfg) {
    $r = $cfg['payment']['robokassa'];
    $test = !empty($cfg['payment']['test']);
    $p1 = $test ? $r['test_password1'] : $r['password1'];
    if (!$r['login'] || !$p1) throw new Exception('Робокасса: не заданы логин/пароль');
    $sum = number_format($order['sum'], 2, '.', '');
    $inv = vv_robo_inv($order['id']);
    $items = array();
    foreach ($order['items'] as $it) {
        $items[] = array('name' => function_exists('mb_substr') ? mb_substr($it['title'], 0, 128, 'UTF-8') : substr($it['title'], 0, 128), 'quantity' => $it['qty'], 'sum' => round($it['price'] * $it['qty'], 2), 'payment_method' => 'full_payment', 'payment_object' => vv_is_service($it['slug']) ? 'service' : 'commodity', 'tax' => $r['tax']);
    }
    $receipt = urlencode(json_encode(array('items' => $items), JSON_UNESCAPED_UNICODE));
    $shp = 'Shp_order=' . $order['id'];
    $sig = md5($r['login'] . ':' . $sum . ':' . $inv . ':' . $receipt . ':' . $p1 . ':' . $shp);
    $q = array('MerchantLogin' => $r['login'], 'OutSum' => $sum, 'InvId' => $inv, 'Description' => 'Заказ ' . $order['id'], 'Receipt' => $receipt, 'SignatureValue' => $sig, 'Shp_order' => $order['id'], 'Culture' => 'ru', 'Encoding' => 'utf-8');
    if ($order['email']) $q['Email'] = $order['email'];
    if ($test) $q['IsTest'] = 1;
    return 'https://auth.robokassa.ru/Merchant/Index.aspx?' . http_build_query($q);
}

function vv_pay_callback_robokassa($cfg) {
    $r = $cfg['payment']['robokassa'];
    $p2 = !empty($cfg['payment']['test']) ? $r['test_password2'] : $r['password2'];
    $sum = isset($_POST['OutSum']) ? $_POST['OutSum'] : '';
    $inv = isset($_POST['InvId']) ? $_POST['InvId'] : '';
    $order = isset($_POST['Shp_order']) ? preg_replace('/[^A-Z0-9-]/', '', $_POST['Shp_order']) : '';
    $sig = isset($_POST['SignatureValue']) ? strtolower($_POST['SignatureValue']) : '';
    $ok = $order && $sig === strtolower(md5($sum . ':' . $inv . ':' . $p2 . ':Shp_order=' . $order));
    if ($ok) {
        $o = vv_order_load($order);
        if (!$o || abs((float)$sum - (float)$o['sum']) > 0.01 || (int)$inv !== vv_robo_inv($order)) { vv_log('payments.log', 'robokassa mismatch ' . $order); $ok = false; }
    }
    if (!$ok) { http_response_code(400); return array('order' => null, 'paid' => false, 'reply' => 'bad sign'); }
    return array('order' => $order, 'paid' => true, 'reply' => 'OK' . $inv);
}
