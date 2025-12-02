<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CardMiddleware
{
    /** * Handle an incoming request.
     * * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $card = $request->route('card');

        if (!$card || $card->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to access this card.'], 403);
        }
        return $next($request);
    }
}
