<?php
// Fix card names from "کارت پیش فرض" to actual user names

require __DIR__ . '/api.linku.im/digital-business-card/vendor/autoload.php';

$app = require_once __DIR__ . '/api.linku.im/digital-business-card/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Card;
use App\Models\User;

$cards = Card::where('card_name', 'کارت پیش فرض')->get();

echo "Found " . $cards->count() . " cards with default name\n";

foreach ($cards as $card) {
    $user = User::find($card->user_id);
    if ($user) {
        $card->update(['card_name' => $user->name]);
        echo "Updated card {$card->id} to '{$user->name}'\n";
    }
}

echo "Done!\n";
