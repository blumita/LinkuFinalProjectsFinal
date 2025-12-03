<?php

use App\Console\Commands\CheckSubscriptions;
use App\Console\Commands\ClearOldVerifications;
use App\Http\Middleware\CardMiddleware;
use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\FileManagerMiddleware;
use App\Http\Middleware\LogUserActivity;
use App\Providers\ConfigOverrideServiceProvider;
use App\Providers\EventServiceProvider;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )->withProviders([
        //
        RouteServiceProvider::class,
        EventServiceProvider::class,
        ConfigOverrideServiceProvider::class
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        //
        $middleware->alias([
            'card.owner' => CardMiddleware::class,
            'model.owner' => FileManagerMiddleware::class,
            'log.activity'=> LogUserActivity::class
        ]);
        
        // CORS is handled in public/index.php for local development
        // Do NOT add CORS middleware here to avoid duplicate headers
        
        // For API routes, return JSON 401 instead of redirecting to login
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return null; // Will be handled by exception handler
            }
            return '/login';
        });

    })
    ///Exception
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle unauthenticated requests for API with CORS headers
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                // Skip CORS headers if running via php artisan serve
                // Headers are already set in public/index.php
                $headers = [];
                
                if (php_sapi_name() !== 'cli-server') {
                    $origin = $request->header('Origin');
                    $allowedOrigins = [
                        'https://dash.linku.im',
                        'https://linku.im',
                        'https://www.linku.im',
                        'https://dash.linkuapp.com',
                        'https://linkuapp.com',
                        'https://www.linkuapp.com',
                        'http://localhost:3000',
                        'http://localhost:3001',
                        'http://localhost:5779',
                        'http://127.0.0.1:3000',
                        'http://127.0.0.1:3001',
                        'http://127.0.0.1:5779',
                    ];
                    
                    $headers = [
                        'Access-Control-Allow-Credentials' => 'true',
                        'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
                    ];
                    
                    // Check if origin matches allowed origins or pattern
                    if (in_array($origin, $allowedOrigins) || preg_match('#^https?://.*\.(linku\.im|linkuapp\.com)$#', $origin)) {
                        $headers['Access-Control-Allow-Origin'] = $origin;
                    }
                }
                
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please login first.',
                    'code' => 'unauthenticated'
                ], 401, $headers);
            }
        });
        
        // Handle all other exceptions for API requests
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                // Log the error
                \Log::error('API Error: ' . $e->getMessage(), [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'ip' => $request->ip(),
                ]);
                
                // Return JSON response
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                $message = config('app.debug') ? $e->getMessage() : 'خطایی در سرور رخ داده است';
                
                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'error' => config('app.debug') ? [
                        'exception' => get_class($e),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                    ] : null,
                ], $statusCode);
            }
        });
    })
    ->withCommands([
        ClearOldVerifications::class,
        CheckSubscriptions::class
    ])
    ->withSchedule(function (Schedule $schedule) {
        // اجرای روزانه ساعت 9 صبح
        $schedule->command('subscriptions:check')
            ->dailyAt('09:00')
            ->timezone('Asia/Tehran');;

        // هر شب ساعت 12 پاکسازی
        $schedule->command('clear:old-verifications')
            ->dailyAt('00:00')
            ->timezone('Asia/Tehran');;
    })->create();
