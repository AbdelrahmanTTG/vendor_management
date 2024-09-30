<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Vendor;
use App\Models\Permission;
use App\Models\Group;
use App\Models\Screen;
use Illuminate\Support\Facades\Validator;
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
            $user = Vendor::vendor($request->email, $request->password);
            if ($user) {
                $loginData = [
                    'id' => $user->id,
                    'first_login' => $user->first_login,
                    'user_name' => $user->name,
                    'user_type' => 'vendor',
                    'loggedin_ttg' => 1,
                ];
                $token = JWTAuth::fromUser($user, ['exp' => now()->addHour()->timestamp]);
                return response()->json([
                    'message' => 'Login successful',
                    'user' => $loginData,
                    'token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => auth('api')->factory()->getTTL() * 60
                ], 200);
            }else{
                return response()->json(['message' => 'Invalid credentials'], 400);
            }
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
                'expires_in' => auth('api')->factory()->getTTL() * 60
            ], 200);
        } else {
            return response()->json(['message' => 'User account not found'], 404);
        }
        //
    }
    public function logout()
    {
        auth()->logout();
        return response()->json(["message" => 'logout Successfuly']);

    }
    public function userpermission(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid data provided',
                'messages' => $validator->errors(),
            ], 422);
        }
        ;
        try {
            $role = Crypt::decrypt($request->input('role'));
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return response()->json(['error' => 'Failed to decrypt role'], 400);
        }
        $Permissions = Permission::getGroupByRole($role);
        $permissionsWithScreens = [];
        $groups = [];
        foreach ($Permissions as $permission) {
            $screens = Permission::getScreenByGroupAndRole($permission->groups, $role);
            foreach ($screens as $key) {

                $screen = Screen::getScreen($key->screen);
                $screen->type = 'link';  
                $groups[] = $screen;
            }
            $group = Group::getGroup($permission->groups);
            $newData = [
                'title' => $group->name,
                'type' => "sub",
                'active' => false
            ];
            $screen = array_merge(['children' => $groups], $newData);
            $permissionsWithScreens[$permission->groups] = $screen;
        }

        return response()->json(["Items"=>$permissionsWithScreens], 200);


    }
}
