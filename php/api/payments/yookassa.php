<?php
// ЮKassa (API v3). Документация: https://yookassa.ru/developers/api
if (!defined('VV_API')) { http_response_code(403); exit; }

function vv_pay_create_yookassa($order, $cfg) {
    $y = $cfg['payment']['yookassa'];
    if (!$y['shop_id'] || !$y['secret_key']) throw new Exception('ЮKassa: не заданы shop_id/secret_key');
    $items = array();
    foreach ($order['items'] as $it) {
        $items[] = array(
            'description' => function_exists('mb_substr') ? mb_substr($it['title'], 0, 128, 'UTF-8') : substr($it['title'], 0, 128),
            'quantity' => number_format($it['qty'], 2, '.', ''),
            'amount' => array('value' => number_format($it['price'], 2, '.', ''), 'currency' => 'RUB'),
            'vat_code' => (int)$y['vat_code'],
            'payment_mode' => 'full_payment',
            'payment_subject' => vv_is_service($it['slug']) ? 'service' : $y['payment_subject'],
        );
    }
    $customer = $order['email'] ? array('email' => $order['email']) : array('phone' => preg_replace('/\D/', '', $order['phone']));
    $body = array(
        'amount' => array('value' => number_format($order['sum'], 2, '.', ''), 'currency' => 'RUB'),
        'capture' => true,
        'confirmation' => array('type' => 'redirect', 'return_url' => $cfg['site'] . '/spasibo/?order=' . urlencode($order['id'])),
        'description' => 'Заказ ' . $order['id'],
        'metadata' => array('order_id' => $order['id']),
        'receipt' => array('customer' => $customer, 'items' => $items),
    );
    $r = vv_http('https://api.yookassa.ru/v3/payments', 'POST', $body, array('Idempotence-Key: ' . $order['id']), 'json', $y['shop_id'] . ':' . $y['secret_key']);
    if ($r['code'] >= 300 || empty($r['json']['confirmation']['confirmation_url'])) throw new Exception('ЮKassa ответила ' . $r['code'] . ': ' . substr((string)$r['body'], 0, 300));
    return $r['json']['confirmation']['confirmation_url'];
}

function vv_pay_callback_yookassa($cfg) {
    $y = $cfg['payment']['yookassa'];
    $n = json_decode(file_get_contents('php://input'), true);
    $id = isset($n['object']['id']) ? preg_replace('/[^a-z0-9-]/i', '', $n['object']['id']) : '';
    if (!$id) return array('order' => null, 'paid' => false, 'reply' => 'OK');
    // Не доверяем телу уведомления: перепроверяем платёж через API
    $r = vv_http('https://api.yookassa.ru/v3/payments/' . $id, 'GET', null, array(), 'json', $y['shop_id'] . ':' . $y['secret_key']);
    $p = $r['json'];
    $ok = $r['code'] === 200 && isset($p['status']) && $p['status'] === 'succeeded' && !empty($p['paid']);
    $orderId = isset($p['metadata']['order_id']) ? $p['metadata']['order_id'] : null;
    if ($ok && $orderId) {
        $o = vv_order_load($orderId);
        if (!$o || abs((float)$p['amount']['value'] - (float)$o['sum']) > 0.01) { vv_log('payments.log', 'amount mismatch ' . $orderId); $ok = false; }
    }
    return array('order' => $orderId, 'paid' => $ok, 'reply' => 'OK');
}
