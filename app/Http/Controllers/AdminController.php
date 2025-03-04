<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Employees;
use App\Models\BrandUsers;
use App\Models\AliasMail;
use App\Models\Notifications;
use App\Models\Mailer;
use Illuminate\Support\Facades\DB;
use App\Events\Message;
use App\Events\Notice;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Arr;
use App\Models\ApiUser;
use Illuminate\Support\Str;



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
        // $user = ApiUser::create([
        //     'name' => 'External User',
        //     'api_key' => Str::random(32),
        //     'expires_at' => now()->addMonths(12), // انتهاء الصلاحية بعد 3 أشهر
        // ]);
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

    public function MailProvider(Request $request)
    {
        $request->validate([
            'id' => 'required|string',
            'sender_email' => 'required|string|max:255',
            'receiver_email' => 'required|string|max:255',
            'content' => 'nullable|string',
            'screen' => 'required|string|max:255',
            'screen_id' => 'required|integer',
            'Permissions' => 'nullable|array',
        ]);
        $id = $request->input('id');
        if (!$id) {
            return response()->json(['error' => 'Account ID is required'], 400);
        }
        try {
            $id = Crypt::decrypt($id);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            $id = $id;
        }
        $sender_email = app('decrypt')(base64_decode($request->input('sender_email')));
        if (!$sender_email) {
            $sender_email = $request->input('sender_email');
        }
        $receiver_email = $request->input('receiver_email');
        $userEmail = BrandUsers::where('id', $id)->value('email');
        $data = [
            'creator' => $id,
            "sender_email" => $sender_email,
            "receiver_email" => $receiver_email,
            "content" => $request->input('content'),
            "screen" => $request->input('screen'),
            "screen_id" => $request->input('screen_id'),
            'status' => 0
        ];
        $notification = Notifications::create($data);
        $arrContent = array_merge(Arr::except($notification->toArray(), ["creator"]), [
            "brake" => base64_encode(app('encrypt')($userEmail)),
        ]);

        // $arrContent = [
        //     "content" => $request->input('content') ,
        //     "sender_email" => $sender_email,
        //     "brake"=> base64_encode(app('encrypt')($sender_email)),
        //     "screen" => $request->input('screen'),
        //     "screen_id" => $request->input('screen_id')
        // ];


        event(new Notice($arrContent, base64_encode(app('encrypt')($receiver_email))));
        return response()->json(["message" => 'Send successfully '], 200);
    }
    public function findAlias(Request $request)
    {
        $aliases = $this->handelEmails($request);
        $userEmail = BrandUsers::where('id', $aliases['accountId'])->value('email');
        $allEmails = collect($aliases['aliases'])->merge([$userEmail]);
        $encryptedEmails = $allEmails->map(fn($email) => base64_encode(app('encrypt')($email)));
        return response()->json($encryptedEmails, 200);
    }

    public function handelEmails(Request $request)
    {
        $accountId = $request->input('account_id');
        if (!$accountId) {
            return response()->json(['error' => 'Account ID is required'], 400);
        }
        try {
            $accountId = Crypt::decrypt($accountId);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {

        }

        $aliases = AliasMail::join('mailer', 'aliasmails.id', '=', 'mailer.alias_id')
            ->where('mailer.user_id', $accountId)
            ->where('mailer.status', 1)
            ->where('aliasmails.status', 1)
            ->pluck('aliasmails.email')
            ->toArray();
        return ["aliases" => $aliases, "accountId" => $accountId];
    }
    public function Notification(Request $request)
    {
        $aliases = $this->handelEmails($request);
        $userEmail = BrandUsers::where('id', $aliases['accountId'])->value('email');
        $perPage = $request->input('per_page', 10);
        if ($userEmail) {
            $aliases['aliases'][] = $userEmail;
        }
        $notifications = Notifications::join('aliasmails', 'notifications.receiver_email', '=', 'aliasmails.email')
            ->leftJoin('notification_reads', function ($join) use ($aliases) {
                $join->on('notifications.id', '=', 'notification_reads.notification_id')
                    ->where('notification_reads.user_id', '=', $aliases['accountId']);
            })
            ->whereIn('aliasmails.email', $aliases['aliases'])
            // ->where('notifications.creator', '!=', $aliases['accountId'])
            ->whereNull('notification_reads.notification_id')
            ->orderBy('notifications.created_at', 'DESC')
            ->select('notifications.*')
            ->paginate($perPage);


        return response()->json($notifications, 200);
    }

    public function seen(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string',
            'notification_id' => 'required|integer',
        ]);

        $accountId = $request->input('user_id');

        if (!$accountId) {
            return response()->json(['error' => 'Account ID is required'], 400);
        }

        try {
            $accountId = Crypt::decrypt($accountId);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            // return response()->json(['error' => 'Invalid Account ID'], 400);
        }
        $exists = DB::table('notification_reads')
            ->where('user_id', $accountId)
            ->where('notification_id', $request->input('notification_id'))
            ->exists();

        if (!$exists) {
            DB::table('notification_reads')->insert([
                'user_id' => $accountId,
                'notification_id' => $request->input('notification_id'),
            ]);
        }

        return response()->json(['message' => 'Notification marked as seen'], 200);
    }

}
