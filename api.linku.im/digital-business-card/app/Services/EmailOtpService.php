<?php

namespace App\Services;

use App\Exceptions\CustomException;
use App\Mail\OtpCodeMail;
use App\Mail\AdminOtpCodeMail;
use App\Models\EmailOtpCode;
use Exception;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailOtpService
{
    protected int $ttl;

    public function __construct()
    {
        $this->ttl = config('otp-login.code_lifetime', 120); // 120 seconds default
    }

    /**
     * Send OTP code to email
     *
     * @throws CustomException
     * @throws Exception
     */
    public function sendOtp(string $email, string $type = 'user'): bool
    {
        $email = $this->normalizeEmail($email);

        // پاک کردن کدهای منقضی شده قبلی
        EmailOtpCode::where('email', $email)
            ->where('expires_at', '<=', now())
            ->delete();

        if ($this->otpCodeExist($email)) {
            // دریافت زمان باقیمانده برای اطلاع فرونت
            $remainingSeconds = $this->getRemainingSeconds($email);
            
            throw new CustomException(
                __('sms.sms_recent_code'),
                429,
                [
                    'code' => 'code_already_valid',
                    'remaining_seconds' => $remainingSeconds
                ]
            );
        }

        $otpCode = $this->generateOtpCode();
        $this->saveOtpCode($email, $otpCode);

        try {
            // ارسال ایمیل مناسب بر اساس تایپ
            if ($type === 'admin') {
                Mail::to($email)->send(new AdminOtpCodeMail($otpCode));
            } else {
                Mail::to($email)->send(new OtpCodeMail($otpCode));
            }
            return true;
        } catch (Exception $e) {
            Log::error('Email OTP send failed: ' . $e->getMessage());
            throw new CustomException('ارسال ایمیل با مشکل مواجه شد. لطفاً دوباره تلاش کنید.', 500);
        }
    }

    /**
     * Verify OTP code
     * @param bool $deleteAfterVerify Whether to delete the OTP after successful verification
     * @throws CustomException
     */
    public function verifyOtp(string $email, string $code, bool $deleteAfterVerify = true): bool
    {
        $email = $this->normalizeEmail($email);

        if (!$this->checkOtpCode($code)) {
            throw new CustomException(__('sms.sms_invalid_format'), 422);
        }

        return $this->otpCodeFind($email, $code, $deleteAfterVerify);
    }

    /**
     * Generate a random 4-digit OTP code
     *
     * @throws Exception
     */
    public function generateOtpCode(): string
    {
        return str_pad(
            random_int(1000, 9999), 4,
            '0', STR_PAD_LEFT
        );
    }

    /**
     * Save OTP code to database
     *
     * @throws Exception
     */
    public function saveOtpCode(string $email, string $otpCode, ?int $ttlSeconds = null): EmailOtpCode
    {
        return EmailOtpCode::create([
            'email' => $this->normalizeEmail($email),
            'code' => $otpCode,
            'expires_at' => now()->addSeconds($ttlSeconds ?? $this->ttl),
        ]);
    }

    /**
     * Normalize email address
     *
     * @throws CustomException
     */
    public function normalizeEmail(string $email): string
    {
        $email = strtolower(trim($email));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new CustomException('فرمت ایمیل نامعتبر است.', 422);
        }

        return $email;
    }

    /**
     * Check if an active OTP exists for this email
     */
    public function otpCodeExist(string $email): bool
    {
        return EmailOtpCode::where('email', $email)
            ->where('expires_at', '>', now())
            ->exists();
    }

    /**
     * دریافت زمان باقیمانده تا انقضای OTP (به ثانیه)
     */
    public function getRemainingSeconds(string $email): ?int
    {
        $otp = EmailOtpCode::where('email', $email)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otp) {
            return null;
        }

        return max(0, now()->diffInSeconds($otp->expires_at, false));
    }

    /**
     * Find and verify OTP code
     * @param bool $deleteAfterVerify Whether to delete the OTP after successful verification
     */
    public function otpCodeFind(string $email, string $code, bool $deleteAfterVerify = true): bool
    {
        $otp = EmailOtpCode::where('email', $email)
            ->where('code', $code)
            ->latest()
            ->first();

        // Reject if not found
        if (!$otp) {
            return false;
        }

        // Reject if expired
        if ($otp->isExpired()) {
            $otp->delete();
            return false;
        }

        // Delete the OTP after successful verification (one-time use) - only if requested
        if ($deleteAfterVerify) {
            $otp->delete();
        }

        return true;
    }

    /**
     * Delete OTP code for email
     */
    public function deleteOtp(string $email): void
    {
        EmailOtpCode::where('email', $email)->delete();
    }

    /**
     * Validate OTP code format (4 digits)
     */
    public function checkOtpCode(string $code): bool
    {
        return preg_match('/^\d{4}$/', $code) === 1;
    }
}
