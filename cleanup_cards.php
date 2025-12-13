<?php
require "/var/www/api.linku.im/digital-business-card/vendor/autoload.php";
$app = require "/var/www/api.linku.im/digital-business-card/bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

// Delete extra cards for user 51
$user = App\Models\User::find(51);
$cards = $user->cards;

echo "Before: " . $cards->count() . " cards\n";

// Keep only the first (default) card
$firstCard = $cards->where('is_default', 1)->first();
if (!$firstCard) {
    $firstCard = $cards->first();
}

foreach($cards as $c) {
    if ($c->id !== $firstCard->id) {
        echo "Deleting card {$c->id} ({$c->card_name})\n";
        // Delete related data safely
        if ($c->user) $c->user()->delete(); // CardUser
        $c->links()->delete();
        $c->leads()->delete();
        $c->qrCodes()->delete();
        $c->delete();
    }
}

// Refresh
$user->refresh();
echo "\nAfter: " . $user->cards()->count() . " cards\n";
foreach($user->cards as $c) {
    echo "  Card ID: {$c->id}, name: {$c->card_name}, is_default: {$c->is_default}\n";
}
