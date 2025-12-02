<?php

use App\Gateways\Sms\FarazPayamak;
use App\Gateways\Sms\ModirPayamak;

return [
    /*
    |--------------------------------------------------------------------------
    | SMS Driver Configuration
    |--------------------------------------------------------------------------
    |
    | Specifies which SMS provider to use for sending OTP codes.
    | You can switch between drivers using the OTP_SMS_DRIVER environment variable.
    |
    */
    'driver' => env('OTP_SMS_DRIVER', 'modirpayamak'),

    'key' => env('SMS_PATTERN_CODE'),
    'api_key' => env('SMS_API_KEY'), // API Key for new IPPanel Edge API
    'sender' => env('SMS_SENDER', '+983000505'), // E.164 format
    'otp_variable' => env('SMS_OTP_VARIABLE', 'verification-code'),
    'username' => env('SMS_USERNAME'),
    'password' => env('SMS_PASSWORD'),

    'drivers' => [
        /*'farazpayamak' => [
            'class' => FarazPayamak::class,
        ],*/
        'modirpayamak' => [
            'class' => ModirPayamak::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | OTP Code Lifetime
    |--------------------------------------------------------------------------
    |
    | Defines how long the OTP code remains valid (in seconds).
    | After expiration, the code cannot be used for authentication.
    |
    */
    'code_lifetime' => 600, // 10 minutes (increased for registration flow)
];
