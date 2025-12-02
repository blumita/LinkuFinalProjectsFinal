<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            'activeGateway' => 'zarinpal',
            'confirmPassword' => '',
            'currencyPosition' => 'after',
            'currentPassword' => '',
            'decimalPlaces' => 0,
            'emailNotifications' => false,
            'gatewayApiKey' => '',
            'merchantId' => '9c4b2e59-8ae4-4852-b59a-4ce3e67f9036',
            'newPassword' => '',
            'newUsername' => '',
            'notificationFrequency' => 'instant',
            'paymentTestMode' => false,
            'primaryCurrency' => 'IRR',
            'smsApiKey' => '',
            'smsNotifications' => false,
            'smsPatternCode' => 'hdsxp8rpsuerefo',
            'smsProvider' => 'modirpayamak',
            'smsProviderPassword' => 'Mh@36463646',
            'smsProviderUserName' => '9142766601',
            'smsSender' => '+983000505',
            'welcomeSmsTemplate' => 'خوش آمدید! برای تکمیل ثبت نام کد {code} را وارد کنید.',
        ];

        foreach ($defaults as $key => $value) {
            Setting::set($key, $value);
        }
    }
}
