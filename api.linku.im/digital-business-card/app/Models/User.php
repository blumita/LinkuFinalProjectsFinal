<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable,HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'user_name',
        'first_name',
        'last_name',
        'phone',
        'is_pro',
        'location',
        'country_code',
        'referral_code',
        'referral_by',
        'remove_branding',
        'role',
        'email',
        'password',
        'status'
    ];
     protected $casts = [
         'remove_branding' => 'boolean',
     ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_pro' => 'boolean',
            'remove_branding'=>'boolean'
        ];
    }
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($user) {

            if (empty($user->referral_code)) {
                do {
                    $code = strtoupper(Str::random(8));
                } while (self::where('referral_code', $code)->exists());

                $user->referral_code = $code;
            }
        });
    }
    protected static function booted(): void
    {
        static::creating(function ($user) {
            if (empty($user->user_name)) {
                do {

                    $username = 'lnk' . Str::lower(Str::random(4));
                } while (User::where('user_name', $username)->exists());

                $user->user_name = $username;
            }
            // keep legacy `username` column (if present) in sync
            if (empty($user->username)) {
                $user->username = $user->user_name;
            }
        });
    }

    public function avatar(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'avatar');
    }
    public function files(): BelongsTo
    {
        return $this->morphTo(File::class);
    }
    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by');
    }
}
