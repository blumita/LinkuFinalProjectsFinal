<?php

namespace App\Notifications;

use App\Enums\SystemNotificationType;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SystemNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected SystemNotificationType $type,
        protected string $title,
        protected string $message
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("{$this->title}")
            ->line($this->message);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => $this->type->value,
            'title' => $this->title,
            'message' => $this->message,
        ];
    }
}
