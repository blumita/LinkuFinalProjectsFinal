<?php

/**
 * تست phone normalization
 * این اسکریپت تست می‌کنه که تمام فرمت‌های مختلف شماره به یک فرمت استاندارد تبدیل میشن
 */

require __DIR__.'/vendor/autoload.php';

use App\Services\OtpService;
use Illuminate\Support\Facades\Log;

// Bootstrap Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$otpService = new OtpService();

$testCases = [
    // فرمت‌های مختلف یک شماره
    '09123456789',      // فرمت استاندارد ایران
    '9123456789',       // بدون صفر
    '+989123456789',    // با کد کشور و +
    '989123456789',     // با کد کشور بدون +
    '۰۹۱۲۳۴۵۶۷۸۹',     // ارقام فارسی
    '0 912 345 6789',   // با فاصله
    '0912-345-6789',    // با خط تیره
];

echo "🧪 Testing Phone Normalization\n";
echo str_repeat('=', 50) . "\n\n";

$normalized = [];
foreach ($testCases as $phone) {
    try {
        $result = $otpService->normalizePhone($phone);
        $normalized[] = $result;
        echo "✅ {$phone} → {$result}\n";
    } catch (\Exception $e) {
        echo "❌ {$phone} → ERROR: {$e->getMessage()}\n";
    }
}

echo "\n" . str_repeat('=', 50) . "\n";
echo "📊 Test Results:\n\n";

// چک کردن اینکه همه به یک فرمت تبدیل شدن
$unique = array_unique($normalized);
if (count($unique) === 1) {
    echo "✅ SUCCESS: All phone formats normalized to: {$unique[0]}\n";
    echo "✅ This prevents duplicate account creation!\n";
} else {
    echo "❌ FAIL: Different formats produced different results:\n";
    foreach ($unique as $format) {
        echo "  - {$format}\n";
    }
}

echo "\n" . str_repeat('=', 50) . "\n";
echo "🔍 Expected behavior:\n";
echo "  - User registers with: 09123456789\n";
echo "  - Cannot register again with: +989123456789\n";
echo "  - Cannot register again with: 989123456789\n";
echo "  - Cannot register again with: 9123456789\n";
echo "  - All login attempts with different formats → same account\n";
