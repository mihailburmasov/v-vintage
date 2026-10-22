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
for (const [id, to] of Object.entries(R.page_id)) ok(fs.existsSync(`dist${to}index.html`), `?page_id=${id} → ${to}: нет dist${to}index.html`);

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

console.log('4. PHP-фолбэк (php -S)');
const php = spawn('php', ['-S', '127.0.0.1:8099', '-t', 'dist'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1200));
try {
  for (const [id, to] of Object.entries(R.page_id)) {
    const res = await fetch(`http://127.0.0.1:8099/?page_id=${id}`, { redirect: 'manual' });
    ok(res.status === 301 && res.headers.get('location') === H + to, `php ?page_id=${id}: ${res.status} ${res.headers.get('location')}`);
  }
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
  const sec = await fetch('http://127.0.0.1:8099/api/lib.php');
  ok((await sec.text()).length < 5, 'lib.php не отдаёт ничего при прямом вызове');
} finally { php.kill(); fs.rmSync('dist/api/data', { recursive: true, force: true }); }

console.log(fail ? `\nОШИБОК: ${fail}` : '\nВсё в порядке');
process.exit(fail ? 1 : 0);
