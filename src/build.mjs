// Сборка сайта.  MODE=preview → docs/ (GitHub Pages, noindex)   MODE=prod → dist/ (v-vintage.ru)
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { MODE, BASE, layout, company, catalog, gal, url } from './lib/ui.mjs';
import home from './pages/home.mjs';
import { SERVICES, DECOR, servicePage, servicesHub, decorHub } from './pages/services.mjs';
import { shopIndex, productPage, cartPage, thanksPage } from './pages/shop.mjs';
import * as M from './pages/misc.mjs';

const OUT = MODE === 'prod' ? 'dist' : 'docs';
const redirects = JSON.parse(fs.readFileSync('src/data/redirects.json', 'utf8'));
const oldImages = JSON.parse(fs.readFileSync('src/data/old-images.json', 'utf8'));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  home(), M.about(), servicesHub(), ...SERVICES.map(s => servicePage(s, 'uslugi')),
  decorHub(), ...DECOR.map(s => servicePage(s, 'dekor')),
  M.service(), M.interior(), M.galleryHub(), M.galleryAquariums(), ...M.GALLERY_PAGES.map(M.galleryPage), M.atlas(),
  shopIndex(), ...catalog.products.map(productPage), cartPage(), thanksPage(),
  M.calculator(), M.contacts(), M.privacy(), M.offer(), M.delivery(), M.notFound(),
];

for (const p of pages) {
  // В боевой сборке главную отдаёт только index.php (там же 301 со старых ?page_id=N):
  // если сервер не читает .htaccess и предпочитает index.html, редиректы всё равно сработают
  const file = p.file ? path.join(OUT, p.file) : MODE === 'prod' && p.path === '/' ? path.join(OUT, '_home.html') : path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout(p));
}

// ---------- ассеты ----------
fs.cpSync('src/assets', path.join(OUT, 'assets'), { recursive: true });
fs.copyFileSync('src/static/favicon.svg', path.join(OUT, 'favicon.svg'));
await sharp('src/static/favicon.svg').resize(192, 192).png().toFile(path.join(OUT, 'favicon.png'));
await sharp('src/static/favicon.svg').resize(180, 180).flatten({ background: '#03141a' }).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
await sharp('src/static/favicon.svg').resize(48, 48).png().toFile(path.join(OUT, 'favicon.ico.png'));
fs.renameSync(path.join(OUT, 'favicon.ico.png'), path.join(OUT, 'favicon.ico')); // PNG внутри .ico понимают все современные браузеры
// OG-картинка 1200×630: фото + затемнение + надпись
{
  const bg = gal('morskie-akvariumy')[34];
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#03141a" stop-opacity=".95"/><stop offset=".65" stop-color="#03141a" stop-opacity=".55"/><stop offset="1" stop-color="#03141a" stop-opacity=".1"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><text x="70" y="250" font-family="Georgia, serif" font-size="64" fill="#e7f1ef">Аквариумы и террариумы</text><text x="70" y="330" font-family="Georgia, serif" font-style="italic" font-size="64" fill="#d4b27a">на заказ в Крыму</text><text x="70" y="420" font-family="Arial, sans-serif" font-size="30" fill="#9fd9cc">Студия аквадизайна V-Vintage · ${company.phoneDisplay}</text></svg>`;
  await sharp(`src/assets/img/${bg.id}-1000.webp`).resize(1200, 630, { fit: 'cover' }).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 82 }).toFile(path.join(OUT, 'assets/og.jpg'));
}

