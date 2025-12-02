<?php

namespace App\Providers;

use App\Models\Card;
use App\Models\CardVisit;
use App\Models\Transaction;
use App\Observers\CardObserver;
use App\Observers\CardVisitObserver;
use App\Observers\TransactionObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Transaction::observe(TransactionObserver::class);
        Card::observe(CardObserver::class);
        CardVisit::observe(CardVisitObserver::class);
    }
}
