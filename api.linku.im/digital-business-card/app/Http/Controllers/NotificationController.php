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


        $notifications = $user->notifications->map(function ($n) {
            $type = $n->data['type'] ?? 'general';
            $title = $n->data['title'] ?? '';
            $message = $n->data['message'] ?? '';
            $time=$n->data['time']??'';

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
                'time'=>$time,
                'created_at' => $n->created_at,
            ];
        });

        return response()->json([
            'notifications' => $notifications
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
    public function sendNotification(Request $request, WebPushService $webPushService): JsonResponse
    {
        $validated = $request->validate([
            'recipients' => 'required|string|in:all,premium,free,specific',
            'userIds' => 'array',
            'userIds.*' => 'integer|exists:users,id',
            'type' => 'required|string|in:system,subscription,payment,security,general',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'actionLink' => 'nullable|string|max:500',
            'scheduledFor' => 'nullable|date|after:now', // برای زمان‌بندی
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
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification scheduled successfully',
                'scheduledFor' => $validated['scheduledFor'],
                'recipientCount' => $users->count(),
            ]);
        }

        // جمع‌آوری Push Subscriptions
        $pushSubscriptions = [];
        
        // ارسال فوری
        foreach ($users as $user) {
            // ارسال نوتیفیکیشن Database
            $user->notify(new \App\Notifications\AdminPushNotification(
                $validated['type'],
                $validated['title'],
                $validated['message'],
                $validated['actionLink'] ?? null
            ));
            $sentCount++;

            // اضافه کردن Push Subscription اگه داره
            if ($user->push_subscription) {
                $pushSubscriptions[] = $user->push_subscription;
            }
        }

        // ارسال Push واقعی به گوشی‌ها
        if (!empty($pushSubscriptions)) {
            $pushResult = $webPushService->sendBulkNotifications(
                $pushSubscriptions,
                $validated['title'],
                $validated['message'],
                $validated['actionLink'] ?? null
            );
            $pushSentCount = $pushResult['sent'];
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
}
