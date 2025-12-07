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


        // Rate limiter برای OTP - 5 درخواست در 2 دقیقه به ازای هر شماره
        RateLimiter::for('otp', function ($request) {
            $phone = $request->input('phone') ?? $request->ip();
            return Limit::perMinutes(2, 5)->by($phone)
                ->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'لطفاً 2 دقیقه صبر کنید و دوباره تلاش کنید.',
                        'code' => 'rate_limit_exceeded'
                    ], 429);
                });
        });

        // Rate limiter برای admin login - 5 تلاش در 15 دقیقه
        RateLimiter::for('admin.login', function ($request) {
            $key = 'admin-login:' . $request->ip();
            return Limit::perMinutes(15, 5)->by($key)
                ->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً 15 دقیقه صبر کنید.',
                        'code' => 'login_attempts_exceeded'
                    ], 429);
                });
        });

        // Rate limiter عمومی API - 100 درخواست در دقیقه
        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(100)->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'تعداد درخواست‌های شما بیش از حد مجاز است.',
                        'code' => 'rate_limit_exceeded'
                    ], 429);
                });
        });

    }
}
