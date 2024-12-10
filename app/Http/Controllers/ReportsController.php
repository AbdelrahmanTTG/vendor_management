<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TicketResource;
use App\Models\BrandUsers;
use App\Models\Task;
use App\Models\VmTicket;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class ReportsController extends Controller
{
    public function vmActivity(Request $request)
    {
        $permissions = $request->permissions;
        $user = Crypt::decrypt($request->user);
        $validator = Validator::make($request->queryParams, [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        if ($validator->fails()) {
            $msg['type'] = "error";
            $message = "";
            foreach ($validator->errors()->all() as $err) {
                $message .= $err;
            }
            $msg['message'] = $message;
            return response()->json($msg);
        } else {
            $perPage = $request->input('per_page', 10);
            $start_date = $request->queryParams['start_date'];
            $end_date = $request->queryParams['end_date'];
            $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
                ->leftJoin('vm_ticket_time as t', function (JoinClause $join) {
                    $join->on('t.ticket', '=', 'vm_ticket.id')
                        ->where('t.status', 2);
                })
                ->leftJoin('vm_ticket_time as t2', function (JoinClause $join) {
                    $join->on('t2.ticket', '=', 'vm_ticket.id')
                        ->where('t2.status', 5);
                })
                ->leftJoin('vm_ticket_time as t3', function (JoinClause $join) {
                    $join->on('t3.ticket', '=', 'vm_ticket.id')
                        ->where('t3.status', 4);
                })
                ->leftJoin('vm_ticket_resource as r1', function (JoinClause $join) {
                    $join->on('r1.ticket', '=', 'vm_ticket.id')
                        ->where('r1.type', 2);
                })
                ->select('vm_ticket.*', 'users.brand AS brand', 't.created_by AS opened_by', 't.created_at AS open_time', 't2.created_by AS closed_by', 't3.created_at AS closed_time')
                ->orderBy('vm_ticket.id', 'desc')
                ->groupBy('vm_ticket.id')
                ->whereBetween('vm_ticket.created_at', [$start_date, $end_date]);

            if ($permissions['view'] == 2)
                $tickets->where('t.created_by', $user);
            else {
                $created_by = $request->queryParams['created_by'];
                $tickets->whereIn('t.created_by', $created_by);
            }
            $tickets = $tickets->paginate($perPage);
            $links = $tickets->linkCollection();
            return response()->json(["Tickets" => TicketResource::collection($tickets), "Links" => $links]);
        }
    }

    public function getVmData()
    {
        $users = BrandUsers::SelectVmData();
        return response()->json($users);
    }

    public function getPmData()
    {
        $users = BrandUsers::SelectPmData();
        return response()->json($users);
    }

    public function allTasks(Request $request)
    {
        $tasks = Task::where('job_id', '<>', 0);
        $perPage = $request->input('per_page', 10);
        if (!empty($request->queryParams)) {
            $validator = Validator::make($request->queryParams, [
                'start_date' => 'date',
                'end_date' => 'date|after_or_equal:start_date',
            ]);
            if ($validator->fails()) {
                $msg['type'] = "error";
                $message = "";
                foreach ($validator->errors()->all() as $err) {
                    $message .= $err;
                }
                $msg['message'] = $message;
                return response()->json($msg);
            } else {
                if (!empty($request->queryParams)) {
                    foreach ($request->queryParams as $key => $val) {
                        if (!empty($val)) {
                            if (is_array($val)) {
                                if (str_contains($key, '.')) {
                                    $relations =  explode('.', $key);
                                    $tasks->whereHas($relations[0], function ($q) use ($relations, $val) {
                                        if (count($relations) == 2) {
                                            foreach ($val as $x => $v) {
                                                if ($x == 0) {
                                                    $q->where($relations[1], $v);
                                                } else {
                                                    $q->orWhere($relations[1], $v);
                                                }
                                            }
                                        } else {
                                            for ($i = 1; $i < count($relations) - 1; $i++) {
                                                $q->whereHas($relations[$i], function ($q1) use ($relations, $val, $i) {
                                                    foreach ($val as $x => $v) {
                                                        if ($x == 0) {
                                                            $q1->where($relations[$i + 1], $v);
                                                        } else {
                                                            $q1->orWhere($relations[$i + 1], $v);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    $tasks->where(function ($query) use ($key, $val) {
                                        foreach ($val as $k => $v) {
                                            if ($k == 0) {
                                                if ($key == 'code')
                                                    $query->where($key, "like", "%" . $v . "%");
                                                else
                                                    $query->where($key,  $v);
                                            } else {
                                                if ($key == 'code')
                                                    $query->orWhere($key, "like", "%" . $v . "%");
                                                else
                                                    $query->orWhere($key,  $v);
                                            }
                                        }
                                    });
                                }
                            } else {
                                if ($key == 'start_date') {
                                    $start_date = $request->queryParams['start_date'];
                                    $tasks->where('created_at', '>=', $start_date);
                                } elseif ($key == 'end_date') {
                                    $end_date = $request->queryParams['end_date'];
                                    $tasks->where('created_at', '<=', $end_date);
                                }
                            }
                        }
                    }
                }
            }
        }
        $tasks = $tasks->orderBy('created_at', 'desc');
        $tasks = $tasks->paginate($perPage);
        $links = $tasks->linkCollection();
        return response()->json(["Tasks" => TaskResource::collection($tasks), "Links" => $links]);
    }
}
