<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdminPushNotification extends Notification
{
    use Queueable;

    protected string $notificationType;
    protected string $title;
    protected string $message;
    protected ?string $actionLink;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        string $notificationType,
        string $title,
        string $message,
        ?string $actionLink = null
    ) {
        $this->notificationType = $notificationType;
        $this->title = $title;
        $this->message = $message;
        $this->actionLink = $actionLink;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->notificationType,
            'title' => $this->title,
            'message' => $this->message,
            'action_link' => $this->actionLink,
            'time' => now()->toDateTimeString(),
        ];
    }
}
