<?php

namespace App\Http\Controllers\v1;

use App\Enums\UserActivityNotificationType;
use App\Exceptions\CustomException;
use App\Http\Requests\v1\OtpCodeRequest;
use App\Http\Requests\v1\VerifyOtpCodeRequest;
use App\Http\Requests\v1\EmailOtpCodeRequest;
use App\Http\Requests\v1\VerifyEmailOtpCodeRequest;
use App\Models\Order;
use App\Models\Admin;
use App\Models\OtpCode;
use App\Models\User;
use App\Notifications\UserActivityNotification;
use App\Services\OtpService;
use App\Services\EmailOtpService;
use App\Traits\HasApiResponses;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OtpCodeController
{
    use HasApiResponses;

    protected OtpService $otpService;
    protected EmailOtpService $emailOtpService;

    public function __construct(OtpService $otpService, EmailOtpService $emailOtpService)
    {
        $this->otpService = $otpService;
        $this->emailOtpService = $emailOtpService;
    }

    /**
     *
     * @throws BindingResolutionException
     */
    public function sendOtpCode(OtpCodeRequest $request): JsonResponse
    {
        try {
            $result = $this->otpService->sendOtp($request->validated());

            if (!$result) {
                return $this->fail(__('sms.sms_not_sent'));
            }

            return $this->ok(__('sms.sms_sent'));

        } catch (CustomException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 422);
        }
    }

    /**
     *
     * @throws CustomException
     */
    public function verifyOtpCode(VerifyOtpCodeRequest $request): JsonResponse
    {
        //
        $validatedData = $request->validated();

        // بررسی اینکه کاربر جدید است و اطلاعات پروفایل ندارد
        $phone = $this->otpService->normalizePhone($validatedData['phone']);
        $existingUser = User::where('phone', $phone)->first();
        $isNewUserWithoutProfile = !$existingUser && empty($validatedData['name']);

        // OTP را verify کن، ولی اگر کاربر جدید است و پروفایل ندارد، حذف نکن
        if (!$this->otpService->verifyOtp($validatedData, !$isNewUserWithoutProfile)) {
            throw new CustomException(__('sms.sms_expired'), 429);
        }

        if (($validatedData['type'] ?? null) === 'authenticate') {
            return $this->ok('success', '', 200);
        }

        if (($validatedData['type'] ?? null) === 'admin_authenticate') {
            return $this->adminLogin($validatedData);
        }

        // اگر کاربر جدید است و نام ارسال نشده، فرم ثبت‌نام نمایش داده شود
        if (!$existingUser && empty($validatedData['name'])) {
            return $this->fail(
                'کاربر جدید است؛ لطفاً نام و کد معرف را ارسال کنید.',
                null,
                422,
                'profile_required'
            );
        }

        return $this->login($validatedData);
    }

    /**
     * @throws CustomException
     */
    public function adminLogin(array $request): JsonResponse
    {
        $phone = $this->otpService->normalizePhone($request['phone']);

        $user = User::where('phone', $phone)->first();

        if (!$user) {
            throw new CustomException(__('auth.user_not_found'), 404);
        }


        if ($user->role!=='admin') {
            throw new CustomException(__('auth.not_admin_user'), 403);
        }

        Auth::login($user);

        $user->notify(new UserActivityNotification(UserActivityNotificationType::ADMIN_LOGIN));

        return response()->json([
            'token' => $user->createToken('admin-otp-login', ['admin'])->plainTextToken,
            'user' => $user,
            'message' => __('auth.admin_login_success'),
        ]);
    }

    /**
     * @throws CustomException
     */
    public function verifyPhoneChange(VerifyOtpCodeRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        if (!$this->otpService->verifyOtp($validatedData)) {

            throw new CustomException(__('sms.sms_expired'), 429);

        }

        $user = $request->user();

        $exists = User::where('phone', $validatedData['phone'])
            ->where('id', '!=', $user->id)
            ->exists();

        if ($exists) {
            throw new CustomException(__('sms.phone_already_taken'), 409);
        }

        $user->phone = $validatedData['phone'];

        $user->save();

        return $this->ok($user, __('messages.phone_updated_successfully'));
    }

    /**
     * @throws CustomException
     */
    public function login(array $request): JsonResponse
    {
        // Default country code if not provided
        $countryCode = $request['countryCode'] ?? '+98';
        
        $result = $this->checkExistOrCreateUser(
            $this->otpService->normalizePhone($request['phone']),
            $this->otpService->validateCountryCode($countryCode),
            $request['name'] ?? null,
            $request['referralCode'] ?? null
        );

        $user = $result['user'];
        $isNew = $result['isNew'];

        Auth::login($user);

        $user->notify(new UserActivityNotification(UserActivityNotificationType::REGISTER));

        return response()->json([
            'token' => $user->createToken('otp-login')->plainTextToken,
            'user' => $user,
        ], $isNew ? 201 : 200);

    }

    public function checkExistOrCreateUser($phone, $countryCode, $name = null, $referralCode = null): array
    {
        $user = User::where('phone', $phone)->first();

        if (!$user) {
            // اگر نام ارسال شده، استفاده کن، وگرنه یک username پیش‌فرض بساز
            $userName = $name ?? ('user' . substr($phone, -4));
            $username = 'user' . substr($phone, -4); // username یکتا
            
            $user = User::create([
                'name' => $userName,
                'username' => $username,
                'email' => null, // ایمیل بعداً توسط کاربر تکمیل میشه
                'phone' => $phone,
                'country_code' => $countryCode['code'] ?? null,
                'password' => Hash::make('default_password'),
                'referral_code' => $referralCode, // کد معرف (اگر ارسال شده)
            ]);

            $user->notify(new UserActivityNotification(UserActivityNotificationType::FIRST_LOGIN));

            return ['user' => $user, 'isNew' => true];
        }

        // Check if user has an active paid subscription and update pro status
        $activeOrder = Order::where('user_id', $user->id)
            ->where('start_date', '<=', now())
            ->where('end_date', '>', now())
            ->whereHas('transaction', fn($q) => $q->where('is_success', true))
            ->first();

        if (!$activeOrder) {
            $user->is_pro = false;
            $user->save();
        }
        return ['user' => $user, 'isNew' => false];
    }

    /**
     * @throws CustomException
     */
    public function LoginWithPass(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);


        $phone = $this->otpService->normalizePhone($request->input('phone'));


        $user = User::where('phone', $phone)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'کاربری با این شماره وجود ندارد.'
            ], 404);
        }

        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'رمز عبور اشتباه است.'
            ], 401);
        }


        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'ورود با موفقیت انجام شد.',
            'token' => $token,
        ], 200);
    }

    // ================== Email OTP Methods ==================

    /**
     * Send OTP code to email
     *
     * @throws CustomException
     */
    public function sendEmailOtp(EmailOtpCodeRequest $request): JsonResponse
    {
        $result = $this->emailOtpService->sendOtp($request->validated()['email']);

        if (!$result) {
            return $this->fail('ارسال ایمیل با مشکل مواجه شد.');
        }

        return $this->ok('کد تایید به ایمیل شما ارسال شد.');
    }

    /**
     * Verify email OTP code and login/register user
     *
     * @throws CustomException
     */
    public function verifyEmailOtp(VerifyEmailOtpCodeRequest $request): JsonResponse
    {
        $validatedData = $request->validated();
        $email = strtolower(trim($validatedData['email']));

        // بررسی کنیم کاربر جدید است و اطلاعات پروفایل ندارد
        $existingUser = User::where('email', $email)->first();
        // فقط نام الزامی است، شماره تلفن اختیاری است
        $isNewUserWithoutProfile = !$existingUser && empty($validatedData['name']);

        // OTP را verify کن، ولی اگر کاربر جدید است و پروفایل ندارد، حذف نکن
        if (!$this->emailOtpService->verifyOtp($email, $validatedData['code'], !$isNewUserWithoutProfile)) {
            throw new CustomException(__('sms.sms_expired'), 429);
        }

        // اگر فقط برای احراز هویت است (بدون لاگین)
        if (($validatedData['type'] ?? null) === 'authenticate') {
            return $this->ok('success', '', 200);
        }

        // اگر برای ادمین است
        if (($validatedData['type'] ?? null) === 'admin_authenticate') {
            return $this->emailAdminLogin($email);
        }

        // لاگین یا ثبت‌نام معمولی
        // اگر کاربر وجود ندارد و اطلاعات پروفایل ارسال نشده، به کلاینت اطلاع بده تا فرم تکمیل شود
        if (!$existingUser) {
            // نام الزامی است، شماره تلفن اختیاری
            if (empty($validatedData['name'])) {
                return $this->fail(
                    'کاربر جدید است؛ لطفاً نام و نام خانوادگی را ارسال کنید.',
                    null,
                    422,
                    'profile_required'
                );
            }

            // بررسی شماره (ممنوعیت اسرائیل) - فقط اگر شماره ارسال شده باشد
            $phoneRaw = $validatedData['phone'] ?? null;
            $digits = $phoneRaw ? preg_replace('/\D/', '', $phoneRaw) : null;

            if ($digits && preg_match('/^(?:972)/', $digits)) {
                return $this->fail(
                    'شماره تلفن از کشور مجاز نیست.',
                    null,
                    422,
                    'invalid_phone_country'
                );
            }

            // بررسی اینکه شماره قبلاً استفاده نشده باشد
            if (!empty($digits) && User::where('phone', $digits)->exists()) {
                return $this->fail(
                    'شماره تلفن قبلاً ثبت شده است.',
                    null,
                    409,
                    'phone_taken'
                );
            }

            // ساخت کاربر جدید با اطلاعات ارسال‌شده
            // نام کامل = نام + نام خانوادگی
            $fullName = trim($validatedData['name'] ?? '');
            if (!empty($validatedData['family'])) {
                $fullName .= ' ' . trim($validatedData['family']);
            }
            if (empty($fullName)) {
                $fullName = explode('@', $email)[0];
            }
            
            $user = User::create([
                'name' => $fullName,
                'email' => $email,
                'phone' => $digits ?: null,
                'country_code' => null,
                'password' => Hash::make('default_password'),
            ]);

            $user->notify(new UserActivityNotification(UserActivityNotificationType::FIRST_LOGIN));

            Auth::login($user);

            return response()->json([
                'token' => $user->createToken('email-otp-login')->plainTextToken,
                'user' => $user,
            ], 201);
        }

        return $this->emailLogin($email);
    }

    /**
     * Login or register user by email
     *
     * @throws CustomException
     */
    protected function emailLogin(string $email): JsonResponse
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new CustomException(__('auth.user_not_found'), 404);
        }

        Auth::login($user);

        $user->notify(new UserActivityNotification(UserActivityNotificationType::REGISTER));

        return response()->json([
            'token' => $user->createToken('email-otp-login')->plainTextToken,
            'user' => $user,
        ], 200);
    }

    /**
     * Admin login by email
     *
     * @throws CustomException
     */
    protected function emailAdminLogin(string $email): JsonResponse
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new CustomException(__('auth.user_not_found'), 404);
        }

        if ($user->role !== 'admin') {
            throw new CustomException(__('auth.not_admin_user'), 403);
        }

        Auth::login($user);

        $user->notify(new UserActivityNotification(UserActivityNotificationType::ADMIN_LOGIN));

        return response()->json([
            'token' => $user->createToken('admin-email-otp-login', ['admin'])->plainTextToken,
            'user' => $user,
            'message' => __('auth.admin_login_success'),
        ]);
    }

    /**
     * Send OTP code to admin email
     *
     * @throws CustomException
     */
    public function sendAdminEmailOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower(trim($request->email));

        // بررسی اینکه کاربر ادمین باشد
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return $this->fail('کاربری با این ایمیل یافت نشد.');
        }

        if ($user->role !== 'admin') {
            return $this->fail('شما دسترسی ادمین ندارید.');
        }

        $result = $this->emailOtpService->sendOtp($email, 'admin');

        if (!$result) {
            return $this->fail('ارسال ایمیل با مشکل مواجه شد.');
        }

        return $this->ok('کد تایید به ایمیل شما ارسال شد.');
    }

    /**
     * Verify admin email OTP code
     *
     * @throws CustomException
     */
    public function verifyAdminEmailOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:4',
        ]);

        $email = strtolower(trim($request->email));

        if (!$this->emailOtpService->verifyOtp($email, $request->code)) {
            throw new CustomException('کد وارد شده صحیح نیست یا منقضی شده است.', 429);
        }

        return $this->emailAdminLogin($email);
    }

    /**
     * Check if user exists or create new one by email
     */
    public function checkExistOrCreateUserByEmail(string $email): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            // استخراج نام از ایمیل
            $emailName = explode('@', $email)[0];
            
            $user = User::create([
                'name' => $emailName,
                'email' => $email,
                'phone' => null, // بدون شماره تلفن
                'country_code' => null,
                'password' => Hash::make('default_password'),
            ]);

            $user->notify(new UserActivityNotification(UserActivityNotificationType::FIRST_LOGIN));

            return ['user' => $user, 'isNew' => true];
        }

        // Check if user has an active paid subscription and update pro status
        $activeOrder = Order::where('user_id', $user->id)
            ->where('start_date', '<=', now())
            ->where('end_date', '>', now())
            ->whereHas('transaction', fn($q) => $q->where('is_success', true))
            ->first();

        if (!$activeOrder) {
            $user->is_pro = false;
            $user->save();
        }

        return ['user' => $user, 'isNew' => false];
    }

    /**
     * Admin login with password - Step 1: Verify credentials and send 2FA code
     *
     * @throws CustomException
     */
    public function adminLoginWithPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = strtolower(trim($request->email));

        // پیدا کردن ادمین از جدول admins
        $admin = Admin::where('email', $email)->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'ادمینی با این ایمیل یافت نشد.'
            ], 404);
        }

        // بررسی رمز عبور
        if (!Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'ایمیل یا رمز عبور اشتباه است.'
            ], 401);
        }

        // رمز صحیح بود - ارسال کد 2FA
        $result = $this->emailOtpService->sendOtp($email, 'admin');

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'ارسال کد تایید با مشکل مواجه شد.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'کد تایید دو مرحله‌ای به ایمیل شما ارسال شد.'
        ]);
    }

    /**
     * Verify 2FA code for admin password login - Step 2
     *
     * @throws CustomException
     */
    public function verifyAdmin2FA(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:4',
        ]);

        $email = strtolower(trim($request->email));

        // بررسی کد OTP
        if (!$this->emailOtpService->verifyOtp($email, $request->code)) {
            throw new CustomException('کد وارد شده صحیح نیست یا منقضی شده است.', 429);
        }

        // پیدا کردن ادمین از جدول admins و لاگین
        $admin = Admin::where('email', $email)->first();

        if (!$admin) {
            throw new CustomException('ادمین معتبر نیست.', 403);
        }

        Auth::guard('admin')->login($admin);

        return response()->json([
            'token' => $admin->createToken('admin-password-2fa-login', ['admin'])->plainTextToken,
            'user' => new \App\Http\Resources\AdminResource($admin->load('role')),
            'message' => 'ورود موفقیت‌آمیز بود.',
        ]);
    }
}
