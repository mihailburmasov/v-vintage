<?php
// Статус заказа для страницы «Спасибо»: только статус, без персональных данных
define('VV_API', 1);
require __DIR__ . '/lib.php';
$id = isset($_GET['id']) ? preg_replace('/[^A-Z0-9-]/', '', strtoupper((string)$_GET['id'])) : '';
$o = $id ? vv_order_load($id) : null;
vv_json(array('ok' => (bool)$o, 'status' => $o ? $o['status'] : null));
