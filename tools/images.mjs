// Обработка фото со старого сайта: _source/raw → src/assets/img/*.webp (+ src/data/galleries.json)
// Запуск: npm run images   (исходники _source/ в git не входят — см. HANDOFF.md)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { galleries, fishNames } from './curation.mjs';

const RAW = '_source/raw/';
const OUT = 'src/assets/img/';
const inv = JSON.parse(fs.readFileSync('_source/old/inventory.json', 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

const translit = s => s.toLowerCase()
  .replace(/[а-яё]/g, c => ({ а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' })[c])
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

const done = new Map(); // rel -> {id, w, h}
async function processOne(rel) {
  if (done.has(rel)) return done.get(rel);
  const src = RAW + rel;
  const base = translit(path.basename(rel).replace(/\.\w+$/, '')) || 'img';
  const id = base + '-' + crypto.createHash('md5').update(rel).digest('hex').slice(0, 6);
  const meta = await sharp(src).metadata();
  const sizes = [480, 1000];
  for (const w of sizes) {
    const file = `${OUT}${id}-${w}.webp`;
    if (fs.existsSync(file)) continue;
    await sharp(src).rotate().resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
      .webp({ quality: w === 480 ? 72 : 78 }).toFile(file);
  }
  const res = { id, w: meta.width, h: meta.height };
  done.set(rel, res);
  return res;
}

const out = {};
const oldMap = {};
for (const g of galleries) {
  let items = inv[g.page].map((x, i) => ({ ...x, i }));
  if (g.range) items = items.filter(x => x.i >= g.range[0] && x.i <= g.range[1]);
  if (g.pick) items = g.pick.map(i => items[i]).filter(Boolean);
  if (g.exclude) items = items.filter(x => !g.exclude.includes(x.i));
  // дубли вида name-990x659.jpg рядом с name.jpg
  items = items.filter(x => !/-\d+x\d+\.\w+$/.test(x.rel) || !items.some(y => y.rel === x.rel.replace(/-\d+x\d+(\.\w+)$/, '$1')));
  const list = [];
  for (const x of items) {
    if (!fs.existsSync(RAW + x.rel)) continue;
    const r = await processOne(x.rel);
    const raw = decodeURIComponent(path.basename(x.rel)).replace(/\.\w+$/, '').replace(/-/g, ' ');
    const name = fishNames[raw] || raw;
    const alt = g.key === 'atlas' ? name : g.alt;
    list.push({ id: r.id, w: r.w, h: r.h, alt, ...(g.key === 'atlas' ? { name } : {}), ...(/^pozadine-za-akvarijum-([a-z]\d+)/i.test(path.basename(x.rel)) ? { code: path.basename(x.rel).match(/^pozadine-za-akvarijum-([a-z]\d+)/i)[1].toUpperCase() } : {}) });
    oldMap['/' + x.rel] = r.id;
  }
  out[g.key] = { title: g.title || '', items: list };
  console.log(g.key, list.length);
}
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/galleries.json', JSON.stringify(out, null, 1));
fs.writeFileSync('src/data/old-images.json', JSON.stringify(oldMap, null, 1));
const total = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(OUT + f).size, 0);
console.log('unique', done.size, 'MB', (total / 1e6).toFixed(1));
