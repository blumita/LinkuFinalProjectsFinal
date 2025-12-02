<?php

namespace App\Notifications;

use App\Enums\SubscriptionNotificationType;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected SubscriptionNotificationType $type,
        protected array                        $data = [] // اطلاعات پویا مثل تاریخ شروع/پایان
    )
    {
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = new MailMessage;

        return match ($this->type) {
            SubscriptionNotificationType::PURCHASE_SUCCESS =>
            $mail->subject('خرید اشتراک موفق')
                ->line("اشتراک شما از {$this->data['start']} تا {$this->data['end']} فعال شد."),

            SubscriptionNotificationType::PURCHASE_FAILED =>
            $mail->subject('خرید اشتراک ناموفق')
                ->line("پرداخت شما ناموفق بود. لطفاً دوباره تلاش کنید."),

            SubscriptionNotificationType::RENEWAL_REMINDER =>
            $mail->subject('یادآوری تمدید اشتراک')
                ->line("اشتراک شما در تاریخ {$this->data['end']} منقضی می‌شود. لطفاً تمدید کنید."),

            SubscriptionNotificationType::RENEWAL_SUCCESS =>
            $mail->subject('تمدید موفق اشتراک')
                ->line("اشتراک شما با موفقیت تمدید شد و تا {$this->data['end']} فعال است."),

            SubscriptionNotificationType::RENEWAL_FAILED =>
            $mail->subject('تمدید ناموفق')
                ->line("تمدید اشتراک شما به دلیل خطای پرداخت انجام نشد."),

            SubscriptionNotificationType::SUBSCRIPTION_EXPIRED =>
            $mail->subject('اشتراک منقضی شد')
                ->line("اشتراک شما در تاریخ {$this->data['end']} منقضی شد."),

            SubscriptionNotificationType::GRACE_PERIOD =>
            $mail->subject('دوره مهلت استفاده')
                ->line("اشتراک شما منقضی شده ولی تا تاریخ {$this->data['grace_end']} می‌توانید استفاده کنید."),
        };
    }

    public function toDatabase($notifiable): array
    {
        // تولید عنوان و متن مناسب بر اساس نوع نوتیفیکیشن
        $title = '';
        $message = '';

        switch ($this->type) {
            case SubscriptionNotificationType::PURCHASE_SUCCESS:
                $title = '✅ خرید اشتراک موفق';
                $message = "اشتراک شما از {$this->data['start']} تا {$this->data['end']} فعال شد.";
                break;

            case SubscriptionNotificationType::PURCHASE_FAILED:
                $title = 'خرید اشتراک ناموفق';
                $message = "پرداخت شما ناموفق بود. لطفاً دوباره تلاش کنید.";
                break;

            case SubscriptionNotificationType::RENEWAL_REMINDER:
                $title = 'یادآوری تمدید اشتراک';
                $message = "اشتراک شما در تاریخ {$this->data['end']} منقضی می‌شود. لطفاً تمدید کنید.";
                break;

            case SubscriptionNotificationType::RENEWAL_SUCCESS:
                $title = 'تمدید موفق اشتراک';
                $message = "اشتراک شما با موفقیت تمدید شد و تا {$this->data['end']} فعال است.";
                break;

            case SubscriptionNotificationType::RENEWAL_FAILED:
                $title = 'تمدید ناموفق';
                $message = "تمدید اشتراک شما به دلیل خطای پرداخت انجام نشد.";
                break;

            case SubscriptionNotificationType::SUBSCRIPTION_EXPIRED:
                $title = 'اشتراک منقضی شد';
                $message = "اشتراک شما در تاریخ {$this->data['end']} منقضی شد.";
                break;

            case SubscriptionNotificationType::GRACE_PERIOD:
                $title = 'دوره مهلت استفاده';
                $message = "اشتراک شما منقضی شده ولی تا تاریخ {$this->data['grace_end']} می‌توانید استفاده کنید.";
                break;
        }

        return [
            'type' => $this->type->value, // نوع Enum
            'title' => $title,
            'message' => $message,
            'data' => $this->data,       // داده‌های پویا مثل تاریخ شروع/پایان
        ];
    }
}
