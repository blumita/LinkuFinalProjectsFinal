<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
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

        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'شما به این بخش دسترسی ندارید'
        ], 403);
    }
}
