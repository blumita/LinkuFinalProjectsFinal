<?php
require '/var/www/api.linku.im/digital-business-card/vendor/autoload.php';
$app = require_once '/var/www/api.linku.im/digital-business-card/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('user_name', 'blumita')->first();
if (!$user) {
    echo 'User not found' . PHP_EOL;
    exit(1);
}

echo 'Current status:' . PHP_EOL;
echo '  Name: ' . $user->name . PHP_EOL;
echo '  is_pro: ' . ($user->is_pro ? 'YES' : 'NO') . PHP_EOL;
echo '  subscription_type: ' . ($user->subscription_type ?? 'NULL') . PHP_EOL;
echo '  subscription_end_date: ' . ($user->subscription_end_date ?? 'NULL') . PHP_EOL;
echo PHP_EOL;

// Fix pro status - اضافه کردن 1 سال اشتراک پرو
$user->is_pro = true;
$user->subscription_type = 'premium';
$user->subscription_end_date = now()->addYear();
$user->subscription_months = 12;
$user->save();

echo 'Updated status:' . PHP_EOL;
echo '  is_pro: YES' . PHP_EOL;
echo '  subscription_type: premium' . PHP_EOL;
echo '  subscription_end_date: ' . $user->subscription_end_date . PHP_EOL;
echo '  subscription_months: 12' . PHP_EOL;
echo PHP_EOL;
echo 'Pro status restored successfully!' . PHP_EOL;
