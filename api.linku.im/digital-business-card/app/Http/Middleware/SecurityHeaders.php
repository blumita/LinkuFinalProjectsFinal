<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Security Headers Middleware
 * 
 * این middleware هدرهای امنیتی را به تمام response ها اضافه می‌کند
 * برای محافظت در برابر حملات رایج وب
 */
class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // جلوگیری از Clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        
        // فعال‌سازی XSS Protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        
        // جلوگیری از MIME Sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        
        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Content Security Policy (محدود برای API)
        $response->headers->set('Content-Security-Policy', "default-src 'self'");
        
        // اجبار استفاده از HTTPS (در production)
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        
        // Permission Policy (غیرفعال کردن ویژگی‌های حساس)
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        
        // حذف هدر Server برای مخفی کردن اطلاعات سرور
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}
