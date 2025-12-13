<?php
require "/var/www/api.linku.im/digital-business-card/vendor/autoload.php";
$app = require "/var/www/api.linku.im/digital-business-card/bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

// Find user by phone
$user = App\Models\User::where("phone", "09030264300")->first();
if($user) {
    echo "User ID: {$user->id}, Name: {$user->name}, is_pro: {$user->is_pro}, end_date: {$user->subscription_end_date}\n";
    $cards = $user->cards;
    foreach($cards as $c) {
        echo "  Card ID: {$c->id}, name: {$c->card_name}, slug: {$c->slug}, is_default: {$c->is_default}\n";
    }
    
    // Delete extra cards, keep only the first one
    $firstCard = $cards->first();
    if($firstCard && $cards->count() > 1) {
        echo "\nDeleting extra cards...\n";
        foreach($cards as $c) {
            if($c->id !== $firstCard->id) {
                echo "  Deleting Card ID: {$c->id}\n";
                $c->delete();
            }
        }
    }
    
    // Make sure first card is default
    if($firstCard) {
        $firstCard->is_default = true;
        $firstCard->save();
        echo "\nSet card {$firstCard->id} as default\n";
    }
    
    // Make sure user is pro
    $user->is_pro = true;
    $user->subscription_end_date = "2026-12-09";
    $user->subscription_months = 12;
    $user->subscription_type = "premium";
    $user->save();
    echo "User subscription updated!\n";
}
