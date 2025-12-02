<?php

namespace App\Http\Controllers;

use App\Http\Controllers\v1\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $raw = Setting::pluck('value', 'key')->toArray();

        $settings = [
            ...$raw,
            'emailNotifications' => filter_var($raw['emailNotifications'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'smsNotifications' => filter_var($raw['smsNotifications'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'paymentTestMode' => filter_var($raw['paymentTestMode'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'decimalPlaces' => isset($raw['decimalPlaces']) ? (int) $raw['decimalPlaces'] : 0,
            // SMS Settings from ENV
            'smsProvider' => env('OTP_SMS_DRIVER', 'modirpayamak'),
            'smsPatternCode' => env('SMS_PATTERN_CODE', ''),
            'smsApiKey' => env('SMS_API_KEY', ''),
            'smsSender' => env('SMS_SENDER', ''),
        ];

        return response()->json($settings);
    }

    public function store(Request $request): JsonResponse
    {
        foreach ($request->all() as $key => $value) {
            // Skip password fields - they are handled separately
            if (in_array($key, ['currentPassword', 'newPassword', 'confirmPassword'])) {
                continue;
            }
            Setting::set($key, $value);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    /**
     * Change admin password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'دسترسی غیرمجاز'], 403);
        }

        $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8',
            'confirmPassword' => 'required|string|same:newPassword',
        ], [
            'currentPassword.required' => 'رمز عبور فعلی الزامی است',
            'newPassword.required' => 'رمز عبور جدید الزامی است',
            'newPassword.min' => 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد',
            'confirmPassword.required' => 'تکرار رمز عبور الزامی است',
            'confirmPassword.same' => 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد',
        ]);

        // Check current password
        if (!Hash::check($request->currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['رمز عبور فعلی اشتباه است'],
            ]);
        }

        // Update password
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['message' => 'رمز عبور با موفقیت تغییر یافت']);
    }

    /**
     * Get SMS settings from ENV
     */
    public function getSmsSettings(): JsonResponse
    {
        return response()->json([
            'smsProvider' => env('OTP_SMS_DRIVER', 'modirpayamak'),
            'smsPatternCode' => env('SMS_PATTERN_CODE', ''),
            'smsApiKey' => env('SMS_API_KEY', ''),
            'smsSender' => env('SMS_SENDER', ''),
        ]);
    }

    /**
     * Update SMS settings in ENV file
     */
    public function updateSmsSettings(Request $request): JsonResponse
    {
        $request->validate([
            'smsProvider' => 'nullable|string',
            'smsPatternCode' => 'nullable|string',
            'smsApiKey' => 'nullable|string',
            'smsSender' => 'nullable|string',
        ]);

        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        $updates = [
            'OTP_SMS_DRIVER' => $request->smsProvider ?? env('OTP_SMS_DRIVER'),
            'SMS_PATTERN_CODE' => $request->smsPatternCode ?? env('SMS_PATTERN_CODE'),
            'SMS_API_KEY' => $request->smsApiKey ?? env('SMS_API_KEY'),
            'SMS_SENDER' => $request->smsSender ?? env('SMS_SENDER'),
        ];

        foreach ($updates as $key => $value) {
            $pattern = "/^{$key}=.*/m";
            $replacement = "{$key}={$value}";
            
            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, $replacement, $envContent);
            } else {
                $envContent .= "\n{$replacement}";
            }
        }

        file_put_contents($envPath, $envContent);

        // Clear config cache
        \Artisan::call('config:clear');

        return response()->json(['message' => 'تنظیمات پیامک با موفقیت ذخیره شد']);
    }
}
