<?php
// Заявка с формы «Обсудим проект»
define('VV_API', 1);
require __DIR__ . '/lib.php';

$d = vv_input();
vv_rate_limit('lead', 6, 600);
$name = vv_str(isset($d['name']) ? $d['name'] : '', 100);
$phone = vv_str(isset($d['phone']) ? $d['phone'] : '', 40);
$msg = vv_str(isset($d['message']) ? $d['message'] : '', 2000);
$topic = vv_str(isset($d['topic']) ? $d['topic'] : '', 120);
$page = vv_str(isset($d['page']) ? $d['page'] : '', 200);

if ($name === '' || !vv_phone_ok($phone)) vv_json(array('ok' => false, 'error' => 'Укажите имя и телефон.'), 422);
if (empty($d['consent'])) vv_json(array('ok' => false, 'error' => 'Нужно согласие на обработку персональных данных.'), 422);

$text = "Имя: $name\nТелефон: $phone\nТема: $topic\nСтраница: $page\n\n$msg";
vv_log('leads.log', str_replace("\n", ' | ', $text));
vv_notify('Заявка с сайта: ' . ($topic ?: 'консультация'), $text);
vv_json(array('ok' => true));
