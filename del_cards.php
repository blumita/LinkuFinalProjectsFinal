<?php
require "/var/www/api.linku.im/digital-business-card/vendor/autoload.php";
$app = require "/var/www/api.linku.im/digital-business-card/bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

// Simple delete
App\Models\Card::whereIn('id', [193, 194])->delete();
echo "Cards 193, 194 deleted!\n";

// Verify
$user = App\Models\User::find(51);
echo "User 51 now has " . $user->cards()->count() . " cards\n";
