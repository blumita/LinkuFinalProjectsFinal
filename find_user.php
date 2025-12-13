<?php
require "/var/www/api.linku.im/digital-business-card/vendor/autoload.php";
$app = require "/var/www/api.linku.im/digital-business-card/bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

// Search for user with phone containing 09030264300
$users = App\Models\User::where('phone', 'LIKE', '%9030264300%')->get();
echo "=== Users with phone containing 9030264300 ===\n";
foreach($users as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Phone: {$u->phone}, is_pro: " . ($u->is_pro ? 'true' : 'false') . "\n";
}

// Also search by name
echo "\n=== Users named محبوب ===\n";
$users2 = App\Models\User::where('name', 'LIKE', '%محبوب%')->get();
foreach($users2 as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Phone: {$u->phone}, is_pro: " . ($u->is_pro ? 'true' : 'false') . "\n";
}
