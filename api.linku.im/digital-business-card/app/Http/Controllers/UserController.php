<?php

namespace App\Http\Controllers;

use App\Http\Resources\AdminResource;
use App\Http\Resources\v1\ProfileResource;
use App\Http\Resources\v1\UserResource;
use App\Models\Admin;
use App\Models\User;
use App\Services\UserService;
use App\Traits\HasApiResponses;
use Carbon\Carbon;
use Illuminate\Auth\Events\Logout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserController
{
    use HasApiResponses;

    //
    protected UserService $service;

    public function __construct(UserService $userService)
    {
        $this->service = $userService;
    }

    public function index(Request $request): UserResource
    {

        $user = $request->user();

        return new UserResource($user);

    }

    public function admins(Request $request): JsonResponse
    {
        $admins = Admin::with('role')->get();

        return $this->ok('', AdminResource::collection($admins));
    }

    /**
     * Get current admin user profile
     */
    public function adminMe(Request $request): JsonResponse
    {
        // Try to get the authenticated user via token
        $token = $request->bearerToken();

        if (!$token) {
            return $this->fail('توکن یافت نشد.', null, 401);
        }

        // Find the token and get its owner (tokenable)
        $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);

        if (!$personalAccessToken) {
            return $this->fail('توکن نامعتبر است.', null, 401);
        }

        $user = $personalAccessToken->tokenable;

        // Check if the tokenable is an Admin model
        if (!$user || !($user instanceof \App\Models\Admin)) {
            return $this->fail('ادمین یافت نشد.', null, 401);
        }

        return $this->ok('', new AdminResource($user->load('role')));
    }

    public function profiles(Request $request): JsonResponse
    {
        // گرفتن همه پروفایل‌ها با eager loading و count برای بهینه‌سازی
        // حداکثر 1000 تا برای جلوگیری از timeout
        $profiles = User::withCount('cards')->limit(1000)->get();

        return $this->ok('', ProfileResource::collection($profiles));
    }
    public function toggleStatus(Request $request,$id): JsonResponse
    {

        $profile = User::find($id);

        $profile->status=$request->input('status');

        $profile->save();

        return $this->ok('', new ProfileResource($profile),200);

    }

    public function adminsUpdate(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'fullName' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:admins,user_name,' . $id . ',id',
            'email' => 'required|email|unique:admins,email,' . $id . ',id',
            'phone' => 'required|string|unique:admins,phone,' . $id . ',id',
            'countryCode' => 'nullable|string|max:10',
            'status' => 'required|in:active,inactive',
            'password' => 'nullable|string|min:8',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $admin = Admin::findOrFail($id);
        $updateData = [
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'name' => $validated['fullName'],
            'user_name' => $validated['username'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'country_code' => $validated['countryCode'],
            'status' => $validated['status'],
        ];

        if (isset($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        if (isset($validated['role_id'])) {
            $updateData['role_id'] = $validated['role_id'];
        }

        $admin->update($updateData);
        $admin->load('role'); // بارگذاری relation

        return $this->ok('Admin updated successfully', new AdminResource($admin));
    }

    public function adminsCreate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'fullName' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:admins,user_name',
            'email' => 'required|email|unique:admins,email',
            'phone' => 'required|string|unique:admins,phone',
            'countryCode' => 'nullable|string|max:10',
            'status' => 'required|in:active,inactive',
            'password' => 'required|string|min:8',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $admin = $this->service->addAdmin($validated);
        $admin->load('role'); // Load role relationship

        return $this->ok('Admin created successfully', new AdminResource($admin));
    }

    public function adminsDelete($id): JsonResponse
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();

        return response()->json([
            'message' => 'Admin deleted successfully'
        ]);
    }

    public function removeRoleAdmin($id): void
    {

        $user = User::find($id);

        $user->role = 'user';

        $user->save();

    }

    public function update(Request $request): JsonResponse
    {


        $user = $request->user();
        if (!empty($request->input('email')))
            $user->email = $request->input('email');
        if (!empty($request->input('username')))
            $user->user_name = $request->input('username');
        if ($request->has('removeBranding')) {
            $user->remove_branding = $request->input('removeBranding');
        }
        $user->save();


        return $this->ok(__('messages.user.update.setting'), new UserResource($user));

    }

    public function checkUsername(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string|min:3|max:50'
        ]);

        $user = $request->user();
        $userId = $user ? $user->id : null;

        $exists = User::where('user_name', $request->username)
            ->when($userId, fn($q) => $q->where('id', '!=', $userId))
            ->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists ? 'نام کاربری در حال استفاده است' : 'نام کاربری قابل استفاده است'
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function setReferralCode(Request $request): JsonResponse
    {
        $user = $request->user();

        $rules = [
            'name' => 'required|string|max:255',
            'referred_code' => 'nullable|string|max:10',
        ];

        $data = $request->validate($rules);

        $this->service->assignReferralCode($user, $data);

        $this->service->createDefaultProfile($user);

        return $this->ok();

    }

    public function logout(Request $request): JsonResponse
    {
        try {
            // Get the authenticated user
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'message' => __('auth.unauthenticated')
                ], 401);
            }

            $guard = 'sanctum'; // یا web اگر session-based
            event(new Logout($guard, $user));

            // Revoke current access token
            //$user->currentAccessToken()->delete();

            return response()->json([
                'message' => __('auth.logout_success')
            ], 200);
        } catch (\Exception $e) {
            // Log unexpected errors
            Log::error('Error during logout: ' . $e->getMessage());

            return response()->json([
                'message' => __('errors.unexpected_error'),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف کامل حساب کاربری و تمام اطلاعات مرتبط
     */
    public function deleteAccount(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'کاربر یافت نشد.'
                ], 401);
            }

            $userId = $user->id;
            $userPhone = $user->phone;
            $userEmail = $user->email;

            Log::info('🗑️ Starting account deletion', ['user_id' => $userId, 'phone' => $userPhone]);

            // دریافت لیست کارت‌های کاربر
            $cardIds = DB::table('cards')->where('user_id', $userId)->pluck('id');

            if ($cardIds->isNotEmpty()) {
                // دریافت لیست لینک‌های کارت
                $cardLinkIds = DB::table('card_links')->whereIn('card_id', $cardIds)->pluck('id');

                if ($cardLinkIds->isNotEmpty()) {
                    // حذف نتایج بازی‌ها (مرتبط با card_link_id)
                    DB::table('lucky_wheel_results')->whereIn('card_link_id', $cardLinkIds)->delete();
                    DB::table('lucky_dice_results')->whereIn('card_link_id', $cardLinkIds)->delete();
                    DB::table('lucky_egg_results')->whereIn('card_link_id', $cardLinkIds)->delete();

                    // حذف فرم‌ها (مرتبط با card_link_id)
                    DB::table('forms')->whereIn('card_link_id', $cardLinkIds)->delete();
                }

                // حذف اطلاعات مرتبط با کارت‌ها (فقط جداولی که card_id دارن)
                DB::table('card_links')->whereIn('card_id', $cardIds)->delete();
                DB::table('card_qrs')->whereIn('card_id', $cardIds)->delete();
                DB::table('card_settings')->whereIn('card_id', $cardIds)->delete();
                DB::table('card_leads')->whereIn('card_id', $cardIds)->delete();
                DB::table('card_users')->whereIn('card_id', $cardIds)->delete();

                // حذف views مرتبط با کارت‌ها
                DB::table('views')
                    ->where('viewable_type', 'App\\Models\\Card')
                    ->whereIn('viewable_id', $cardIds)
                    ->delete();

                // حذف خود کارت‌ها
                DB::table('cards')->where('user_id', $userId)->delete();

                Log::info('✅ Deleted cards and related data', ['card_count' => $cardIds->count()]);
            }

            // حذف تراکنش‌ها
            DB::table('transactions')->where('user_id', $userId)->delete();

            // حذف سفارشات
            DB::table('orders')->where('user_id', $userId)->delete();

            // حذف فایل‌ها (polymorphic relation)
            DB::table('files')
                ->where('fileable_type', 'App\\Models\\User')
                ->where('fileable_id', $userId)
                ->delete();

            // حذف نوتیفیکیشن‌ها (polymorphic relation)
            DB::table('notifications')
                ->where('notifiable_type', 'App\\Models\\User')
                ->where('notifiable_id', $userId)
                ->delete();

            // حذف supports (با phone/email)
            if ($userPhone) {
                DB::table('supports')->where('phone', $userPhone)->delete();
            }
            if ($userEmail) {
                DB::table('supports')->where('email', $userEmail)->delete();
            }

            // حذف OTP codes
            if ($userPhone) {
                DB::table('otp_codes')->where('phone', $userPhone)->delete();
            }
            if ($userEmail) {
                DB::table('email_otp_codes')->where('email', $userEmail)->delete();
            }

            // حذف push subscriptions
            DB::table('push_subscriptions')->where('user_id', $userId)->delete();

            // حذف views مرتبط با یوزر
            DB::table('views')
                ->where('viewable_type', 'App\\Models\\User')
                ->where('viewable_id', $userId)
                ->delete();

            // حذف کاربر
            DB::table('users')->where('id', $userId)->delete();

            Log::info('✅ Account deleted successfully', ['user_id' => $userId]);

            return response()->json([
                'success' => true,
                'message' => 'حساب کاربری شما با موفقیت حذف شد.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error deleting account', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'خطا در حذف حساب کاربری. لطفاً دوباره تلاش کنید.'
            ], 500);
        }
    }

    public function premiumMembersCount(): JsonResponse
    {
        $count = User::where('is_pro', true)->count();

        return response()->json([
            'count' => $count
        ]);
    }

    public function createAdmin(Request $request): void
    {
        $baseRules = [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'fullName' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,user_name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'countryCode' => 'nullable|string|size:3',
            'status' => 'required|in:active,inactive',
            'role_id' => 'nullable|exists:roles,id'
        ];

        $user = User::where('phone', $request->input('phone'))->first();

        if (!$user) {

            $validated = $request->validate(array_merge($baseRules, [
                'phone' => 'required|string|unique:users,phone',
            ]));

            $this->service->addAdmin($validated);
        } else {

            $validated = $request->validate(array_merge($baseRules, [
                'phone' => 'required|string',
            ]));

            $user->role = 'admin';
            if (isset($validated['role_id'])) {
                $user->role_id = $validated['role_id'];
            }
            $user->save();
        }
    }
    public function userList(): JsonResponse
    {
        $users=User::all();

        return $this->ok('',UserResource::collection($users));
    }

    public function upgradeSubscription(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'months' => 'required|integer|min:1|max:24'
        ]);

        $user = User::findOrFail($validated['userId']);
        $months = $validated['months'];

        // Set user to premium with subscription details
        $user->is_pro = true;
        $user->subscription_type = 'premium';
        $user->subscription_months = $months;

        // Calculate subscription end date from now
        $startDate = now();
        $endDate = now()->addMonths($months);
        $user->subscription_end_date = $endDate;

        $user->save();

        // ایجاد یک order برای این اشتراک (برای ثبت در سیستم و جلوگیری از expire شدن توسط cron)
        \App\Models\Order::create([
            'user_id' => $user->id,
            'plan_id' => 1, // فرض میکنیم plan_id=1 برای manual upgrade
            'title' => "اشتراک {$months} ماهه - فعال‌سازی دستی توسط ادمین",
            'amount' => 0, // رایگان چون ادمین فعال کرده
            'status' => 'paid',
            'start_date' => $startDate,
            'end_date' => $endDate,
            'currency' => 'IRR',
            'description' => 'فعال‌سازی دستی اشتراک توسط مدیر سیستم'
        ]);

        return $this->ok('اشتراک با موفقیت ارتقا یافت', [
            'user' => new UserResource($user),
            'is_pro' => true,
            'months' => $months,
            'subscription_end_date' => $user->subscription_end_date->format('Y-m-d')
        ]);
    }

}
