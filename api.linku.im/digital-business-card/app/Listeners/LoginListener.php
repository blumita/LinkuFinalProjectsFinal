<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use App\Enums\UserActivityNotificationType;
use App\Notifications\UserActivityNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class LoginListener implements ShouldQueue
{
    public function handle(Login $event): void
    {
        $event->user->notify(new UserActivityNotification(
            UserActivityNotificationType::LOGIN,
            ['ip' => request()->ip(),
                'time' => now()->toDateTimeString()]
        ));
    }
}
