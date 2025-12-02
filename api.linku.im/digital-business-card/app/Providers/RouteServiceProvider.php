<?php

namespace App\Providers;

use App\Models\Card;
use App\Models\CardLink;
use App\Models\CardProduct;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Route::model('cardproduct',CardProduct::class);

        Route::model('card', Card::class);

        Route::bind('card', function ($value) {
            return Card::where('id', $value)
                ->orWhere('slug', $value)
                ->firstOrFail();
        });

        Route::bind('link', function ($value, $route) {
            $card = $route->parameter('card');

            $query = CardLink::query();

            if ($card) {
                $query->where('card_id', $card->id);
            }

            return $query->where(function ($q) use ($value) {
                $q->where('id', $value)->orWhere('hash', $value);
            })->firstOrFail();
        });


        // Rate limiter برای OTP - افزایش به 50 درخواست در ساعت
        RateLimiter::for('otp', function ($request) {
            return Limit::perHour(50)->by($request->ip());
        });

    }
}
