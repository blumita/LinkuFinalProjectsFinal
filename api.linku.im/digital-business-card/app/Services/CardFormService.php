<?php

namespace App\Services;

class CardFormService
{
    public FileManagerService $service;

    public function __construct(FileManagerService $service)
    {
        $this->service = $service;
    }

    public function getFormsOfCard($card): array
    {

        if (!$card->links || $card->links->isEmpty()) {
            return [collect(), 0];
        }

        // جمع‌کردن فرم‌های همه لینک‌ها
        $linkForms = $card->links->flatMap(function ($link) {
            return $link->forms()->latest()->get();
        });

        // شمارش فرم‌های خوانده‌نشده
        $unreadCount = $card->links->sum(function ($link) {
            return $link->forms()->whereNull('read_at')->count();
        });

        return [$linkForms, $unreadCount];

    }

    public function readAll($card): void
    {

        if (!$card->links || $card->links->isEmpty()) {
            return;
        }

        foreach ($card->links as $link) {
            $link->forms()->whereNull('read_at')->update(['read_at' => now()]);
        }

    }

    public function cardHasLinkedForms($card): bool
    {

        if (!$card->links || $card->links->isEmpty()) {
            return false;
        }

        return $card->links->contains(function ($link) {
            return $link->forms()->exists();
        });
    }

}
