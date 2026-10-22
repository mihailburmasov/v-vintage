<?php
// ОБРАЗЕЦ настроек. Не храните здесь секреты!
// Скопируйте в config.local.php (он не попадает в git и не перезаписывается при выкладке)
// и заполните только то, что нужно поменять.
return array(
    'site' => 'https://v-vintage.ru',
    // Папка для заказов и логов. Пусто — автоматически ../v-vintage-data рядом с корнем сайта,
    // а если туда нельзя писать — api/data (файлы защищены, но лучше хранить вне корня).
    'data_dir' => '',
    'notify' => array(
        'email' => '',            // куда слать заявки и заказы, напр. v-vintage2012@mail.ru
        'from' => 'noreply@v-vintage.ru',
        'telegram_token' => '',   // токен бота (необязательно)
        'telegram_chat' => '',    // id чата
    ),
    'payment' => array(
        // none — без онлайн-оплаты (заказ уходит менеджеру);
        // yookassa | robokassa — подключённый эквайринг. Включить также shop.paymentsEnabled в src/data/company.json
        'driver' => 'none',
        'test' => true,
        'yookassa' => array(
            'shop_id' => '',
            'secret_key' => '',
            'vat_code' => 1,          // 1 — без НДС; уточнить у бухгалтера
            'payment_subject' => 'commodity',
        ),
        'robokassa' => array(
            'login' => '',
            'password1' => '',
            'password2' => '',
            'test_password1' => '',
            'test_password2' => '',
            'tax' => 'none',          // система налогообложения для чека 54-ФЗ — уточнить
        ),
    ),
);
