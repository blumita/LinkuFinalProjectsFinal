<?php

use App\Gateways\Payment\ZarinPal;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Payment Gateway
    |--------------------------------------------------------------------------
    |
    | This value determines which gateway will be used by default
    | when none is explicitly specified in the request.
    |
    */
    'default' => 'zarinpal',

    /*
    |--------------------------------------------------------------------------
    | Available Payment Gateways
    |--------------------------------------------------------------------------
    |
    | Define the list of supported gateways and map each one to its
    | corresponding class. You can add or override gateways as needed.
    |
    */
    'gateways' => [
        'zarinpal' => Zarinpal::class,
        // 'idpay' => IDPayGateway::class,
    ],

    'merchant_id' => env('GATEWAY_MERCHANT_ID','e7403b01-5bf0-43d3-b4ef-f0a00a2335a1'),
    'sandbox' => env('APP_ENV') === 'local', // در محیط local خودکار sandbox فعال میشه
];
