<?php
// Общие функции API. Совместимо с PHP 7.0+, без зависимостей.
// Настройки — в config.local.php (не в git), образец — config.sample.php.

if (!defined('VV_API')) { http_response_code(403); exit; }

function vv_config() {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $cfg = require __DIR__ . '/config.sample.php';
    if (is_file(__DIR__ . '/config.local.php')) {
        $local = require __DIR__ . '/config.local.php';
        $cfg = array_replace_recursive($cfg, $local);
    }
    return $cfg;
}

function vv_json($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function vv_input() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') vv_json(array('ok' => false, 'error' => 'Метод не поддерживается'), 405);
    $raw = file_get_contents('php://input');
    if (strlen($raw) > 100000) vv_json(array('ok' => false, 'error' => 'Слишком большой запрос'), 413);
    $data = json_decode($raw, true);
    if (!is_array($data)) $data = $_POST;
    // Ловушка для ботов: скрытое поле website должно быть пустым
    if (!empty($data['website'])) vv_json(array('ok' => true, 'id' => 'OK'));
    return $data;
}

function vv_str($v, $max = 500) {
    $v = is_scalar($v) ? trim((string)$v) : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $v);
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}

function vv_phone_ok($p) { return strlen(preg_replace('/\D/', '', $p)) >= 10; }

// Где хранить заказы и логи (персональные данные!):
// 1) config 'data_dir'; 2) папка v-vintage-data рядом с корнем сайта (вне доступа из веба);
// 3) иначе api/data. В любом случае файлы — .php со строкой-заглушкой VV_GUARD (exit) в начале,
// поэтому даже без .htaccess прямой запрос к ним ничего не покажет.
define('VV_GUARD', "<?php exit; ?>\n");
function vv_data_base() {
    static $base = null;
    if ($base !== null) return $base;
    $cfg = vv_config();
    $cands = array();
    if (!empty($cfg['data_dir'])) $cands[] = $cfg['data_dir'];
    $root = !empty($_SERVER['DOCUMENT_ROOT']) ? realpath($_SERVER['DOCUMENT_ROOT']) : realpath(__DIR__ . '/..');
    if ($root) $cands[] = dirname($root) . '/v-vintage-data';
    $cands[] = __DIR__ . '/data';
    foreach ($cands as $c) {
        if ((is_dir($c) || @mkdir($c, 0750, true)) && is_writable($c)) { $base = $c; break; }
    }
    if ($base === null) $base = __DIR__ . '/data';
    if (strpos(realpath($base) ?: $base, realpath(__DIR__)) === 0 && !is_file($base . '/.htaccess')) @file_put_contents($base . '/.htaccess', "Require all denied\nDeny from all\n");
    return $base;
}
function vv_data_dir($sub) {
    $dir = vv_data_base() . '/' . $sub;
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    return $dir;
}
function vv_guard_read($f) { return is_file($f) ? (string)substr((string)@file_get_contents($f), strlen(VV_GUARD)) : ''; }
function vv_guard_write($f, $content) { return @file_put_contents($f, VV_GUARD . $content, LOCK_EX); }

function vv_log($file, $line) {
    $f = vv_data_dir('logs') . '/' . basename($file) . '.php';
    if (!is_file($f)) @file_put_contents($f, VV_GUARD, LOCK_EX);
    @file_put_contents($f, date('c') . ' ' . $line . "\n", FILE_APPEND | LOCK_EX);
}

// Простое ограничение частоты: не больше $max запросов с IP за $sec секунд
function vv_rate_limit($key, $max = 8, $sec = 600) {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'x';
    $f = vv_data_dir('rate') . '/' . md5($key . $ip) . '.php';
    $now = time();
    $hits = array_filter(explode(',', vv_guard_read($f)), function ($t) use ($now, $sec) { return $t && $now - (int)$t < $sec; });
    if (count($hits) >= $max) vv_json(array('ok' => false, 'error' => 'Слишком много запросов, попробуйте позже.'), 429);
    $hits[] = $now;
    vv_guard_write($f, implode(',', $hits));
}

function vv_mail($subject, $text) {
    $cfg = vv_config();
    $to = $cfg['notify']['email'];
    if (!$to) return false;
    $from = $cfg['notify']['from'];
    $headers = "From: =?UTF-8?B?" . base64_encode('Сайт V-Vintage') . "?= <" . $from . ">\r\n" .
        "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\nMIME-Version: 1.0\r\n";
    return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', chunk_split(base64_encode($text)), $headers, '-f' . $from);
}

