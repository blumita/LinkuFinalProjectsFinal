<?php
require "/var/www/api.linku.im/digital-business-card/vendor/autoload.php";
$app = require "/var/www/api.linku.im/digital-business-card/bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

// Upgrade user 51 to pro
$user = App\Models\User::find(51);
echo "Before:\n";
echo "ID: {$user->id}, Name: {$user->name}, is_pro: " . ($user->is_pro ? 'true' : 'false') . "\n";

$user->is_pro = true;
$user->subscription_type = 'premium';
$user->subscription_months = 12;
$user->subscription_end_date = now()->addYear();
$user->save();

echo "\nAfter:\n";
echo "ID: {$user->id}, Name: {$user->name}, is_pro: " . ($user->is_pro ? 'true' : 'false') . "\n";
echo "subscription_end_date: {$user->subscription_end_date}\n";
echo "subscription_months: {$user->subscription_months}\n";

// Also make sure this user has only one card
$cards = $user->cards;
echo "\nCards count: " . $cards->count() . "\n";
foreach($cards as $c) {
    echo "  Card ID: {$c->id}, name: {$c->card_name}, is_default: {$c->is_default}\n";
}
