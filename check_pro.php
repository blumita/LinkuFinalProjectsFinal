<?php
require "/var/www/api.linku.im/digital-business-card/vendor/autoload.php";
$app = require "/var/www/api.linku.im/digital-business-card/bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

// Check user 11
$user = App\Models\User::find(11);
echo "=== User 11 ===\n";
echo "Name: {$user->name}\n";
echo "Phone: {$user->phone}\n";
echo "is_pro: " . ($user->is_pro ? 'true' : 'false') . "\n";
echo "subscription_type: {$user->subscription_type}\n";
echo "subscription_months: {$user->subscription_months}\n";
echo "subscription_end_date: {$user->subscription_end_date}\n";

// Also check recently upgraded users
echo "\n=== All Pro Users ===\n";
$proUsers = App\Models\User::where('is_pro', 1)->get(['id', 'name', 'phone', 'is_pro', 'subscription_end_date', 'subscription_months']);
foreach($proUsers as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, end_date: {$u->subscription_end_date}, months: {$u->subscription_months}\n";
}
