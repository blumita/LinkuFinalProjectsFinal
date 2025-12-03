<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PushSubscriptionController extends Controller
{
    /**
     * ذخیره Push Subscription ادمین
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subscription' => 'required|array',
            'subscription.endpoint' => 'required|string',
            'subscription.keys' => 'required|array',
            'subscription.keys.p256dh' => 'required|string',
            'subscription.keys.auth' => 'required|string',
        ]);

        $admin = Auth::guard('admin')->user();
        
        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        $subscription = $validated['subscription'];

        // بررسی و به‌روزرسانی یا ایجاد subscription
        $pushSubscription = PushSubscription::updateOrCreate(
            [
                'admin_id' => $admin->id,
                'endpoint' => $subscription['endpoint']
            ],
            [
                'p256dh' => $subscription['keys']['p256dh'],
                'auth' => $subscription['keys']['auth'],
                'keys' => $subscription['keys'],
                'content_encoding' => $subscription['contentEncoding'] ?? 'aesgcm'
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Subscription با موفقیت ذخیره شد',
            'data' => $pushSubscription
        ], 201);
    }

    /**
     * دریافت لیست subscriptions ادمین فعلی
     */
    public function index(Request $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();
        
        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        $subscriptions = PushSubscription::where('admin_id', $admin->id)->get();

        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    /**
     * حذف Push Subscription ادمین
     */
    public function destroy(Request $request, $id = null): JsonResponse
    {
        $admin = Auth::guard('admin')->user();
        
        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        if ($id) {
            // حذف بر اساس ID
            $subscription = PushSubscription::where('admin_id', $admin->id)
                ->where('id', $id)
                ->first();

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription یافت نشد'
                ], 404);
            }

            $subscription->delete();
        } else {
            // حذف تمام subscriptions ادمین
            PushSubscription::where('admin_id', $admin->id)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Subscription با موفقیت حذف شد'
        ]);
    }

    /**
     * حذف subscription بر اساس endpoint
     */
    public function destroyByEndpoint(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'endpoint' => 'required|string'
        ]);

        $admin = Auth::guard('admin')->user();
        
        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        $deleted = PushSubscription::where('admin_id', $admin->id)
            ->where('endpoint', $validated['endpoint'])
            ->delete();

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Subscription با موفقیت حذف شد'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Subscription یافت نشد'
        ], 404);
    }
    
    /**
     * ذخیره Push Subscription کاربر عادی
     */
    public function storeUserSubscription(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subscription' => 'required|array',
            'subscription.endpoint' => 'required|string',
            'subscription.keys' => 'required|array',
            'subscription.keys.p256dh' => 'required|string',
            'subscription.keys.auth' => 'required|string',
        ]);

        $user = $request->user(); // استفاده از guard پیش‌فرض (web)
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        $subscription = $validated['subscription'];

        // بررسی و به‌روزرسانی یا ایجاد subscription
        $pushSubscription = PushSubscription::updateOrCreate(
            [
                'user_id' => $user->id,
                'endpoint' => $subscription['endpoint']
            ],
            [
                'p256dh' => $subscription['keys']['p256dh'],
                'auth' => $subscription['keys']['auth'],
                'keys' => $subscription['keys'],
                'content_encoding' => $subscription['contentEncoding'] ?? 'aesgcm',
                'admin_id' => null // مطمئن شویم admin_id null است
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Subscription با موفقیت ذخیره شد',
            'data' => $pushSubscription
        ], 201);
    }
    
    /**
     * حذف Push Subscription کاربر عادی
     */
    public function destroyUserSubscription(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        PushSubscription::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscription با موفقیت حذف شد'
        ]);
    }
    
    /**
     * ارسال نوتیفیکیشن تست به کاربر فعلی
     */
    public function sendTestNotification(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        try {
            // دریافت subscriptions کاربر
            $subscriptions = PushSubscription::where('user_id', $user->id)->get();
            
            if ($subscriptions->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'هیچ subscription فعالی برای این کاربر یافت نشد. لطفاً ابتدا دسترسی نوتیفیکیشن را بدهید.'
                ], 404);
            }

            // ارسال نوتیفیکیشن تست
            $sentCount = 0;
            $webPushService = app(\App\Services\WebPushService::class);
            
            foreach ($subscriptions as $sub) {
                $result = $webPushService->sendNotification(
                    $sub->toWebPushFormat(),
                    'نوتیفیکیشن تست 🎉',
                    'این یک پیام تست است! اگر این پیام را دیدید، یعنی پوش نوتیفیکیشن شما کار می‌کند.',
                    '/dashboard/notifications'
                );
                
                if ($result['success']) {
                    $sentCount++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "نوتیفیکیشن تست با موفقیت ارسال شد ({$sentCount} دستگاه)",
                'sent_count' => $sentCount,
                'total_subscriptions' => $subscriptions->count()
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to send test notification: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'خطا در ارسال نوتیفیکیشن: ' . $e->getMessage()
            ], 500);
        }
    }
}
