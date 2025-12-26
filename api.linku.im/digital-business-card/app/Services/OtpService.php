<?php

namespace App\Services;

use App\Contracts\OtpSenderInterface;
use App\Exceptions\CustomException;
use App\Models\OtpCode;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Facades\Log;

class OtpService
{
    protected mixed $driver;
    protected mixed $drivers;
    protected mixed $ttl;


    public function __construct()
    {
        $this->driver = config('otp-login.driver');

        $this->drivers = config('otp-login.drivers');

        $this->ttl = config('otp-login.code_lifetime', 120); // fallback: 120
    }

    /**
     * @throws BindingResolutionException
     * @throws Exception
     */
    public function sendOtp(array $requestData): bool
    {
        try {
            $phone = $this->normalizePhone($requestData['phone']);

            // چک کردن وجود کاربر با این شماره (هر 3 فرمت)
            $existingUser = User::where('phone', $phone)->first();

            // لاگ برای debug
            Log::info('📞 Phone Check', [
                'input' => $requestData['phone'],
                'normalized' => $phone,
                'user_exists' => $existingUser ? 'YES' : 'NO',
                'user_id' => $existingUser?->id
            ]);

            // پاک کردن کدهای منقضی شده قبلی
            OtpCode::where('phone', $phone)
                ->where('expires_at', '<=', now())
                ->delete();

            // اجازه ارسال مجدد اگر کمتر از 30 ثانیه به انقضا مانده (قبلاً 10 بود)
            if ($this->otpCodeExist($phone, 30)) {
                // دریافت زمان باقیمانده برای اطلاع فرونت
                $remainingSeconds = $this->getRemainingSeconds($phone);

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

            $this->saveOtpCode($phone, $otpCode);

            Log::info('🔑 OTP Generated', [
                'phone' => $phone,
                'code_length' => strlen($otpCode),
            ]);

            $result = $this->resolverSender()->send($phone, $otpCode);

            if ($result) {
                Log::info('✅ OTP Send Success', ['phone' => $phone]);
            } else {
                Log::warning('⚠️ OTP Send returned false', ['phone' => $phone]);
            }

            return $result;

        } catch (CustomException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('❌ OTP Send Exception', [
                'error' => $e->getMessage(),
                'phone' => $requestData['phone'] ?? 'unknown',
                'trace' => $e->getTraceAsString(),
            ]);
            throw new CustomException('خطا در ارسال کد تایید: ' . $e->getMessage(), 500);
        }
    }


    /**
     * @throws CustomException
     */
    public function verifyOtp(array $requestData, bool $deleteAfterVerify = true): bool
    {
        // تبدیل کد OTP هم به انگلیسی
        $code = $this->convertPersianToEnglish($requestData['code']);

        Log::info('🔐 OTP Verification Started', [
            'phone_raw' => $requestData['phone'],
            'code_raw' => $requestData['code'],
            'code_converted' => $code,
            'deleteAfterVerify' => $deleteAfterVerify,
        ]);

        if (!$this->checkOtpCode($code)) {
            Log::warning('❌ Invalid OTP format', ['code' => $code]);
            throw new CustomException(__('sms.sms_invalid_format'), 422);
        }

        $normalizedPhone = $this->normalizePhone($requestData['phone']);

        Log::info('📱 Normalized phone', [
            'original' => $requestData['phone'],
            'normalized' => $normalizedPhone,
        ]);

        return $this->otpCodeFind($normalizedPhone, $code, $deleteAfterVerify);
    }

    /**
     * @throws BindingResolutionException
     * @throws CustomException
     */
    public function resolverSender(): OtpSenderInterface
    {

        if (!array_key_exists($this->driver, $this->drivers)) {

            throw new CustomException(__('sms.otp_driver_not_defined') . " ({$this->driver})");

        }

        $driverConfig = $this->drivers[$this->driver];

        if (!isset($driverConfig['class'])) {

            throw new CustomException(__('sms.otp_driver_class_not_defined'));

        }

        return app()->make($driverConfig['class']);

    }

    /**
     * @throws Exception
     */
    public function generateOtpCode(): string
    {
        // Generates a secure 4-digit code (e.g. 1234)
        return str_pad(
            random_int(1000, 9999), 4,
            '0', STR_PAD_LEFT);
    }

    /**
     * @throws Exception
     */
    public function saveOtpCode(string $phone, string $otpCode, ?int $ttlSeconds = null): OtpCode
    {
        return OtpCode::create([
            'phone' => $this->normalizePhone($phone),
            'code' => $otpCode,
            'expires_at' => now()->addSeconds($ttlSeconds ?? $this->ttl),
        ]);
    }

    /**
     * نرمال کردن شماره تلفن به فرمت استاندارد بین‌المللی: 9XXXXXXXXX (بدون صفر)
     * کد کشور (+98) جداگانه ذخیره می‌شود
     * @throws CustomException
     */
    public function normalizePhone(string $phone): string
    {
        // تبدیل ارقام فارسی و عربی به انگلیسی
        $phone = $this->convertPersianToEnglish($phone);

        $digits = preg_replace('/\D/', '', $phone);

        // حذف صفر اول (اگر وجود داشت)
        if (str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }

        // حذف کد کشور ایران اگر وجود داشت
        if (str_starts_with($digits, '98') && strlen($digits) > 10) {
            $digits = substr($digits, 2);
        }

        // حذف + از ابتدا اگر وجود داشت (98 بعد از حذف +)
        if (str_starts_with($digits, '989') && strlen($digits) > 10) {
            $digits = substr($digits, 2);
        }

        // چک کردن فرمت نهایی (باید 9XXXXXXXXX باشه - بدون صفر)
        if (!preg_match('/^9\d{9}$/', $digits)) {
            Log::warning('❌ Invalid phone format', [
                'original' => $phone,
                'normalized' => $digits,
            ]);
            throw new CustomException(__('sms.custom.phone.invalid'));
        }

        // برگرداندن بدون صفر (9XXXXXXXXX)
        return $digits;
    }

    /**
     * تبدیل ارقام فارسی و عربی به انگلیسی
     */
    public function convertPersianToEnglish(string $string): string
    {
        $persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        $arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        $english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        $string = str_replace($persian, $english, $string);
        $string = str_replace($arabic, $english, $string);

        return $string;
    }

    /**
     * @throws CustomException
     */
    public function otpCodeExist(string $phone, int $gracePeriodSeconds = 0): bool
    {
        $query = OtpCode::where('phone', $phone);

        if ($gracePeriodSeconds > 0) {
            // فقط اگر بیشتر از gracePeriod به انقضا مانده جلوگیری کن
            $query->where('expires_at', '>', now()->addSeconds($gracePeriodSeconds));
        } else {
            $query->where('expires_at', '>', now());
        }

        return $query->exists();
    }

    /**
     * دریافت زمان باقیمانده تا انقضای OTP (به ثانیه)
     */
    public function getRemainingSeconds(string $phone): ?int
    {
        $otp = OtpCode::where('phone', $phone)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otp) {
            return null;
        }

        return max(0, now()->diffInSeconds($otp->expires_at, false));
    }

