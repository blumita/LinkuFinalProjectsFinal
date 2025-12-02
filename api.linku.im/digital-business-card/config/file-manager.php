<?php

use App\Models\File;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Storage Disk
    |--------------------------------------------------------------------------
    | Supported options: 'local', 'public', 'sftp'
    */
    'disk' => env('FILE_MANAGER_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Default Upload Path
    |--------------------------------------------------------------------------
    */
    'default_path' => 'uploads',

    /*
    |--------------------------------------------------------------------------
    | Model Map
    |--------------------------------------------------------------------------
    | Maps model aliases to actual class names.
    | Used for polymorphic file attachment.
    */
    'model_map' => [
        'user' => \App\Models\User::class,
        'card'=>\App\Models\Card::class,
        'carduser'=>\App\Models\CardUser::class,
        'cardlink'=>\App\Models\CardLink::class,
        'cardlead'=>\App\Models\CardLead::class,
        'cardproduct'=>\App\Models\CardProduct::class,
        'cardqr'=>\App\Models\CardQr::class,
        'form'=>\App\Models\Form::class
        // Add more models as needed
    ],
    'models' => [
        'file' => File::class,
    ],
];
