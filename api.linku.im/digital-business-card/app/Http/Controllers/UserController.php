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
        // گرفتن همه پروفایل‌ها با eager loading برای بهینه‌سازی
        // حداکثر 1000 تا برای جلوگیری از timeout
        $profiles = User::with(['cards'])->limit(1000)->get();

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
        $user->subscription_end_date = now()->addMonths($months);

        $user->save();

        return $this->ok('اشتراک با موفقیت ارتقا یافت', [
            'user' => new UserResource($user),
            'is_pro' => true,
            'months' => $months,
            'subscription_end_date' => $user->subscription_end_date->format('Y-m-d')
        ]);
    }

}
