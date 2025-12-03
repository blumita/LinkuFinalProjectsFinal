<?php
namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        // Skip CORS handling if running via php artisan serve
        // Headers are already set in public/index.php
        if (php_sapi_name() === 'cli-server') {
            return $next($request);
        }
        
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
        
        // Check if origin is allowed
        $allowOrigin = in_array($origin, $allowedOrigins) 
            || preg_match('#^https?://.*\.(linku\.im|linkuapp\.com)$#', $origin)
            ? $origin 
            : 'https://dash.linku.im';

        // اگر preflight هست (OPTIONS)
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 204)
                ->header('Access-Control-Allow-Origin', $allowOrigin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        $response = $next($request);

        return $response
            ->header('Access-Control-Allow-Origin', $allowOrigin)
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}
