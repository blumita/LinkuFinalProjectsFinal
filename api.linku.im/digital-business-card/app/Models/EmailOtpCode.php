<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model: EmailOtpCode
 *
 * Represents a one-time password (OTP) record used for email-based authentication.
 * Stores the email address, OTP code, expiration timestamp, and audit timestamps.
 */
class EmailOtpCode extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'email_otp_codes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'code',
        'expires_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Determine if the OTP code has expired.
     *
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
