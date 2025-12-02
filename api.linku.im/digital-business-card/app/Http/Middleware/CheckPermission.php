<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'لطفاً وارد شوید'
            ], 401);
        }

        if (!$user->role) {
            return response()->json([
                'success' => false,
                'message' => 'شما نقشی ندارید'
            ], 403);
        }

        // اگه ادمین باشه، تمام دسترسی‌ها رو داره
        if ($user->isAdmin()) {
            return $next($request);
        }

        // چک کردن مجوزها
        foreach ($permissions as $permission) {
            if ($user->hasPermission($permission)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'شما به این بخش دسترسی ندارید'
        ], 403);
    }
}
