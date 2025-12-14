<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// تعداد کل پروفایل‌ها (CardVisit)
$totalCards = \App\Models\CardVisit::count();
$activeCards = \App\Models\CardVisit::where('status', 'active')->count();
$inactiveCards = \App\Models\CardVisit::where('status', 'inactive')->count();

// تعداد کاربران
$totalUsers = \App\Models\User::count();

// تعداد محصولات
$totalProducts = \App\Models\Product::count();

echo "╔══════════════════════════════════════╗\n";
echo "║   آمار دیتابیس لینکو                 ║\n";
echo "╚══════════════════════════════════════╝\n\n";

echo "📊 کارت‌های ویزیت (پروفایل‌ها):\n";
echo "   • کل: {$totalCards}\n";
echo "   • فعال: {$activeCards}\n";
echo "   • غیرفعال: {$inactiveCards}\n\n";

echo "👥 کاربران: {$totalUsers}\n\n";

echo "📦 محصولات: {$totalProducts}\n\n";

// نمایش 5 کارت آخر
echo "🔍 آخرین 5 کارت:\n";
$latestCards = \App\Models\CardVisit::latest()->take(5)->get();
foreach ($latestCards as $card) {
    echo "   • {$card->owner_name} - {$card->status} - {$card->created_at->format('Y-m-d')}\n";
}
