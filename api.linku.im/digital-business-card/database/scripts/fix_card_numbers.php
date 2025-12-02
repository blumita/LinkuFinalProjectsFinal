<?php
/**
 * اسکریپت برای رفع مشکل شماره‌گذاری کارت‌ها
 * 
 * این اسکریپت:
 * 1. همه کارت‌های کاربران رو پیدا میکنه
 * 2. برای هر کاربر، کارت‌هاش رو از 1 شماره‌گذاری مجدد میکنه
 * 3. کارت‌های Admin (بدون user_id) رو جداگانه از 1 شماره‌گذاری میکنه
 * 
 * اجرا:
 * php database/scripts/fix_card_numbers.php
 */

require __DIR__ . '/../../vendor/autoload.php';

$app = require_once __DIR__ . '/../../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Card;
use Illuminate\Support\Facades\DB;

echo "🔧 شروع رفع مشکل شماره‌گذاری کارت‌ها...\n\n";

DB::beginTransaction();

try {
    // 1. رفع شماره‌گذاری کارت‌های کاربران عادی
    echo "📌 رفع شماره‌گذاری کارت‌های کاربران...\n";
    
    $users = Card::whereNotNull('user_id')
        ->select('user_id')
        ->distinct()
        ->pluck('user_id');
    
    $totalUserCards = 0;
    foreach ($users as $userId) {
        $cards = Card::where('user_id', $userId)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
        
        $number = 1;
        foreach ($cards as $card) {
            if ($card->card_number !== $number) {
                echo "  ✓ کاربر {$userId}: کارت #{$card->id} از {$card->card_number} به {$number} تغییر کرد\n";
            }
            $card->card_number = $number;
            $card->saveQuietly(); // بدون trigger کردن observer
            $number++;
            $totalUserCards++;
        }
    }
    
    echo "✅ {$totalUserCards} کارت کاربر اصلاح شد\n\n";
    
    // 2. رفع شماره‌گذاری کارت‌های Admin
    echo "📌 رفع شماره‌گذاری کارت‌های Admin...\n";
    
    $adminCards = Card::whereNull('user_id')
        ->orderBy('created_at')
        ->orderBy('id')
        ->get();
    
    $number = 1;
    foreach ($adminCards as $card) {
        if ($card->card_number !== $number) {
            echo "  ✓ کارت Admin #{$card->id} از {$card->card_number} به {$number} تغییر کرد\n";
        }
        $card->card_number = $number;
        $card->saveQuietly();
        $number++;
    }
    
    echo "✅ " . ($number - 1) . " کارت Admin اصلاح شد\n\n";
    
    DB::commit();
    
    // 3. نمایش آمار نهایی
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "✅ عملیات با موفقیت انجام شد!\n\n";
    echo "📊 آمار نهایی:\n";
    echo "   • کارت‌های کاربران: {$totalUserCards}\n";
    echo "   • کارت‌های Admin: " . ($number - 1) . "\n";
    echo "   • مجموع: " . ($totalUserCards + $number - 1) . "\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ خطا: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
