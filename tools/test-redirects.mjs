// Проверка сохранения SEO-веса: npm run build:prod && npm test
// 1) каждая цель редиректа существует в dist/
// 2) правила .htaccess (эмуляция RewriteCond QUERY_STRING + RewriteRule) дают нужную цель
// 3) правила для старых картинок ведут на существующие файлы
// 4) PHP-фолбэк index.php реально отвечает 301 (через встроенный сервер php -S)
import fs from 'fs';
import { spawn } from 'child_process';

const R = JSON.parse(fs.readFileSync('src/data/redirects.json', 'utf8'));
const H = 'https://v-vintage.ru';
let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.log('  ✗ ' + m); } };

console.log('1. Цели редиректов существуют');
const pageFile = to => to === '/' ? 'dist/_home.html' : `dist${to}index.html`; // главную отдаёт index.php
for (const [id, to] of Object.entries(R.page_id)) ok(fs.existsSync(pageFile(to)), `?page_id=${id} → ${to}: нет ${pageFile(to)}`);

console.log('2. Эмуляция .htaccess');
const ht = fs.readFileSync('dist/.htaccess', 'utf8').split('\n');
function rewrite(path, qs) {
  // запрос эмулируем как пришедший на https://v-vintage.ru (не www): условия по хосту/HTTPS ложны
  let conds = [];
  for (const line of ht) {
    const c = line.match(/^RewriteCond %\{QUERY_STRING\} (\S+)/);
    if (c) { conds.push(new RegExp(c[1], 'i')); continue; }
    if (/^RewriteCond %\{(HTTP_HOST|HTTPS)\}/.test(line)) { conds.push(/(?!)/); continue; }
    const r = line.match(/^RewriteRule \^(.*?)\$ (\S+) \[(.*)\]/);
    if (r) {
      const pathOk = new RegExp('^' + r[1] + '$', /NC/.test(r[3]) ? 'i' : '').test(path);
      const condOk = conds.every(re => re.test(qs));
      conds = [];
      if (pathOk && condOk) return r[2].replace(/\?$/, '');
    } else if (!/^RewriteCond/.test(line)) conds = [];
  }
  return null;
}
for (const [id, to] of Object.entries(R.page_id)) {
  const got = rewrite('', `page_id=${id}`);
  ok(got === H + to, `?page_id=${id}: ожидалось ${H + to}, получено ${got}`);
  ok(rewrite('index.php', `page_id=${id}&foo=1`) === H + to, `/index.php?page_id=${id}&foo=1`);
}
ok(rewrite('', 'p=1') === H + '/', '?p=1');
ok(rewrite('', 'p=58') === H + R.page_id['58'], '?p=58 (WordPress уводил на page_id)');
for (const [id, to] of Object.entries(R.attachment_id)) { ok(rewrite('', 'attachment_id=' + id) === H + to, 'attachment_id=' + id); ok(fs.existsSync('dist' + to + 'index.html'), 'цель вложения ' + to); }
ok(rewrite('', 'attachment_id=999999') === H + R.attachmentDefault, 'неизвестное вложение → галерея');
ok(rewrite('', 'galleries=news') === H + '/', '?galleries=news');
ok(rewrite('', 'feed=rss2') === H + '/', '?feed=rss2');
ok(rewrite('', 'page_id=99999') === H + '/', 'неизвестный page_id → главная');
ok(rewrite('', '') === null, 'главная без параметров не редиректится');
ok(rewrite('', 'utm_source=x') === null, 'utm-метки не редиректятся');

