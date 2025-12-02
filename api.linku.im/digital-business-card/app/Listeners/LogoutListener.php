<?php
namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use App\Enums\UserActivityNotificationType;
use App\Notifications\UserActivityNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class LogoutListener implements ShouldQueue
{
    public function handle(Logout $event): void
    {
        $event->user->notify(new UserActivityNotification(
            UserActivityNotificationType::LOGOUT,
            ['ip' => request()->ip(),
                'time' => now()->toDateTimeString()]
        ));
    }
}
