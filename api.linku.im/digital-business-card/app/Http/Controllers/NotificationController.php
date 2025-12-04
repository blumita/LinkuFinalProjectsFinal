<?php

namespace App\Http\Controllers;

use App\Enums\SubscriptionNotificationType;
use App\Enums\SystemNotificationType;
use App\Models\NotificationLog;
use App\Services\WebPushService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController
{
    //User notifications
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است',
                'notifications' => []
            ], 401);
        }

        // اضافه کردن pagination برای بهبود عملکرد
        $perPage = $request->input('per_page', 50); // پیش‌فرض 50 نوتیفیکیشن
        $page = $request->input('page', 1);
        
        // استفاده از paginate به جای get
        $notificationsPaginated = $user->notifications()
            ->orderByRaw("CASE WHEN JSON_EXTRACT(data, '$.is_pinned') = true THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        $notifications = $notificationsPaginated->map(function ($n) {
            $type = $n->data['type'] ?? 'general';
            $title = $n->data['title'] ?? '';
            $message = $n->data['message'] ?? '';
            $time = $n->data['time'] ?? '';
            $isPinned = $n->data['is_pinned'] ?? false;

            // بررسی نوع Enum
            if (in_array($type, SubscriptionNotificationType::casesEnumValues())) {
                $typeEnum = 'subscription';
            } elseif (in_array($type, SystemNotificationType::casesEnumValues())) {
                $typeEnum = 'system';
            } else {
                $typeEnum = 'general';
            }

            return [
                'id' => $n->id,
                'type' => $typeEnum,
                'raw_type' => $type,
                'title' => $title,
                'message' => $message,
                'read_at' => $n->read_at,
                'time' => $time,
                'created_at' => $n->created_at,
                'is_pinned' => $isPinned,
            ];
        });

        return response()->json([
            'notifications' => $notifications,
            'pagination' => [
                'total' => $notificationsPaginated->total(),
                'per_page' => $notificationsPaginated->perPage(),
                'current_page' => $notificationsPaginated->currentPage(),
                'last_page' => $notificationsPaginated->lastPage(),
                'has_more' => $notificationsPaginated->hasMorePages(),
            ]
        ]);
    }

    public function read(Request $request ,$id): JsonResponse
    {
        $user = $request->user();

        $notification = $user->notifications()->where('id', $id)->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read', 'id' => $id]);
    }

    public function readAll(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }


    //Admin notifications
    public function adminNotifications(Request $request): JsonResponse
    {
        $managerTypes = ['profile', 'violation', 'system'];

        $notifications = DatabaseNotification::query()
            ->whereIn('data->type', $managerTypes)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($n) {
                $type = $n->data['type'] ?? 'general';
                $title = $n->data['title'] ?? '';
                $message = $n->data['message'] ?? '';
                $time = $n->data['time'] ?? '';

                return [
                    'id' => $n->id,
                    'type' => $type,
                    'title' => $title,
                    'message' => $message,
                    'read_at' => $n->read_at,
                    'time' => $time,
                    'created_at' => $n->created_at,
                    'user_id' => $n->notifiable_id,
                ];
            });

        return response()->json([
            'notifications' => $notifications
        ]);
    }

    //Send Push Notification from Admin
    public function sendNotification(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'recipients' => 'required|string|in:all,premium,free,specific',
            'userIds' => 'array',
            'userIds.*' => 'integer|exists:users,id',
            'type' => 'required|string|in:system,subscription,payment,security,general',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'actionLink' => 'nullable|string|max:500',
            'scheduledFor' => 'nullable|date|after:now',
            'isPinned' => 'nullable|boolean',
            'imageUrl' => 'nullable|string|max:500',
            'iconUrl' => 'nullable|string|max:500',
            'backgroundColor' => 'nullable|string|max:20',
        ]);

        $users = collect();

        // انتخاب کاربران بر اساس نوع مخاطب
        switch ($validated['recipients']) {
            case 'all':
                $users = \App\Models\User::where('status', 'active')->get();
                break;

            case 'premium':
                $users = \App\Models\User::where('status', 'active')
                    ->whereHas('activeSubscription')
                    ->get();
                break;

            case 'free':
                $users = \App\Models\User::where('status', 'active')
                    ->whereDoesntHave('activeSubscription')
                    ->get();
                break;

            case 'specific':
                if (!empty($validated['userIds'])) {
                    $users = \App\Models\User::whereIn('id', $validated['userIds'])
                        ->where('status', 'active')
                        ->get();
                }
                break;
        }

        $sentCount = 0;
        $pushSentCount = 0;

        // اگه زمان‌بندی شده باشه، فقط لاگ می‌کنیم و ارسال نمی‌کنیم
        if (!empty($validated['scheduledFor'])) {
            $log = NotificationLog::create([
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['recipients'],
                'action_link' => $validated['actionLink'] ?? null,
                'recipient_ids' => $validated['recipients'] === 'specific' ? $validated['userIds'] : null,
                'sent_count' => 0,
                'scheduled_for' => $validated['scheduledFor'],
                'is_sent' => false,
                'is_pinned' => $validated['isPinned'] ?? false,
                'image_url' => $validated['imageUrl'] ?? null,
                'icon_url' => $validated['iconUrl'] ?? null,
                'background_color' => $validated['backgroundColor'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification scheduled successfully',
                'scheduledFor' => $validated['scheduledFor'],
                'recipientCount' => $users->count(),
            ]);
        }

        // جمع‌آوری Push Subscriptions از جدول push_subscriptions
        $pushSubscriptions = [];
        
        // ارسال فوری
        foreach ($users as $user) {
            // ارسال نوتیفیکیشن Database
            $user->notify(new \App\Notifications\AdminPushNotification(
                $validated['type'],
                $validated['title'],
                $validated['message'],
                $validated['actionLink'] ?? null,
                $validated['isPinned'] ?? false,
                $validated['imageUrl'] ?? null,
                $validated['iconUrl'] ?? null,
                $validated['backgroundColor'] ?? null
            ));
            $sentCount++;

            // اضافه کردن Push Subscriptions از جدول push_subscriptions (کاربران عادی)
            $userPushSubscriptions = \App\Models\PushSubscription::where('user_id', $user->id)->get();
            foreach ($userPushSubscriptions as $sub) {
                $pushSubscriptions[] = $sub->toWebPushFormat();
            }
        }

        // ارسال Push واقعی به گوشی‌ها
        if (!empty($pushSubscriptions)) {
            try {
                if (class_exists(\Minishlink\WebPush\WebPush::class)) {
                    $webPushService = app(\App\Services\WebPushService::class);
                    $pushResult = $webPushService->sendBulkNotifications(
                        $pushSubscriptions,
                        $validated['title'],
                        $validated['message'],
                        $validated['actionLink'] ?? null
                    );
                    $pushSentCount = $pushResult['sent'];
                } else {
                    \Log::info('WebPush package not installed. Skipping push notifications.');
                }
            } catch (\Exception $e) {
                \Log::warning('Failed to send push notifications: ' . $e->getMessage());
            }
        }

        // ثبت در لاگ
        NotificationLog::create([
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['recipients'],
            'action_link' => $validated['actionLink'] ?? null,
            'recipient_ids' => $validated['recipients'] === 'specific' ? $validated['userIds'] : null,
            'sent_count' => $sentCount,
            'delivered_count' => $pushSentCount,
            'is_sent' => true,
            'is_pinned' => $validated['isPinned'] ?? false,
            'image_url' => $validated['imageUrl'] ?? null,
            'icon_url' => $validated['iconUrl'] ?? null,
            'background_color' => $validated['backgroundColor'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notifications sent successfully',
            'sentCount' => $sentCount,
            'pushSentCount' => $pushSentCount,
            'inAppOnly' => $sentCount - $pushSentCount
        ]);
    }

    // دریافت تاریخچه نوتیفیکیشن‌ها
    public function notificationHistory(Request $request): JsonResponse
    {
        $type = $request->query('type'); // all, premium, free, specific

        $query = NotificationLog::orderBy('created_at', 'desc');

        if ($type && $type !== 'all') {
            $query->where('type', $type);
        }

        $notifications = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications->items(),
            'pagination' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ]
        ]);
    }

    // دریافت نوتیفیکیشن‌های زمان‌بندی شده
    public function scheduledNotifications(Request $request): JsonResponse
    {
        $notifications = NotificationLog::scheduled()
            ->orderBy('scheduled_for', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    // حذف یک نوتیفیکیشن از تاریخچه
    public function deleteNotificationHistory(Request $request, $id): JsonResponse
    {
        $notification = NotificationLog::find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully'
        ]);
    }

    // ویرایش یک نوتیفیکیشن از تاریخچه
    public function updateNotificationHistory(Request $request, $id): JsonResponse
    {
        $notification = NotificationLog::find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'message' => 'sometimes|string|max:1000',
            'action_link' => 'nullable|string|max:500',
            'is_pinned' => 'sometimes|boolean',
            'image_url' => 'nullable|string|max:500',
            'icon_url' => 'nullable|string|max:500',
            'background_color' => 'nullable|string|max:20',
        ]);

        $notification->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Notification updated successfully',
            'data' => $notification
        ]);
    }
}
