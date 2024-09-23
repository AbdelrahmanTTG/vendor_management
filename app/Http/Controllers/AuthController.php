<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        // Verify user
        $user = User::authenticate($request->email, $request->password);

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Get the account data associated with the user
        $userAccount = User::getUserAccount($user);

        if ($userAccount) {
            // Update account information
            User::updateAccountData($userAccount);

            // Set up login data with required fields encrypted
            $loginData = [
                'id' => Crypt::encrypt($userAccount->id),
                'username' => $userAccount->user_name,
                'role' => Crypt::encrypt($userAccount->role),
                'brand' => Crypt::encrypt($userAccount->brand),
                'emp_id' => Crypt::encrypt($userAccount->employees_id),
                'master_user' => Crypt::encrypt($userAccount->master_user_id),
                'loggedin' => 1,
            ];

            $token = JWTAuth::fromUser($user, ['exp' => now()->addHour()->timestamp]);

            // Return a JSON response with user data and token
            return response()->json([
                'message' => 'Login successful',
                'user' => $loginData,
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL()*60
            ], 200);
        } else {
            return response()->json(['message' => 'User account not found'], 404);
        }
        //
    }
    public function logout (){
     auth()->logout();
     return response()->json(["message"=>'logout Successfuly']);
      
    }
    public function user (){
     
      
    }
}
