<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    /**
     * ذخیره Push Subscription کاربر
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

        $user = $request->user();

        $user->update([
            'push_subscription' => json_encode($validated['subscription']),
            'push_endpoint' => $validated['subscription']['endpoint'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Push subscription saved successfully'
        ]);
    }

    /**
     * حذف Push Subscription کاربر
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'push_subscription' => null,
            'push_endpoint' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Push subscription removed successfully'
        ]);
    }
}
