<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::find(1);

if ($user) {
    $user->notify(new \App\Notifications\SystemNotification(
        \App\Enums\SystemNotificationType::GENERAL,
        'تست پوش نوتیفیکیشن 🔔',
        'این یک تست برای سیستم پوش است! اگر این پیام را دیدید، یعنی سیستم کار می‌کند.'
    ));
    echo "✅ نوتیفیکیشن برای کاربر {$user->name} ارسال شد!\n";
    echo "📱 شماره: {$user->phone}\n";
    echo "🔔 لطفاً صفحه نوتیفیکیشن‌ها را چک کنید\n";
} else {
    echo "❌ کاربر یافت نشد\n";
}
