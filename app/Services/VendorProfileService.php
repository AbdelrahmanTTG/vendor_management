<?php

namespace App\Services;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\DB;

class VendorProfileService
{
    public function format($request)
    {

        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is invalid or expired'], 401);
        }
        $tableName = $request->input('table');
        $formats = DB::table('formatsTable')
            ->where('user_id', $userId)
            ->where('table', $tableName)
            ->get();
        return $formats;
    }
}