    public function otpCodeFind(string $phone, string $code, bool $deleteAfterVerify = true): bool
    {

        $otp = OtpCode::where('phone', $phone)
            ->where('code', $code)
            ->latest()
            ->first();

        Log::info('🔍 OTP Verify Attempt', [
            'phone' => $phone,
            'code' => $code,
            'otp_found' => $otp ? true : false,
            'otp_expires_at' => $otp?->expires_at,
            'now' => now()->toDateTimeString(),
            'is_expired' => $otp?->isExpired(),
            'deleteAfterVerify' => $deleteAfterVerify,
        ]);

         // Reject if not found
        if (!$otp) {
            Log::warning('❌ OTP not found in database', ['phone' => $phone, 'code' => $code]);
            return false;
        }

        // Reject if expired
        if ($otp->isExpired()) {
            Log::warning('❌ OTP expired', [
                'phone' => $phone,
                'expires_at' => $otp->expires_at,
                'now' => now()->toDateTimeString(),
            ]);
            $otp->delete();
            return false;
        }

        // Delete the OTP after successful verification (one-time use) - اگر deleteAfterVerify=true باشد
        if ($deleteAfterVerify) {
            $otp->delete();
        }

        Log::info('✅ OTP verified successfully', ['phone' => $phone, 'deleted' => $deleteAfterVerify]);

        return true;

    }

    public function checkOtpCode(string $code): bool
    {
        return preg_match('/^\d{4}$/', $code) === 1;
    }

    public function validateCountryCode(string $code): array
    {
        if (preg_match('/^\+\d{1,4}$/', $code)) {
            return [
                'valid' => true,
                'message' => 'Country code is valid.',
                'code' => $code,
            ];
        }

        return [
            'valid' => false,
            'message' => 'Invalid country code format.
             Expected format: + followed by 1 to 4 digits.',
            'code' => $code,
        ];
    }
}
