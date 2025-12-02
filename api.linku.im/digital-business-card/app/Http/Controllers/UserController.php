<?php

namespace App\Http\Controllers;

use App\Http\Resources\v1\ProfileResource;
use App\Http\Resources\v1\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\HasApiResponses;
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

        $admins = User::where('role', 'admin')->get();

        return $this->ok('', UserResource::collection($admins));

    }

    /**
     * Get current admin user profile
     */
    public function adminMe(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return $this->fail('کاربر یافت نشد.', 401);
        }

        if ($user->role !== 'admin') {
            return $this->fail('شما دسترسی ادمین ندارید.', 403);
        }

        return $this->ok('', new UserResource($user));
    }

    public function profiles(Request $request): JsonResponse
    {

        $profiles = User::all();

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
            'username' => 'required|string|max:255|unique:users,user_name,' . $id,
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'required|string|unique:users,phone,' . $id,
            'countryCode' => 'nullable|string|size:3',
            'status' => 'required|in:active,inactive',
            'password' => 'nullable|string|min:8',
        ]);

        $admin = User::findOrFail($id);
        $updateData = [
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'full_name' => $validated['fullName'],
            'user_name' => $validated['username'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'country_code' => $validated['countryCode'],
            'status' => $validated['status'],
        ];

        if (isset($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        $admin->update($updateData);

        return response()->json([
            'message' => 'Admin updated successfully',
            'data' => new UserResource($admin)
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

        $userId = $request->user()->id ?? null;

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
            'status' => 'required|in:active,inactive'
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
            $user->save();
        }
    }
    public function userList(): JsonResponse
    {
        $users=User::all();

        return $this->ok('',UserResource::collection($users));
    }

}
