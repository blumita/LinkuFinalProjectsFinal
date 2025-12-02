<?php

namespace App\Observers;

use App\Models\CardVisit;

class CardVisitObserver
{
    /**
     * Handle the CardVisit "creating" event.
     * تخصیص شماره sequence جدید قبل از ذخیره
     */
    public function creating(CardVisit $visit): void
    {
        // پیدا کردن بزرگترین شماره sequence
        $maxNumber = CardVisit::max('sequence_number') ?? 0;
        
        $visit->sequence_number = $maxNumber + 1;
    }

    /**
     * Handle the CardVisit "deleted" event.
     * بعد از حذف، شماره‌های sequence رو از نو مرتب کن
     */
    public function deleted(CardVisit $visit): void
    {
        $this->reorderSequenceNumbers();
    }

    /**
     * Handle the CardVisit "restored" event.
     */
    public function restored(CardVisit $visit): void
    {
        // بعد از بازیابی، شماره جدید بده
        $maxNumber = CardVisit::where('id', '!=', $visit->id)
            ->max('sequence_number') ?? 0;
        
        $visit->sequence_number = $maxNumber + 1;
        $visit->saveQuietly();
    }

    /**
     * Handle the CardVisit "force deleted" event.
     */
    public function forceDeleted(CardVisit $visit): void
    {
        $this->reorderSequenceNumbers();
    }

    /**
     * مرتب‌سازی مجدد شماره sequence ها
     */
    private function reorderSequenceNumbers(): void
    {
        $visits = CardVisit::orderBy('sequence_number')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $number = 1;
        foreach ($visits as $visit) {
            if ($visit->sequence_number !== $number) {
                $visit->sequence_number = $number;
                $visit->saveQuietly(); // بدون trigger کردن observer
            }
            $number++;
        }
    }
}
