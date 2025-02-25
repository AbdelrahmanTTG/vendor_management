<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Employees;
use App\Models\BrandUsers;
use App\Models\AliasMail;
use App\Models\EmailJoinAlias;
use App\Models\Mailer;
use Illuminate\Support\Facades\DB;
use App\Events\Message;
use App\Events\Notice;
use Illuminate\Support\Facades\Crypt;



class AdminController extends Controller
{
    public function getDepartment()
    {
        $departments = Department::select('id', 'name')->get();
        return response()->json($departments);
    }
    public function getEmployees(Request $request)
    {
        $request->validate([
            'department_ids' => 'required|array',
            'department_ids.*' => 'integer|exists:department,id'
        ]);
        $employeeIds = Employees::whereIn('department', $request->department_ids)
            ->where('status', 0)
            ->select('id')
            ->pluck('id');
        $users = BrandUsers::whereIn('employees_id', $employeeIds)
            ->select('user_name as name', "email")
            ->get();
        return response()->json($users);
    }
    public function storeAlias(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('aliasmails')->where('email', $value)->exists() ||
                        DB::table('vendor')->where('email', $value)->exists() ||
                        DB::table('users')->where('email', $value)->exists();

                    if ($exists) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
            'brand_id' => 'required|integer|exists:brand,id',
            'users' => 'required|array',
            'status' => 'required|integer',

        ]);

        $userIds = $request->users;
        $aliasMail = AliasMail::create([
            'name' => $request->name,
            'email' => $request->email,
            'brand_id' => $request->brand_id,
            "status" => $request->status ?? 1
        ]);

        foreach ($userIds as $userId) {
            $email = BrandUsers::where('email', $userId["value"])->first();

            if ($email) {
                Mailer::create([
                    'alias_id' => $aliasMail->id,
                    'user_id' => $email->id,
                    'status' => 1
                ]);
            }
        }

        $aliasMail->load(['users' => function ($query) {
            $query->select('users.id', 'users.email');
        }]);
        $aliasMail->users->transform(function ($user) {
            $user->status = $user->pivot->status;
            unset($user->pivot);
            return $user;
        });

        return response()->json([
            'alias' => $aliasMail
        ], 201);
    }


    public function AliasMails(Request $request)
    {
        $perPage = 10;

        $query = AliasMail::with(['users' => function ($query) {
            $query->select('users.id', 'users.email');
        }]);

        if (!empty($request->queryParams)) {
            foreach ($request->queryParams as $key => $val) {
                if (!empty($val)) {
                    if ($key === 'users') {
                        $query->whereHas('users', function ($q) use ($val) {
                            $q->whereIn('email', $val);
                        });
                    } else {
                        $query->where(function ($q) use ($key, $val) {
                            foreach ($val as $v) {
                                $q->orWhere($key, $v);
                            }
                        });
                    }
                } else {
                    $query->where($key, $val);
                }
            }
        }

        $aliases = $query->paginate($perPage);
        $aliases->getCollection()->transform(function ($alias) {
            $alias->users->transform(function ($user) {
                $user->status = $user->pivot->status;
                unset($user->pivot);
                return $user;
            });
            return $alias;
        });

        return response()->json($aliases, 200);
    }

    public function updateAlias(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:aliasmails,id',
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    $exists = DB::table('aliasmails')
                        ->where('email', $value)
                        ->where('id', '!=', $request->id)
                        ->exists() ||
                        DB::table('vendor')->where('email', $value)->exists() ||
                        DB::table('users')->where('email', $value)->exists();

                    if ($exists) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
            // 'brand_id' => 'required|integer|exists:brand,id',
            'status' => 'required|integer',

        ]);

        $alias = AliasMail::findOrFail($request->id);

        $alias->update([
            'name' => $request->name,
            'email' => $request->email,
            // 'brand_id' => $request->brand_id,
            'status' => $request->status,

        ]);

        return response()->json([
            'alias' => $alias
        ], 200);
    }
    public function updateEmailJoinAlias(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:aliasmails,id',
            'users' => 'required|array',
        ]);

        $userIds = $request->users;
        $id = $request->id;

        $addedUsers = [];
        $existingUsers = [];

        foreach ($userIds as $userId) {
            $email = BrandUsers::where('email', $userId["value"])->first();

            if ($email) {
                $exists = Mailer::where('alias_id', $id)
                    ->where('user_id', $email->id)
                    ->exists();

                if (!$exists) {
                    $mailer = Mailer::create([
                        'alias_id' => $id,
                        'user_id' => $email->id,
                        'status' => 1,
                    ]);
                    $addedUsers[] = [
                        'id' => $email->id,
                        'email' => $email->email,
                        'status' => $mailer->status
                    ];
                } else {
                    $existingUsers[] = $email->email;
                }
            }
        }

        if (!empty($addedUsers)) {
            $message = 'Users have been added successfully.';
        } else {
            $message = 'No new users were added. All users were already linked.';
        }
        if (!empty($existingUsers)) {
            $message .= ' However, some users were already linked: ' . implode(', ', $existingUsers);
        }

        return response()->json([
            'message' => $message,
            'id' => $id,
            'added_users' => $addedUsers,
            'existing_users' => $existingUsers,
        ], 201);
    }
    public function destroy(Request $request)
    {
        if (!$request->has('id')) {
            return response()->json(['message' => 'ID is required.'], 400);
        }

        $id = $request->input('id');
        $modelInstance = AliasMail::find($id);

        if ($modelInstance) {
            $modelInstance->delete();
            return response()->json(['message' => 'Item has been successfully deleted.'], 200);
        } else {
            return response()->json(['message' => 'Item not found.'], 404);
        }
    }
    public function activeEmail(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:mailer,user_id',
            'alias_id' => 'required|integer|exists:mailer,alias_id',
            'status' => 'required|boolean'
        ]);

        $mailer = Mailer::where('user_id', $request->user_id)
            ->where('alias_id', $request->alias_id)
            ->first();

        if (!$mailer) {
            return response()->json([
                'message' => 'User is not linked to this alias.'
            ], 404);
        }

        $mailer->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'User status updated successfully.',
        ], 200);
    }
    public function destroyEmail(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:mailer,user_id',
            'alias_id' => 'required|integer|exists:mailer,alias_id',
        ]);
        $user_id = $request->input('user_id');
        $alias_id = $request->input('alias_id');
        $modelInstance = Mailer::where('user_id', $user_id)
            ->where('alias_id', $alias_id)
            ->first();
        if ($modelInstance) {
            $modelInstance->delete();
            return response()->json(['message' => 'Item has been successfully deleted.'], 200);
        } else {
            return response()->json(['message' => 'Item not found.'], 404);
        }
    }

    public function MailProvider (Request $request){
        $request->validate([
            'sender_email' => 'required|string|max:255',
            'receiver_email' => 'required|string|max:255',
            'content' => 'nullable|string',
            'screen' => 'required|string|max:255',
            'screen_id' => 'required|integer',
            'Permissions' => 'nullable|array',
        ]);
        $sender_email = app('decrypt')(base64_decode($request->input('sender_email')));
        $receiver_email =$request->input('receiver_email') ;
        $arrContent = [
            "content" => $request->input('content') ,
            "sender_email" => $sender_email,
            "screen" => $request->input('screen'),
            "screen_id" => $request->input('screen_id')
        ];
        event(new Notice($arrContent, base64_encode(app('encrypt')($receiver_email))));
        return response()->json(["message"=> 'Send successfully '], 200);
       }
    public function findAlias(Request $request)
    {
        $accountId = $request->input('account_id');
        if (!$accountId) {
            return response()->json(['error' => 'Account ID is required'], 400);
        }
        try {
            $accountId = Crypt::decrypt($accountId);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            $accountId = $accountId;
        }
        $aliases = AliasMail::whereHas('users', function ($query) use ($accountId) {
            $query->where('mailer.user_id', $accountId)
                ->where('mailer.status', 1)
                ->where('aliasmails.status', 1); 

        })->with('users:id,email')->pluck('email')
        ->map(function ($email) {
            return base64_encode(app('encrypt')($email));
        });


        return response()->json( $aliases, 200);
    }

}
