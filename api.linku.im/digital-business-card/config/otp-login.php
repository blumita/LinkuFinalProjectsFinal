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

    // IPPanel Edge API Configuration
    'key' => env('SMS_PATTERN_CODE', 'g36m6fr6ozz0e4j'),
    'api_key' => env('SMS_API_KEY', 'YTA4NDUxYzAtZDMzOC00ZTc3LWIxZjAtZWIzODI2MmI5ZDVhNzQ4YzNiMjVjYTYxYjkxMTIyOGI3MTdhNmUyMDViYmY='),
    'sender' => env('SMS_SENDER', '+983000505'), // E.164 format
    'otp_variable' => env('SMS_OTP_VARIABLE', 'linku-code'),
    
    // Legacy fields (for backward compatibility)
    'username' => env('SMS_USERNAME', ''),
    'password' => env('SMS_PASSWORD', ''),

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
