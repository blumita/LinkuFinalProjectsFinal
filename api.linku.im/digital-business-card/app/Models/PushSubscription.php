<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PushSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'user_id',
        'endpoint',
        'p256dh',
        'auth',
        'keys',
        'content_encoding'
    ];

    protected $casts = [
        'keys' => 'array'
    ];

    /**
     * رابطه با مدل Admin
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
    
    /**
     * رابطه با مدل User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * تبدیل به فرمت مورد نیاز WebPush
     */
    public function toWebPushFormat(): array
    {
        return [
            'endpoint' => $this->endpoint,
            'keys' => [
                'p256dh' => $this->p256dh,
                'auth' => $this->auth
            ],
            'contentEncoding' => $this->content_encoding ?? 'aesgcm'
        ];
    }
}