console.log('3. Старые картинки');
const imgs = JSON.parse(fs.readFileSync('src/data/old-images.json', 'utf8'));
let n = 0;
for (const [old] of Object.entries(imgs)) {
  const rel = old.replace(/^\//, '');
  if (/[^\x20-\x7e]/.test(rel)) continue;
  for (const variant of [rel, rel.replace(/\.(\w+)$/, '-150x150.$1')]) {
    const got = rewrite(variant, '');
    ok(got && fs.existsSync('dist' + got.replace(H, '')), `${variant} → ${got}`);
    n++;
  }
}
console.log(`   проверено ${n} адресов картинок`);

console.log('4. Боевая сборка индексируется и не тянет превью');
ok(!fs.existsSync('dist/index.html') && fs.existsSync('dist/_home.html'), 'главная — только через index.php (_home.html), без dist/index.html');
ok(!/Disallow: \/\s*$/m.test(fs.readFileSync('dist/robots.txt', 'utf8')), 'robots.txt не закрывает сайт');
const sm = [...fs.readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
ok(sm.length > 40, 'в sitemap ' + sm.length + ' адресов');
for (const loc of sm) {
  const p = loc.replace(H, '');
  const f = p === '/' ? 'dist/_home.html' : 'dist' + p + 'index.html';
  if (!fs.existsSync(f)) { ok(false, 'нет файла для ' + loc); continue; }
  const html = fs.readFileSync(f, 'utf8');
  ok(!/name="robots"/.test(html), 'noindex на ' + p);
  ok(html.includes('<link rel="canonical" href="' + loc + '">'), 'canonical на ' + p);
  ok(!html.includes('/v-vintage/'), 'ссылки превью (/v-vintage/) на ' + p);
}
ok(fs.readFileSync('dist/_home.html', 'utf8').includes('ym(37945335,"init"'), 'Метрика 37945335 на главной');

console.log('5. PHP-фолбэк и API (php -S = сервер без .htaccess)');
// худший случай: данные внутри корня сайта
fs.writeFileSync('dist/api/config.local.php', "<?php return array('data_dir' => __DIR__ . '/data');");
const php = spawn('php', ['-S', '127.0.0.1:8099', '-t', 'dist'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1200));
try {
  for (const [id, to] of Object.entries(R.page_id)) {
    const res = await fetch(`http://127.0.0.1:8099/?page_id=${id}`, { redirect: 'manual' });
    ok(res.status === 301 && res.headers.get('location') === H + to, `php ?page_id=${id}: ${res.status} ${res.headers.get('location')}`);
  }
  for (const id of Object.keys(R.attachment_id).slice(0, 40)) { const res = await fetch('http://127.0.0.1:8099/?attachment_id=' + id, { redirect: 'manual' }); ok(res.headers.get('location') === H + R.attachment_id[id], 'php attachment_id=' + id); }
  const p58 = await fetch('http://127.0.0.1:8099/?p=58', { redirect: 'manual' }); ok(p58.headers.get('location') === H + R.page_id['58'], 'php ?p=58');
  const home = await fetch('http://127.0.0.1:8099/');
  ok(home.status === 200 && (await home.text()).includes('Аквариумы и&nbsp;террариумы'), 'главная отдаётся через index.php');
  const lead = await fetch('http://127.0.0.1:8099/api/lead.php', { method: 'POST', body: JSON.stringify({ name: 'Тест', phone: '+7 978 000-00-00', consent: '1', topic: 'test' }) });
  ok((await lead.json()).ok === true, 'api/lead.php принимает заявку');
  const bad = await fetch('http://127.0.0.1:8099/api/lead.php', { method: 'POST', body: JSON.stringify({ name: 'Тест', phone: '123', consent: '1' }) });
  ok(bad.status === 422, 'api/lead.php отклоняет неверный телефон');
  const noc = await fetch('http://127.0.0.1:8099/api/lead.php', { method: 'POST', body: JSON.stringify({ name: 'Тест', phone: '+79780000000' }) });
  ok(noc.status === 422, 'api/lead.php требует согласие');
  const ord = await fetch('http://127.0.0.1:8099/api/order.php', { method: 'POST', body: JSON.stringify({ name: 'Тест', phone: '+79780000000', consent: '1', delivery: 'pickup', payment: 'online', items: [{ slug: 'chistka-akvariuma', qty: 2, opts: [{ label: 'Объём', value: 'до 100 л' }] }, { slug: 'nesushchestvuet', qty: 1 }] }) });
  const oj = await ord.json();
  ok(oj.ok && /^VV-/.test(oj.id) && !oj.payUrl, 'api/order.php создаёт заказ без оплаты при цене «по запросу»: ' + JSON.stringify(oj));
  const st = await (await fetch('http://127.0.0.1:8099/api/order-status.php?id=' + oj.id)).json();
  ok(st.status === 'new', 'order-status.php: ' + JSON.stringify(st));
  for (const leak of ['/api/data/logs/leads.log.php', '/api/data/logs/orders.log.php', '/api/data/orders/' + oj.id + '.json.php', '/api/products.json']) {
    const r = await fetch('http://127.0.0.1:8099' + leak); const body = await r.text();
    if (leak.endsWith('products.json')) continue;
    ok(!body.includes('Тест') && !body.includes('78000'), 'утечка персональных данных: ' + leak + ' → ' + r.status + ' ' + body.slice(0, 60));
  }
  ok(fs.existsSync('dist/api/data/orders/' + oj.id + '.json.php'), 'заказ сохранён');
  const sec = await fetch('http://127.0.0.1:8099/api/lib.php');
  ok((await sec.text()).length < 5, 'lib.php не отдаёт ничего при прямом вызове');
} finally { php.kill(); fs.rmSync('dist/api/data', { recursive: true, force: true }); fs.rmSync('dist/api/config.local.php', { force: true }); fs.rmSync('v-vintage-data', { recursive: true, force: true }); }

console.log(fail ? `\nОШИБОК: ${fail}` : '\nВсё в порядке');
process.exit(fail ? 1 : 0);
