<?php

namespace App\Notifications;

use App\Enums\UserActivityNotificationType;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class UserActivityNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected UserActivityNotificationType $type,
        protected array $data = []
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => $this->type->value,
            'title' => $this->getTitle(),
            'message' => $this->getMessage(),
            'ip' => $this->data['ip'] ?? null,
            'time' => $this->data['time'] ?? now()->toDateTimeString(),
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        $ip = $this->data['ip'] ?? 'نامشخص';

        return (new MailMessage)
            ->subject("🔑 {$this->getTitle()}")
            ->line("{$this->getMessage()} از آی‌پی {$ip} در تاریخ " . now()->toDateTimeString());
    }

    // ✅ متد کمکی برای گرفتن نام کاربر
    private function getUserName(): string
    {
        return isset($this->data['user']) && is_object($this->data['user'])
            ? $this->data['user']->name
            : 'نام‌نامشخص';
    }
    private function getTitle(): string
    {
        return match ($this->type) {
            UserActivityNotificationType::LOGIN => 'ورود به حساب',
            UserActivityNotificationType::LOGOUT => 'خروج از حساب',
            UserActivityNotificationType::REGISTER => 'خوش‌آمدگویی',
            UserActivityNotificationType::FIRST_LOGIN => 'اولین ورود',
            UserActivityNotificationType::ADMIN_LOGIN => 'ورود مدیر',
            UserActivityNotificationType::PROFILE => 'پروفایل',
            UserActivityNotificationType::VIOLATION => 'تخلف',
            UserActivityNotificationType::SYSTEM => 'سیستم',
        };
    }
    private function getMessage(): string
    {
        return match ($this->type) {
            UserActivityNotificationType::LOGIN => "شما با موفقیت وارد شدید.",
            UserActivityNotificationType::LOGOUT => "شما از حساب خود خارج شدید.",
            UserActivityNotificationType::REGISTER => "به لینکو خوش آمدید! پروفایل خود را ایجاد کنید.",
            UserActivityNotificationType::FIRST_LOGIN => "به لینکو خوش آمدید! اولین ورود شما موفقیت‌آمیز بود.",
            UserActivityNotificationType::ADMIN_LOGIN => 'مدیر محترم خوش آمدید',
            UserActivityNotificationType::PROFILE => "پروفایل جدید به نام {$this->getUserName()} ایجاد شد",
            UserActivityNotificationType::VIOLATION => 'گزارش تخلف جدید',
            UserActivityNotificationType::SYSTEM => 'گزارش سیستمی',
        };
    }
}
