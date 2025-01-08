<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $payload = JWTAuth::getPayload(JWTAuth::getToken());
        if (Auth::guard('vendor')->check() || $payload["access_vendor"]) {
            return $next($request);
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
