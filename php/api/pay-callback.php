<?php
// Уведомления платёжной системы об оплате.
//  ЮKassa:    HTTP-уведомления → https://v-vintage.ru/api/pay-callback.php?driver=yookassa
//  Робокасса: Result URL       → https://v-vintage.ru/api/pay-callback.php?driver=robokassa (метод POST)
define('VV_API', 1);
require __DIR__ . '/lib.php';
$cfg = vv_config();
$driver = isset($_GET['driver']) ? basename((string)$_GET['driver']) : '';
if ($driver !== $cfg['payment']['driver'] || !vv_payment_driver()) { http_response_code(404); exit; }
$fn = 'vv_pay_callback_' . $driver;
$res = $fn($cfg); // array('order' => id|null, 'paid' => bool, 'reply' => string)
if (!empty($res['order']) && !empty($res['paid'])) {
    $o = vv_order_load($res['order']);
    if ($o && $o['status'] !== 'paid') {
        $o['status'] = 'paid'; $o['paid_at'] = date('c');
        vv_order_save($o);
        vv_log('payments.log', 'paid ' . $o['id']);
        vv_notify('Оплачен заказ ' . $o['id'], vv_order_text($o));
    }
}
echo isset($res['reply']) ? $res['reply'] : 'OK';