// ---------- SEO-файлы ----------
const indexable = pages.filter(p => !p.noindex && !p.file);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(p => `  <url><loc>${company.domain}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === '/' ? '1.0' : p.path.split('/').length > 3 ? '0.6' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), MODE === 'prod'
  ? `User-agent: *\nDisallow: /korzina/\nDisallow: /spasibo/\nDisallow: /api/\nClean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid&gclid&fbclid\n\nSitemap: ${company.domain}/sitemap.xml\nHost: ${company.domain}\n`
  : `# Превью на GitHub Pages — закрыто от индексации, чтобы не дублировать v-vintage.ru\nUser-agent: *\nDisallow: /\n`);

// ---------- Редиректы со старого WordPress ----------
// цели абсолютные (https, без www) — чтобы http/www-запросы старых адресов шли одним прыжком
const H = company.domain;
const rules = [];
for (const [id, to] of Object.entries(redirects.page_id)) rules.push(`RewriteCond %{QUERY_STRING} (^|&)(page_id|p)=${id}(&|$) [NC]\nRewriteRule ^(index\\.php)?$ ${H}${to}? [R=301,L]`);
for (const [id, to] of Object.entries(redirects.p)) rules.push(`RewriteCond %{QUERY_STRING} (^|&)p=${id}(&|$) [NC]\nRewriteRule ^(index\\.php)?$ ${H}${to}? [R=301,L]`);
// страницы отдельных фото (?attachment_id=N и ?p=N, который WordPress сам уводил на attachment_id)
for (const [id, to] of Object.entries(redirects.attachment_id || {})) rules.push(`RewriteCond %{QUERY_STRING} (^|&)(attachment_id|p)=${id}(&|$) [NC]\nRewriteRule ^(index\\.php)?$ ${H}${to}? [R=301,L]`);
rules.push(`RewriteCond %{QUERY_STRING} (^|&)attachment_id= [NC]\nRewriteRule ^(index\\.php)?$ ${H}${redirects.attachmentDefault}? [R=301,L]`);
rules.push(`RewriteCond %{QUERY_STRING} (^|&)(page_id|${redirects.otherQuery.join('|')})= [NC]\nRewriteRule ^(index\\.php)?$ ${H}/? [R=301,L]`);
for (const [from, to] of Object.entries(redirects.paths)) rules.push(`RewriteRule ^${from.replace(/^\//, '').replace(/\./g, '\\.').replace(/\/$/, '(/.*)?')}$ ${H}${to} [R=301,L]`);
// старые картинки /wp-content/uploads/... (в т.ч. миниатюры -150x150) → новые webp; только латинские имена
const imgRules = [];
for (const [old, id] of Object.entries(oldImages)) {
  const rel = old.replace(/^\//, '');
  if (/[^\x20-\x7e]/.test(rel)) continue;
  const base = rel.replace(/\.(\w+)$/, '').replace(/[.+()[\]$^]/g, m => '\\' + m);
  const ext = rel.match(/\.(\w+)$/)[1];
  imgRules.push(`RewriteRule ^${base}(-\\d+x\\d+)?\\.${ext}$ ${H}/assets/img/${id}-1000.webp [R=301,L,NC]`);
}
const htaccess = `# Сгенерировано src/build.mjs — не править вручную
AddDefaultCharset UTF-8
DirectoryIndex index.php index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# ---- 301 со старых адресов WordPress (?page_id=N) ----
${rules.join('\n')}

# ---- 301 со старых картинок ----
${imgRules.join('\n')}

# Главное зеркало: https без www
RewriteCond %{HTTP_HOST} ^www\\. [NC]
RewriteRule ^(.*)$ https://v-vintage.ru/$1 [R=301,L]
RewriteCond %{HTTPS} off
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://v-vintage.ru/$1 [R=301,L]

# Служебные файлы: данные API и прямой адрес шаблона главной
RewriteRule ^api/(data|lib|payments)/ - [F,L]
RewriteRule ^api/(lib|config\\.[a-z.]+)\\.php$ - [F,L]
RewriteRule ^_home\\.html$ https://v-vintage.ru/ [R=301,L]
</IfModule>

<IfModule mod_headers.c>
<FilesMatch "\\.(webp|jpg|png|svg|woff2|ico)$">
Header set Cache-Control "public, max-age=31536000"
</FilesMatch>
<FilesMatch "\\.(css|js)$">
Header set Cache-Control "public, max-age=604800"
</FilesMatch>
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/xml
</IfModule>

AddType image/webp .webp
AddType font/woff2 .woff2
`;
// index.php — фолбэк, если mod_rewrite выключен: те же 301 для главной, иначе отдаёт index.html
const phpMap = JSON.stringify(redirects.page_id);
const indexPhp = `<?php
// Сгенерировано src/build.mjs. Если на хостинге не работает mod_rewrite, старые адреса
// v-vintage.ru/?page_id=N всё равно получат 301 на новые страницы.
$map = json_decode('${phpMap}', true);
$p = json_decode('${JSON.stringify(redirects.p)}', true);
$att = json_decode('${JSON.stringify(redirects.attachment_id || {})}', true);
$to = null;
if (isset($_GET['page_id']) && isset($map[(string)(int)$_GET['page_id']])) $to = $map[(string)(int)$_GET['page_id']];
elseif (isset($_GET['page_id'])) $to = '/';
elseif (isset($_GET['attachment_id'])) $to = isset($att[(string)(int)$_GET['attachment_id']]) ? $att[(string)(int)$_GET['attachment_id']] : '${redirects.attachmentDefault}';
elseif (isset($_GET['p'])) { $k = (string)(int)$_GET['p']; $to = isset($p[$k]) ? $p[$k] : (isset($map[$k]) ? $map[$k] : (isset($att[$k]) ? $att[$k] : '/')); }
else { foreach (${JSON.stringify(redirects.otherQuery).replace(/"/g, "'").replace('[', 'array(').replace(']', ')')} as $k) { if (isset($_GET[$k])) { $to = '/'; break; } } }
if ($to !== null) { header('Location: https://v-vintage.ru' . $to, true, 301); exit; }
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/_home.html');
`;

if (MODE === 'prod') {
  fs.writeFileSync(path.join(OUT, '.htaccess'), htaccess);
  fs.writeFileSync(path.join(OUT, 'index.php'), indexPhp);
  fs.cpSync('php/api', path.join(OUT, 'api'), { recursive: true, filter: s => !/config\.local\.php$|[\\/]data[\\/].+/.test(s) });
  fs.writeFileSync(path.join(OUT, 'api/products.json'), JSON.stringify(catalog));
  fs.writeFileSync(path.join(OUT, 'api/company.json'), JSON.stringify(company));
} else {
  // GitHub Pages: без PHP. Старые ?page_id=N обрабатывает JS на главной (только для демонстрации).
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
  fs.writeFileSync(path.join(OUT, 'assets/js/redirects.json'), JSON.stringify(redirects.page_id));
}
console.log(`${MODE}: ${pages.length} страниц → ${OUT}/ (BASE=${BASE})`);
