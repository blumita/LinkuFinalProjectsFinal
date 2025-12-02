<?php

namespace App\Observers;

use App\Models\Card;

class CardObserver
{
    /**
     * Handle the Card "creating" event.
     * تخصیص شماره کارت جدید قبل از ذخیره
     */
    public function creating(Card $card): void
    {
        // اگر کارت user_id داره (کارت کاربر عادی)
        if ($card->user_id) {
            $maxNumber = Card::where('user_id', $card->user_id)
                ->max('card_number') ?? 0;
        } else {
            // کارت‌های ادمین که user_id ندارن - شماره‌گذاری global
            $maxNumber = Card::whereNull('user_id')
                ->max('card_number') ?? 0;
        }
        
        $card->card_number = $maxNumber + 1;
    }

    /**
     * Handle the Card "created" event.
     */
    public function created(Card $card): void
    {
        //
    }

    /**
     * Handle the Card "updated" event.
     */
    public function updated(Card $card): void
    {
        //
    }

    /**
     * Handle the Card "deleted" event.
     * بعد از حذف کارت، شماره‌های کارت‌های دیگر کاربر رو از نو مرتب کن
     */
    public function deleted(Card $card): void
    {
        $this->reorderUserCards($card->user_id);
    }

    /**
     * Handle the Card "restored" event.
     */
    public function restored(Card $card): void
    {
        // بعد از بازیابی، شماره جدید بده
        if ($card->user_id) {
            $maxNumber = Card::where('user_id', $card->user_id)
                ->where('id', '!=', $card->id)
                ->max('card_number') ?? 0;
        } else {
            $maxNumber = Card::whereNull('user_id')
                ->where('id', '!=', $card->id)
                ->max('card_number') ?? 0;
        }
        
        $card->card_number = $maxNumber + 1;
        $card->saveQuietly();
    }

    /**
     * Handle the Card "force deleted" event.
     */
    public function forceDeleted(Card $card): void
    {
        $this->reorderUserCards($card->user_id);
    }

    /**
     * مرتب‌سازی مجدد شماره کارت‌های یک کاربر یا کارت‌های Admin
     */
    private function reorderUserCards(?int $userId): void
    {
        if ($userId) {
            $cards = Card::where('user_id', $userId)
                ->orderBy('card_number')
                ->orderBy('created_at')
                ->get();
        } else {
            // کارت‌های Admin
            $cards = Card::whereNull('user_id')
                ->orderBy('card_number')
                ->orderBy('created_at')
                ->get();
        }

        $number = 1;
        foreach ($cards as $card) {
            if ($card->card_number !== $number) {
                $card->card_number = $number;
                $card->saveQuietly(); // بدون trigger کردن observer
            }
            $number++;
        }
    }
}
