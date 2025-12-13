<?php
require "/var/www/api.linku.im/digital-business-card/vendor/autoload.php";
$app = require "/var/www/api.linku.im/digital-business-card/bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

use Illuminate\Support\Facades\DB;

// First delete card_users, then cards
DB::table('card_users')->whereIn('card_id', [193, 194])->delete();
DB::table('card_links')->whereIn('card_id', [193, 194])->delete();
DB::table('card_leads')->whereIn('card_id', [193, 194])->delete();
DB::table('cards')->whereIn('id', [193, 194])->delete();

echo "Cards 193, 194 and related data deleted!\n";

// Verify
$user = App\Models\User::find(51);
echo "User 51 now has " . $user->cards()->count() . " cards\n";
