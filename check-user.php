<?php
// Check user by phone number
require __DIR__ . '/api.linku.im/digital-business-card/vendor/autoload.php';

$app = require_once __DIR__ . '/api.linku.im/digital-business-card/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$phone = '09120144944';

$user = App\Models\User::where('phone', 'like', "%{$phone}%")
    ->orWhere('phone', 'like', '%9120144944%')
    ->first();

if ($user) {
    echo "=== User Information ===\n";
    echo "ID: {$user->id}\n";
    echo "Name: {$user->name}\n";
    echo "Phone: {$user->phone}\n";
    echo "Email: {$user->email}\n";
    echo "Is Pro: " . ($user->is_pro ? 'Yes' : 'No') . "\n";
    echo "Subscription Type: " . ($user->subscription_type ?? 'free') . "\n";
    echo "Subscription End Date: " . ($user->subscription_end_date ?? 'N/A') . "\n";
    echo "Subscription Months: " . ($user->subscription_months ?? 0) . "\n";
    echo "Created At: {$user->created_at}\n\n";
    
    $totalCards = $user->cards()->count();
    $activeCards = $user->cards()->where('is_active', true)->count();
    
    echo "=== Cards Information ===\n";
    echo "Total Cards: {$totalCards}\n";
    echo "Active Cards: {$activeCards}\n";
    
    if ($totalCards > 0) {
        echo "\n=== Card Details ===\n";
        $cards = $user->cards()->get();
        foreach ($cards as $card) {
            echo "- Card ID: {$card->id}, URL: {$card->url}, Active: " . ($card->is_active ? 'Yes' : 'No') . "\n";
        }
    }
} else {
    echo "User not found with phone: {$phone}\n";
}
