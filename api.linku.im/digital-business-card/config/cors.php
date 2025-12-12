<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'v1/*', 'sanctum/csrf-cookie', 'login', 'logout', 'user/*', 'cards/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => env('APP_ENV') === 'local' 
        ? ['*']  // در محیط local همه origin ها مجاز هستند
        : [
            env('FRONTEND_URL', 'https://dash.linku.im'),
            'https://linku.im',
            'https://www.linku.im',
            'https://dash.linkuapp.com',
            'https://linkuapp.com',
            'https://www.linkuapp.com',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5779',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:5779',
        ],

    'allowed_origins_patterns' => [
        '#^https?://.*\.linku\.im$#',
        '#^https?://.*\.linkuapp\.com$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