function vv_telegram($text) {
    $cfg = vv_config();
    $t = $cfg['notify']['telegram_token']; $chat = $cfg['notify']['telegram_chat'];
    if (!$t || !$chat) return false;
    $res = vv_http('https://api.telegram.org/bot' . $t . '/sendMessage', 'POST', array('chat_id' => $chat, 'text' => $text, 'disable_web_page_preview' => true), array(), 'form');
    return $res['code'] === 200;
}

function vv_notify($subject, $text) {
    $a = vv_mail($subject, $text);
    $b = vv_telegram($subject . "\n\n" . $text);
    if (!$a && !$b) vv_log('notify-failed.log', $subject);
}

// HTTP-запрос (curl или потоки). $type: json|form
function vv_http($url, $method = 'GET', $body = null, $headers = array(), $type = 'json', $auth = null) {
    $payload = $body === null ? null : ($type === 'json' ? json_encode($body, JSON_UNESCAPED_UNICODE) : http_build_query($body));
    $h = $headers;
    if ($payload !== null) $h[] = 'Content-Type: ' . ($type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded');
    if ($auth) $h[] = 'Authorization: Basic ' . base64_encode($auth);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, array(CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => $h, CURLOPT_TIMEOUT => 25));
        if ($payload !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        $out = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    } else {
        $ctx = stream_context_create(array('http' => array('method' => $method, 'header' => implode("\r\n", $h), 'content' => $payload, 'timeout' => 25, 'ignore_errors' => true)));
        $out = @file_get_contents($url, false, $ctx); $code = 0;
        if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) $code = (int)$m[1];
    }
    return array('code' => $code, 'body' => $out, 'json' => json_decode((string)$out, true));
}

// ---------- Заказы ----------
function vv_catalog() {
    static $c = null;
    if ($c === null) $c = json_decode(file_get_contents(__DIR__ . '/products.json'), true);
    return $c;
}
function vv_product($slug) {
    foreach (vv_catalog()['products'] as $p) if ($p['slug'] === $slug) return $p;
    return null;
}
// Предмет расчёта для чека 54-ФЗ: услуга или товар
function vv_is_service($slug) { $p = vv_product($slug); return $p && $p['cat'] === 'uslugi'; }
function vv_order_path($id) { return vv_data_dir('orders') . '/' . preg_replace('/[^A-Z0-9-]/', '', $id) . '.json.php'; }
function vv_order_load($id) { $f = vv_order_path($id); return is_file($f) ? json_decode(vv_guard_read($f), true) : null; }
function vv_order_save($o) { vv_guard_write(vv_order_path($o['id']), json_encode($o, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)); }
function vv_order_id() { return 'VV-' . date('ymd') . '-' . strtoupper(substr(bin2hex(function_exists('random_bytes') ? random_bytes(4) : uniqid()), 0, 8)); }

function vv_order_text($o) {
    $lines = array();
    foreach ($o['items'] as $it) {
        $opts = array(); foreach ($it['opts'] as $op) $opts[] = $op['label'] . ': ' . $op['value'];
        $lines[] = '• ' . $it['title'] . ' × ' . $it['qty'] . ' — ' . ($it['price'] === null ? 'цена по запросу' : number_format($it['price'] * $it['qty'], 0, ',', ' ') . ' ₽') . ($opts ? "\n   " . implode('; ', $opts) : '');
    }
    return "Заказ " . $o['id'] . " (" . $o['status'] . ")\n\n" . implode("\n", $lines) .
        "\n\nИтого по ценам: " . number_format($o['sum'], 0, ',', ' ') . " ₽" . ($o['ask'] ? " + " . $o['ask'] . " поз. по запросу" : '') .
        "\n\nИмя: " . $o['name'] . "\nТелефон: " . $o['phone'] . "\nE-mail: " . $o['email'] .
        "\nПолучение: " . $o['delivery'] . ($o['address'] ? ', ' . $o['address'] : '') . "\nОплата: " . $o['payment'] .
        ($o['comment'] ? "\nКомментарий: " . $o['comment'] : '');
}

// ---------- Платёжные драйверы ----------
function vv_payment_driver() {
    $cfg = vv_config();
    $d = $cfg['payment']['driver'];
    if (!$d || $d === 'none') return null;
    $file = __DIR__ . '/payments/' . basename($d) . '.php';
    if (!is_file($file)) return null;
    require_once $file;
    return $d;
}
