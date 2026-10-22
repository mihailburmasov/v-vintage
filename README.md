# V-Vintage — сайт студии аквадизайна (v-vintage.ru)

Новый сайт с интернет-магазином. Он заменяет старый WordPress 2012 года. Сайт статический, его собирает Node-генератор без фреймворков. Заявки, заказы и онлайн-оплату обрабатывает небольшой PHP-бэкенд, который работает на обычном хостинге с PHP 7.0+.

- Превью: https://mihailburmasov.github.io/v-vintage/. Закрыто от индексации, формы работают в демо-режиме.
- Боевой домен: https://v-vintage.ru. Сборка `dist/` выкладывается на хостинг с Apache и PHP.

## Команды

```bash
npm install          # нужен только sharp (обработка фото)
npm run build        # превью → docs/ (GitHub Pages, noindex, без Метрики)
npm run build:prod   # боевая сборка → dist/ (.htaccess с 301, index.php, api/)
npm test             # после build:prod: проверка 301-редиректов, картинок и API
npm run serve        # локальный просмотр превью: http://localhost:8090/v-vintage/
npm run images       # пересобрать фото из _source/ (папка не в git)
```

## Где что лежит

| Путь | Что |
|---|---|
| `src/data/company.json` | Все факты о компании: телефон, почта, реквизиты, ID Метрики, способы доставки, флаг `shop.paymentsEnabled`. Единственный источник, больше нигде не дублировать. |
| `src/data/products.json` | Каталог магазина. `price: null` означает «цена по запросу». |
| `src/data/redirects.json` | Карта 301 со старых адресов `?page_id=N`. Из неё генерируются `.htaccess` и `index.php`. |
| `src/data/galleries.json` | Галереи. Генерируется `npm run images` по правилам `tools/curation.mjs`. |
| `src/pages/*.mjs` | Шаблоны и тексты страниц. |
| `src/lib/ui.mjs` | Layout, шапка, подвал, общие блоки, SEO-разметка. |
| `src/assets/` | CSS, JS, шрифты (локально), фото (webp). |
| `php/api/` | Бэкенд: `lead.php` (заявки), `order.php` (заказы), `pay-callback.php` (уведомления об оплате), драйверы `payments/yookassa.php` и `payments/robokassa.php`. |

## Цены и онлайн-оплата

1. Впишите цены в `src/data/products.json` (рубли, число). Товары без цены остаются «по запросу».
2. На хостинге создайте `api/config.local.php` по образцу `php/api/config.sample.php`: почта для заказов, Telegram (необязательно), драйвер и ключи эквайринга.
3. В `src/data/company.json` поставьте `"paymentsEnabled": true`, затем выполните `npm run build:prod` и выложите сайт.
4. В личном кабинете эквайринга укажите адрес уведомлений `https://v-vintage.ru/api/pay-callback.php?driver=yookassa` (или `driver=robokassa`, Result URL, метод POST).

Цену сервер всегда берёт из своего каталога (`api/products.json`), цены из браузера он не принимает. Онлайн-оплата доступна, только если у всех позиций заказа есть цена. Иначе заказ уходит менеджеру на подтверждение.

## Выкладка на v-vintage.ru

`npm run build:prod`, затем содержимое `dist/` загрузить в корень сайта. Нельзя трогать `api/config.local.php` и `api/data/` на сервере: там настройки и заказы. После выкладки обязательно выполнить шаги SEO-переезда из HANDOFF.md.
