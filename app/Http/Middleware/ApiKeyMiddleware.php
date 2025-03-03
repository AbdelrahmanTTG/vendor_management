<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\ApiUser;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-KEY');

        if (Auth::guard('vendor')->check() || Auth::guard('api')->check()) {
            return $next($request);
        }else if ($apiKey){
            $apiUser = ApiUser::where('api_key', $apiKey)->first();
            if (!$apiUser || !$apiUser->isValid()) {
                return response()->json(['message' => 'Invalid or expired API Key'], 403);
            }

            return $next($request);
        }else{
                return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
