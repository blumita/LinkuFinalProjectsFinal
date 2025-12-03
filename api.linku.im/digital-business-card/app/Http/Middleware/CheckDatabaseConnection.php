<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class CheckDatabaseConnection
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // سعی می‌کنیم یک query ساده بزنیم
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            // اگه connection به database نداریم
            \Log::error('Database connection failed: ' . $e->getMessage());
            
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'خطا در ارتباط با دیتابیس. لطفا دوباره تلاش کنید.',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 503);
            }
            
            abort(503, 'Database connection failed');
        }
        
        return $next($request);
    }
}
