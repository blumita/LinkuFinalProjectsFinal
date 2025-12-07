<?php

require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== تست ساده SMS ===\n\n";

// Test 1: Check environment variables
echo "📋 بررسی متغیرهای محیطی:\n";
echo "SMS_API_KEY: " . (empty(env('SMS_API_KEY')) ? '❌ خالی است' : '✅ موجود است (طول: ' . strlen(env('SMS_API_KEY')) . ')') . "\n";
echo "SMS_PATTERN_CODE: " . env('SMS_PATTERN_CODE', 'تعریف نشده') . "\n";
echo "SMS_SENDER: " . env('SMS_SENDER', 'تعریف نشده') . "\n";
echo "APP_ENV: " . env('APP_ENV', 'تعریف نشده') . "\n\n";

// Test 2: Initialize the SMS class directly
echo "📱 ایجاد نمونه از کلاس SMS:\n";
try {
    $sms = new \App\Gateways\Sms\ModirPayamak();
    echo "✅ کلاس ModirPayamak با موفقیت ساخته شد\n\n";
    
    // Test 3: Try sending SMS
    echo "📤 تست ارسال SMS به شماره 9030264300:\n";
    $result = $sms->send('9030264300', '1234');
    
    if ($result) {
        echo "✅ ✅ ✅ SMS با موفقیت ارسال شد!\n";
    } else {
        echo "⚠️ SMS ارسال نشد (در محیط توسعه این عادی است)\n";
    }
    
} catch (\Exception $e) {
    echo "❌ خطا: " . $e->getMessage() . "\n";
    echo "📄 فایل: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n=== پایان تست ===\n";
