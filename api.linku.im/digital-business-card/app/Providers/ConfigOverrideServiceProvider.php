<?php
namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class ConfigOverrideServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot(): void
    {
        try {

            if (!Schema::hasTable('settings')) {
                return;
            }

            $settings = DB::table('settings')
                ->whereIn('key', [
                    'merchantId', 'gatewayApiKey', 'activeGateway', 'paymentTestMode',
                    'smsProvider', 'smsPatternCode', 'smsProviderUserName', 'smsProviderPassword',
                    'smsApiKey', 'smsSender'
                ])
                ->pluck('value', 'key');


            Config::set('otp-login.driver', $settings['smsProvider'] ?? '');
            Config::set('otp-login.key', $settings['smsPatternCode'] ?? '');
            Config::set('otp-login.api_key', $settings['smsApiKey'] ?? '');
            Config::set('otp-login.sender', $settings['smsSender'] ?? '');
            Config::set('otp-login.username', $settings['smsProviderUserName'] ?? '');
            Config::set('otp-login.password', $settings['smsProviderPassword'] ?? '');

            // تنظیمات پرداخت
            Config::set('smart-payment.default', $settings['activeGateway'] ?? '');
            Config::set('smart-payment.merchant_id', $settings['merchantId'] ?? '');
            Config::set('smart-payment.sandbox', filter_var($settings['paymentTestMode'] ?? false, FILTER_VALIDATE_BOOLEAN));
        } catch (\Throwable $e) {
            logger()->warning('ConfigOverrideServiceProvider failed: ' . $e->getMessage());
        }
    }
}
