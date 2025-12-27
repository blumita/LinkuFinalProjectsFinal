<?php

namespace App\Http\Controllers\v1;

use App\Enums\UserActivityNotificationType;
use App\Exceptions\CustomException;
use App\Http\Requests\v1\OtpCodeRequest;
use App\Http\Requests\v1\VerifyOtpCodeRequest;
use App\Http\Requests\v1\EmailOtpCodeRequest;
use App\Http\Requests\v1\VerifyEmailOtpCodeRequest;
use App\Mail\LoginSecurityNotification;
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
use Illuminate\Support\Facades\Mail;

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

        // تصمیم‌گیری قبل از verify: آیا کاربر جدید بدون پروفایل است؟
        // فقط name کافی است (family اختیاری است)
        $isNewUserWithoutProfile = !$existingUser && (empty($validatedData['name']) || trim($validatedData['name']) === '');

        // اگر کاربر جدید است و نام ارسال نشده، فرم ثبت‌نام نمایش داده شود
        // این چک را قبل از verify انجام می‌دهیم تا OTP حذف نشود
        if ($isNewUserWithoutProfile) {
            // فقط OTP را verify کن بدون حذف
            if (!$this->otpService->verifyOtp($validatedData, false)) {
                throw new CustomException(__('sms.sms_expired'), 429);
            }

            return $this->fail(
                'لطفاً نام و نام خانوادگی خود را وارد کنید.',
                null,
                422,
                'profile_required'
            );
        }

        // حالا می‌توانیم OTP را verify و حذف کنیم (کاربر موجود یا کاربر جدید با name)
        if (!$this->otpService->verifyOtp($validatedData, true)) {
            throw new CustomException(__('sms.sms_expired'), 429);
        }

        if (($validatedData['type'] ?? null) === 'authenticate') {
            return $this->ok('success', '', 200);
        }

        if (($validatedData['type'] ?? null) === 'admin_authenticate') {
            return $this->adminLogin($validatedData);
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

        // Normalize شماره قبل از ذخیره
        $normalizedPhone = $this->otpService->normalizePhone($validatedData['phone']);

        $exists = User::where('phone', $normalizedPhone)
            ->where('id', '!=', $user->id)
            ->exists();

        if ($exists) {
            throw new CustomException(__('sms.phone_already_taken'), 409);
        }

        $user->phone = $normalizedPhone;

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

        // Send security notification email if user has email
        if (!empty($user->email)) {
            $this->sendLoginSecurityEmail($user, $request);
        }

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
                'user_name' => $username,
                'email' => null, // ایمیل بعداً توسط کاربر تکمیل میشه
                'phone' => $phone,
                'country_code' => $countryCode['code'] ?? null,
                'password' => Hash::make('default_password'),
                'referral_code' => $referralCode, // کد معرف (اگر ارسال شده)
            ]);

            $user->notify(new UserActivityNotification(UserActivityNotificationType::FIRST_LOGIN));

            return ['user' => $user, 'isNew' => true];
        }

        // Check if user has an active subscription and update pro status
        // بررسی از روی subscription_end_date و orders
        $hasActiveSubscription = false;

        // چک کردن subscription_end_date
        if ($user->subscription_end_date && $user->subscription_end_date >= now()->toDateString()) {
            $hasActiveSubscription = true;
        }

        // چک کردن orders فعال
        if (!$hasActiveSubscription) {
            $activeOrder = Order::where('user_id', $user->id)
                ->where('status', 'paid')
                ->where('end_date', '>', now())
                ->first();

            if ($activeOrder) {
                $hasActiveSubscription = true;
            }
        }

        // بروزرسانی is_pro بر اساس اشتراک
        if ($hasActiveSubscription && !$user->is_pro) {
            $user->is_pro = true;
            $user->save();
        } elseif (!$hasActiveSubscription && $user->is_pro) {
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

        // Debug: Log incoming data
        \Log::info('verifyEmailOtp called', [
            'email' => $email,
            'has_name' => isset($validatedData['name']),
            'name_value' => $validatedData['name'] ?? 'NOT_SET',
            'has_family' => isset($validatedData['family']),
            'family_value' => $validatedData['family'] ?? 'NOT_SET',
            'has_phone' => isset($validatedData['phone']),
            'phone_value' => $validatedData['phone'] ?? 'NOT_SET',
        ]);

        // بررسی کنیم کاربر جدید است و اطلاعات پروفایل ندارد
        $existingUser = User::where('email', $email)->first();
        // فقط نام الزامی است، شماره تلفن اختیاری است
        $isNewUserWithoutProfile = !$existingUser && (empty($validatedData['name']) || trim($validatedData['name']) === '');

        // اگر کاربر جدید است و نام ارسال نشده، فرم ثبت‌نام نمایش داده شود
        // این چک را قبل از verify انجام می‌دهیم تا OTP حذف نشود
        if ($isNewUserWithoutProfile) {
            // فقط OTP را verify کن بدون حذف
            if (!$this->emailOtpService->verifyOtp($email, $validatedData['code'], false)) {
                throw new CustomException(__('sms.sms_expired'), 429);
            }

            return $this->fail(
                'لطفاً نام و نام خانوادگی خود را وارد کنید.',
                null,
                422,
                'profile_required'
            );
        }

        // حالا می‌توانیم OTP را verify و حذف کنیم (کاربر موجود یا کاربر جدید با name)
        if (!$this->emailOtpService->verifyOtp($email, $validatedData['code'], true)) {
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

        // لاگین یا ثبت‌نام معمولی - کاربر جدید با اطلاعات
        if (!$existingUser) {
            // بررسی شماره (ممنوعیت اسرائیل) - فقط اگر شماره ارسال شده باشد
            $phoneRaw = $validatedData['phone'] ?? null;
            $digits = null;

            if ($phoneRaw) {
                try {
                    // normalize کردن شماره به فرمت استاندارد 9XXXXXXXXX
                    $digits = $this->otpService->normalizePhone($phoneRaw);
                } catch (\Exception $e) {
                    // اگر شماره نامعتبر بود، null بذار
                    $digits = null;
                }
            }

            if ($digits && preg_match('/^(?:972)/', $digits)) {
                return $this->fail(
                    'شماره تلفن از کشور مجاز نیست.',
                    null,
                    422,
                    'invalid_phone_country'
                );
            }

            // بررسی اینکه شماره قبلاً استفاده نشده باشد (با normalized phone)
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

            // Send security notification email
            if (!empty($user->email)) {
                $this->sendLoginSecurityEmail($user, []);
            }

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

        // Send security notification email
        if (!empty($user->email)) {
            $this->sendLoginSecurityEmail($user, []);
        }

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
        $admin = Admin::where('email', $email)->first();

        if (!$admin) {
            throw new CustomException('ادمین با این ایمیل یافت نشد.', 404);
        }

        Auth::guard('admin')->login($admin);

        return response()->json([
            'token' => $admin->createToken('admin-email-otp-login', ['admin'])->plainTextToken,
            'user' => new \App\Http\Resources\AdminResource($admin->load('role')),
            'message' => 'ورود موفقیت‌آمیز بود.',
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

        // بررسی اینکه ادمین وجود داشته باشد
        $admin = Admin::where('email', $email)->first();

        if (!$admin) {
            return $this->fail('ادمین با این ایمیل یافت نشد.');
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

        // Check if user has an active subscription and update pro status
        // بررسی از روی subscription_end_date و orders
        $hasActiveSubscription = false;

        // چک کردن subscription_end_date
        if ($user->subscription_end_date && $user->subscription_end_date >= now()->toDateString()) {
            $hasActiveSubscription = true;
        }

        // چک کردن orders فعال
        if (!$hasActiveSubscription) {
            $activeOrder = Order::where('user_id', $user->id)
                ->where('status', 'paid')
                ->where('end_date', '>', now())
                ->first();

            if ($activeOrder) {
                $hasActiveSubscription = true;
            }
        }

        // بروزرسانی is_pro بر اساس اشتراک
        if ($hasActiveSubscription && !$user->is_pro) {
            $user->is_pro = true;
            $user->save();
        } elseif (!$hasActiveSubscription && $user->is_pro) {
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

    /**
     * Admin direct login with username/password (NO OTP)
     * این متد برای ورود مستقیم ادمین با نام کاربری یا ایمیل و رمز عبور است
     * بدون نیاز به کد OTP
     */
    public function adminDirectLogin(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string', // می‌تواند email یا user_name باشد
            'password' => 'required|string',
        ]);

        $username = strtolower(trim($request->username));

        // جستجو با ایمیل یا user_name
        $admin = Admin::where('email', $username)
            ->orWhere('user_name', $username)
            ->first();

        // تاخیر تصادفی برای جلوگیری از timing attacks (100-300ms)
        $delay = rand(100000, 300000);
        usleep($delay);

        if (!$admin) {
            // ثبت log تلاش ناموفق
            Log::warning('Failed admin login - user not found', [
                'username' => $username,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'نام کاربری یا رمز عبور اشتباه است.'
            ], 401);
        }

        // بررسی رمز عبور
        if (!Hash::check($request->password, $admin->password)) {
            // ثبت log تلاش ناموفق
            Log::warning('Failed admin login - wrong password', [
                'admin_id' => $admin->id,
                'username' => $username,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'نام کاربری یا رمز عبور اشتباه است.'
            ], 401);
        }

        // بررسی وضعیت اکانت
        if ($admin->status !== 'active') {
            Log::warning('Blocked admin login - account inactive', [
                'admin_id' => $admin->id,
                'status' => $admin->status,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حساب کاربری شما غیرفعال شده است.'
            ], 403);
        }

        // لاگین مستقیم بدون OTP
        Auth::guard('admin')->login($admin);

        // ثبت log ورود موفق
        Log::info('Successful admin login', [
            'admin_id' => $admin->id,
            'username' => $username,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'token' => $admin->createToken('admin-direct-login', ['admin'])->plainTextToken,
            'user' => new \App\Http\Resources\AdminResource($admin->load('role')),
            'message' => 'ورود موفقیت‌آمیز بود.',
        ]);
    }

    /**
     * Send OTP SMS to admin phone number
     */
    public function sendAdminPhoneOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'countryCode' => 'required|string',
        ]);

        $phone = $this->otpService->normalizePhone($request->phone);

        // بررسی اینکه کاربر ادمین باشد
        $admin = Admin::where('phone', $phone)->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'ادمینی با این شماره موبایل یافت نشد.'
            ], 404);
        }

        // ارسال کد OTP به شماره موبایل
        $result = $this->otpService->sendOtp([
            'phone' => $phone,
            'countryCode' => $request->countryCode,
        ]);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'ارسال پیامک با مشکل مواجه شد.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'کد تایید به شماره موبایل شما ارسال شد.'
        ]);
    }

    /**
     * Verify admin phone OTP code
     *
     * @throws CustomException
     */
    public function verifyAdminPhoneOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'countryCode' => 'required|string',
            'code' => 'required|string|size:4',
        ]);

        $phone = $this->otpService->normalizePhone($request->phone);

        // بررسی کد OTP
        if (!$this->otpService->verifyOtp([
            'phone' => $phone,
            'countryCode' => $request->countryCode,
            'code' => $request->code,
        ])) {
            throw new CustomException('کد وارد شده صحیح نیست یا منقضی شده است.', 429);
        }

        // پیدا کردن ادمین
        $admin = Admin::where('phone', $phone)->first();

        if (!$admin) {
            throw new CustomException('ادمین معتبر نیست.', 403);
        }

        Auth::guard('admin')->login($admin);

        return response()->json([
            'success' => true,
            'token' => $admin->createToken('admin-phone-otp-login', ['admin'])->plainTextToken,
            'user' => new \App\Http\Resources\AdminResource($admin->load('role')),
            'message' => 'ورود موفقیت‌آمیز بود.',
        ]);
    }

    /**
     * Send login security notification email
     */
    private function sendLoginSecurityEmail(User $user, array $request): void
    {
        try {
            $loginTime = now()->setTimezone('Asia/Tehran')->format('Y-m-d H:i:s');
            $ipAddress = request()->ip() ?? 'Unknown';

            // Get user agent and parse it for better display
            $userAgent = request()->userAgent() ?? 'Unknown';

            // Send email
            Mail::to($user->email)->send(
                new LoginSecurityNotification(
                    $user->name,
                    $loginTime,
                    $ipAddress,
                    $userAgent
                )
            );

            Log::info('Login security email sent', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $ipAddress,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send login security email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
