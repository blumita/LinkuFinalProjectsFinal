#!/bin/bash

echo "🔗 اتصال به سرور و تست SMS..."
echo "================================"

# اتصال به سرور
sshpass -p "Mh@36463646" ssh -o StrictHostKeyChecking=no root@95.215.59.92 << 'ENDSSH'

echo "✅ متصل به سرور شدیم"
echo ""

cd /var/www/api.linku.im/digital-business-card

echo "📋 بررسی وضعیت فایل .env:"
echo "SMS_API_KEY موجود است: $(grep -c SMS_API_KEY .env)"
echo "SMS_API_KEY length: $(grep SMS_API_KEY .env | cut -d= -f2 | wc -c)"
echo ""

echo "🔄 پاک کردن کش‌ها:"
php artisan config:clear
php artisan cache:clear
echo ""

echo "📦 ساخت کش جدید:"
php artisan config:cache
echo ""

echo "📱 ساخت فایل تست SMS:"
cat > /tmp/test-sms.php << 'PHPEOF'
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== تست SMS در سرور ===\n";
echo "SMS_API_KEY: " . (strlen(config('otp-login.api_key') ?: '') > 0 ? '✅ موجود ('.strlen(config('otp-login.api_key')).' کاراکتر)' : '❌ خالی') . "\n";
echo "Pattern: " . config('otp-login.key') . "\n";
echo "Sender: " . config('otp-login.sender') . "\n\n";

try {
    $sms = new \App\Gateways\Sms\ModirPayamak();
    echo "✅ کلاس SMS ساخته شد\n";
    echo "📤 ارسال SMS به 9030264300...\n\n";
    $result = $sms->send('9030264300', '7777');
    echo $result ? "✅✅✅ SMS با موفقیت ارسال شد!\n" : "❌ SMS ارسال نشد\n";
} catch (\Exception $e) {
    echo "❌ خطا: " . $e->getMessage() . "\n";
}
PHPEOF

echo "🚀 اجرای تست:"
php /tmp/test-sms.php
echo ""

echo "📊 بررسی آخرین لاگ‌ها:"
tail -50 storage/logs/laravel.log | grep -E "SMS|OTP|📱|🔑" | tail -10

ENDSSH

echo ""
echo "================================"
echo "✅ تست کامل شد"
