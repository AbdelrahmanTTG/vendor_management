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
use App\Http\Controllers\VendorProfileController;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class ReportsController extends Controller
{
    public function vmActivity(Request $request)
    {
        $permissions = $request->permissions;
        $user = Crypt::decrypt($request->user);
        // default columns array to display       
        $defaultArray = [
            'id',
            'brand',
            'opened_by',
            'closed_by',
            'created_by',
            'number_of_resource',
            'request_type',
            'service',
            'task_type',
            'rate',
            'count',
            'unit',
            'currency',
            'source_lang',
            'target_lang',
            'start_date',
            'delivery_date',
            'subject',
            'software',
            'created_at',
            'time_of_opening',
            'time_of_closing',
            'TimeTaken',
            'new',
            'existing',
            'existing_pair',
            'status',
        ];
        // check for special format
        $formats = (new VendorProfileController)->format($request);
        $filteredFormats = $formats->filter(function ($format) {
            return $format->status == 1;
        });
        if ($filteredFormats->isNotEmpty()) {
            $formatArray = $filteredFormats->pluck('format')->toArray();
            $formatArray = array_merge(...array_map(function ($item) {
                return explode(',', $item);
            }, $formatArray));
            array_unshift($formatArray, "id");
        }
        $renameArrayForDisplay = [
            'id' => 'Ticket Number',
            'created_by' => 'Requester Name',
            'source_lang' => 'Source Language',
            'target_lang' => 'Target Language',
            'created_at' => 'Request Time',
            'Timetaken' => 'Taken Time',
            'new' => 'New Vendors',
            'existing' => 'Existing Vendors',
            'existing_pair' => 'Existing Vendors with New Pairs'
        ];
        foreach ($formatArray ?? $defaultArray as $f) {
            $headerFormatArray[] = $renameArrayForDisplay[$f] ?? $f;
        }
        // start get data
        if (!empty($request->queryParams)) {
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
                // if export
                if ($request->has('export') && $request->input('export') === true) {
                    $AllTickets = TicketResource::collection($tickets->get());
                    $tickets = [];
                } else {
                    $tickets = $tickets->paginate($perPage);
                    $links = $tickets->linkCollection();
                }
            }
        }

        return response()->json([
            "Tickets" => isset($tickets)?TicketResource::collection($tickets):[],
            "AllTickets" => $AllTickets ?? null,
            "Links" => $links ?? [],
            "fields" => $formatArray ?? $defaultArray,
            "headerFields" => $headerFormatArray,
            "formats" => $formats,
        ]);
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
        $user = JWTAuth::parseToken()->authenticate();
        $payload = JWTAuth::getPayload(JWTAuth::getToken());
        $view = $request->input('view');
        if ($request->filled('view')) {
            if ($view == 1) {
                $piv = explode(',', $payload["piv"]);
                array_push($piv, $payload["sub"]);
            } elseif ($view == 2) {
                $piv = explode(',', $payload["sub"]);
            }
        } else {
            return response()->json([
                'message' => 'Bad Request: view parameter is missing or invalid.'
            ], 400);
        }
        // start get data
        $tasks = Task::where('job_id', '<>', 0);
        if ($user->use_type != 2) {
            $tasks->whereIn('created_by', $piv);
            if (count($piv) > 1) {
                $tasks->orWhereNull('created_by');
            }
        }
        // default columns array to display
        $tableColumns = DB::getSchemaBuilder()->getColumnListing('job_task');
      
        $renameArrayForSearch = ['job.priceList.source' => 'source_name', 'job.priceList.target' => 'target_name', 'user.brand' => 'brand_name','brand'=> 'brand_name'];
        // check for special format
        $formats = (new VendorProfileController)->format($request);
        $filteredFormats = $formats->filter(function ($format) {
            return $format->status == 1;
        });
        if ($filteredFormats->isNotEmpty()) {
            $formatArray = $filteredFormats->pluck('format')->toArray();
            $formatArray = array_merge(...array_map(function ($item) {
                return explode(',', $item);
            }, $formatArray));
        }else{
            $formatArray = [
                'code',
                'subject',
                'task_type',
                'vendor',
                'source_name',
                'target_name',
                'count',
                'unit',
                'rate',
                'total_cost',
                'currency',
                'start_date',
                'delivery_date',
                'status',
                'closed_date',
                'created_by',
                'created_at',
                'brand_name'
            ];
        }
        // if filter exists
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
                        if (!in_array($key, $formatArray) && ($key != 'start_date' && $key != 'end_date')){
                         if(isset($renameArrayForSearch[$key]) && !in_array($renameArrayForSearch[$key],$formatArray)) { 
                            $formatArray[] = $renameArrayForSearch[$key] ?? $key;
                            }         
                        }                  
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
        // if special format exists
        if (isset($formatArray)) {
            $selectArray = array_intersect($tableColumns, $formatArray);
            $tasks = $tasks->select('id', 'job_id', 'code', 'status', 'rate', 'count', 'created_by')->addSelect(DB::raw(implode(',', $selectArray)));
        }
        $tasks = $tasks->orderBy('created_at', 'desc');
        // if export
        if ($request->has('export') && $request->input('export') === true) {
            // $AllTasks = TaskResource::collection($tasks->get());
            $AllTasks = collect();
            $tasks->chunk(100, function ($chunk) use (&$AllTasks) {
                $AllTasks = $AllTasks->merge(TaskResource::collection($chunk));
            });
            $tasks = [];
        } 
        else {
            $perPage = $request->input('per_page', 10);
            $tasks = $tasks->paginate($perPage);
            $links = $tasks->linkCollection();
        }
        return response()->json([
            "Tasks" => $tasks?TaskResource::collection($tasks):[],
            "Links" => $links??[],
            "fields" => $formatArray,
            "formats" => $formats,
            "AllTasks" => $AllTasks ?? null,
        ]);
    }
}
