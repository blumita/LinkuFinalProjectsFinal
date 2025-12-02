<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\v1\Controller;
use App\Http\Requests\v1\SupportRequest;
use App\Http\Resources\v1\SupportResource;
use App\Models\Support;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SupportController extends Controller
{

    public function show(): SupportResource
    {
        $support = Cache::remember('support.first', now()->addMinutes(10), function () {
            return Support::first();
        });
        return new SupportResource($support);
    }

    public function update(SupportRequest $request): SupportResource
    {
        $support = Support::first();
        if (!$support) {
            $support = Support::create($request->validated());
        } else {
            $support->update($request->validated());
        }

        Cache::forget('support.first');

        return new SupportResource($support);
    }

    /**
     * Send contact message to support
     */
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // TODO: Store message in database or send email notification
        // For now, just return success response

        return response()->json([
            'success' => true,
            'message' => 'پیام شما با موفقیت ارسال شد'
        ]);
    }
}
