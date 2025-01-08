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
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::authenticate($request->email, $request->password);

        if (!$user) {
            $Vendor = Vendor::vendor($request->email, $request->password);
            if ($Vendor) {
                $loginData = [
                    'id' => Crypt::encrypt($Vendor->id),
                    'first_login' => $Vendor->first_login,
                    'user_name' => $Vendor->name,
                    'user_type' => 'vendor',
                    "email" => base64_encode(app('encrypt')($Vendor->email)),
                    'loggedin_ttg' => 1,
                ];

                $token = JWTAuth::fromUser($Vendor, ['exp' => now()->addHour()->timestamp]);
                return response()->json([
                    'message' => 'Login successful',
                    'user' => $loginData,
                    'token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => auth()->guard('vendor')->factory()->getTTL() * 60
                ], 200);
            } else {
                return response()->json(['message' => 'Invalid credentials'], 400);
            }
        }
        $userAccount = User::getUserAccount($user);
        if ($userAccount) {
            User::updateAccountData($userAccount);

            $loginData = [
                'id' => Crypt::encrypt($userAccount->id),
                'email' => base64_encode(app('encrypt')($userAccount->email)),
                'username' => $userAccount->user_name,
                "userType" => $user->use_type == 2 ?"admin": "user",
                'role' => Crypt::encrypt($userAccount->role),
                'brand' => Crypt::encrypt($userAccount->brand),
                'emp_id' => Crypt::encrypt($userAccount->employees_id),
                'master_user' => Crypt::encrypt($userAccount->master_user_id),
                'loggedin' => 1,
            ];

            $token = JWTAuth::claims([
                'exp' => now()->addHour()->timestamp,
                'access_vendor'=> $user->use_type == 2 ? true : false,
                'piv' => 1250,
            ])->fromUser($user);
            return response()->json([
                'message' => 'Login successful',
                'user' => $loginData,
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->guard('api')->factory()->getTTL() * 60
            ], 200);
        } else {
            return response()->json(['message' => 'User account not found'], 404);
        }
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
        };
        try {
            $role = Crypt::decrypt($request->input('role'));
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return response()->json(['error' => 'Failed to decrypt role'], 400);
        }
        $permissionsWithScreens = [];
        $gro = [];
        $user = JWTAuth::parseToken()->authenticate();
        if ($user->use_type == 2) {
            $Permissions = DB::table('screen')
                ->whereIn('screen.use_system', ['VM', 'ERP,VM'])
                ->where('menu', 1)
                ->select('groups', 'name', 'url', 'menu')
                ->get();
            $groupedPermissions = $Permissions->groupBy('groups');

            foreach ($groupedPermissions as $key => $value) {
                foreach($value as $key2 => $value2){
                    $value2->type = "link";
                    unset($value2->groups);
                    unset($value2->menu);
                }
                $gro = [
                    'title' => Group::getGroup($key)->name,     
                    'type' => "sub",      
                    'active' => false,    
                    'children' => $value   
                ];

                $permissionsWithScreens[$key] = $gro;
            }
        } else {
            $Permissions = Permission::getGroupByRole($role);

            foreach ($Permissions as $permission) {
                $groups = [];
                $screens = Permission::getScreenByGroupAndRole($permission->groups, $role);
                foreach ($screens as $key) {

                    $screen = Screen::getScreen($key->screen);
                    $screen->type = 'link';
                    $groups[] = $screen;
                }
                $newData = [];
                if (count($groups) > 0) {
                    $group = Group::getGroup($permission->groups);
                    $newData = [
                        'title' => $group->name,
                        'type' => "sub",
                        'active' => false
                    ];

                    $screen = array_merge(['children' => $groups], $newData);
                    $permissionsWithScreens[$permission->groups] = $screen;
                }
            }
        }


        return response()->json([
            "Items" => $permissionsWithScreens], 200);
    }
    public function RegenrateToken(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($user) {
                $authChannel = 'api';

                $payload = JWTAuth::getPayload(JWTAuth::getToken());
                $expiresAt = Carbon::createFromTimestamp($payload['exp']);
                $remainingMinutes = $expiresAt->diffInMinutes(Carbon::now());

                if ($remainingMinutes > 5) {
                    return response()->json([
                        'message' => 'Token is still valid',
                        'token' => JWTAuth::getToken(),
                        'token_type' => 'bearer',
                        'expires_in' => $remainingMinutes * 60
                    ], 200);
                }

                $newToken = JWTAuth::fromUser($user, ['exp' => now()->addHour()->timestamp]);
                return response()->json([
                    'message' => 'Token regenerated successfully',
                    'token' => $newToken,
                    'token_type' => 'bearer',
                    'expires_in' => auth($authChannel)->factory()->getTTL() * 60
                ], 200);
            }
            $vendor = auth('vendor')->user();
            if ($vendor) {
                $authChannel = 'vendor';

                $payload = JWTAuth::getPayload(JWTAuth::getToken());
                $expiresAt = Carbon::createFromTimestamp($payload['exp']);
                $remainingMinutes = $expiresAt->diffInMinutes(Carbon::now());

                if ($remainingMinutes > 5) {
                    return response()->json([
                        'message' => 'Token is still valid',
                        'token' => JWTAuth::getToken(),
                        'token_type' => 'bearer',
                        'expires_in' => $remainingMinutes * 60
                    ], 200);
                }

                $newToken = JWTAuth::fromUser($vendor, ['exp' => now()->addHour()->timestamp]);
                return response()->json([
                    'message' => 'Token regenerated successfully',
                    'token' => $newToken,
                    'token_type' => 'bearer',
                    'expires_in' => auth($authChannel)->factory()->getTTL() * 60
                ], 200);
            }

            return response()->json(['message' => 'Unauthorized'], 401);
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token has expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Invalid token'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token not provided'], 400);
        }
    }
    public function routes(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        // $r = $this->getEmployeeHierarchy($user->id);
        if ($user->use_type == 2) {
            $allowedRoutes = DB::table('screen')
                ->whereIn('screen.use_system', ['VM', 'ERP,VM'])
                ->select(
                    'screen.url',
                    DB::raw('1 as `add`'),
                    DB::raw('1 as `edit`'),
                    DB::raw('1 as `delete`'),
                    DB::raw('1 as `view`')
                )
                ->get();
        } else {

            $validator = Validator::make($request->all(), [
                'role' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Invalid data provided',
                    'messages' => $validator->errors(),
                ], 401);
            };
            try {
                $role = Crypt::decrypt($request->input('role'));
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                return response()->json(['error' => 'Failed to decrypt role'], 400);
            }
            $allowedRoutes = DB::table('permission')
                ->join('screen', 'permission.screen', '=', 'screen.id')
                ->where('permission.role', $role)
                ->whereIn('screen.use_system', ['VM', 'ERP,VM'])
                ->select('screen.url', 'permission.add as add', 'permission.edit as edit', 'permission.delete as delete', 'permission.view as view')
                ->get();
        }

        return response()->json([
            'allowedRoutes' => $allowedRoutes,
        ], 200);
    }
    public function getEmployeeHierarchy($managerId)
    {
        // Fetch direct subordinates
        $subordinates = DB::table('employees')
        ->select('employees.id as id', 'employees.name', 'users.id as userid')
        ->leftJoin('users', 'users.employees_id', '=', 'employees.id')
        ->where('employees.manager', $managerId)
            // ->where('users.brand', $brand)
            ->get();
        // Initialize the result array
        $result = [];

        // Loop through direct subordinates
        foreach ($subordinates as $subordinate) {
            // Add the current subordinate to the result
            $result[] = [
                'id' => $subordinate->userid,
                'name' => $subordinate->name,
                // Recursive call for subordinates (if necessary)
                'subordinates' => $this->extractIdsAsString($subordinate->id),
            ];
        }

        return $subordinates;
    }

    public function extractIdsAsString($array, &$ids = [])
    {
        foreach ($array as $element) {
            if (isset($element['id'])) {
                $ids[] = $element['id'];
            }
            if (isset($element['subordinates']) && is_array($element['subordinates'])) {
                $this->extractIdsAsString($element['subordinates'], $ids);
            }
        }
        return implode(", ", $ids);
    }
}
