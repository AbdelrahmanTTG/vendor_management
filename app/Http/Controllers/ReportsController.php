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
use Illuminate\Support\Facades\Storage;

class ReportsController extends Controller
{
    // public function vmActivity(Request $request)
    // {
    //     $permissions = $request->permissions;
    //     $user = Crypt::decrypt($request->user);
    //     // default columns array to display       
    //     $defaultArray = [
    //         'id',
    //         'brand',
    //         'opened_by',
    //         'closed_by',
    //         'created_by',
    //         'number_of_resource',
    //         'request_type',
    //         'service',
    //         'task_type',
    //         'rate',
    //         'count',
    //         'unit',
    //         'currency',
    //         'source_lang',
    //         'target_lang',
    //         'start_date',
    //         'delivery_date',
    //         'subject',
    //         'software',
    //         'created_at',
    //         'time_of_opening',
    //         'time_of_closing',
    //         'TimeTaken',
    //         'new',
    //         'existing',
    //         'existing_pair',
    //         'status',
    //     ];
    //     // check for special format
    //     $formats = (new VendorProfileController)->format($request);
    //     $filteredFormats = $formats->filter(function ($format) {
    //         return $format->status == 1;
    //     });
    //     if ($filteredFormats->isNotEmpty()) {
    //         $formatArray = $filteredFormats->pluck('format')->toArray();
    //         $formatArray = array_merge(...array_map(function ($item) {
    //             return explode(',', $item);
    //         }, $formatArray));
    //         array_unshift($formatArray, "id");
    //     }
    //     $renameArrayForDisplay = [
    //         'id' => 'Ticket Number',
    //         'created_by' => 'Requester Name',
    //         'source_lang' => 'Source Language',
    //         'target_lang' => 'Target Language',
    //         'created_at' => 'Request Time',
    //         'Timetaken' => 'Taken Time',
    //         'new' => 'New Vendors',
    //         'existing' => 'Existing Vendors',
    //         'existing_pair' => 'Existing Vendors with New Pairs'
    //     ];
    //     foreach ($formatArray ?? $defaultArray as $f) {
    //         $headerFormatArray[] = $renameArrayForDisplay[$f] ?? $f;
    //     }
    //     // start get data
    //     if (!empty($request->queryParams)) {
    //         $validator = Validator::make($request->queryParams, [
    //             'start_date' => 'required|date',
    //             'end_date' => 'required|date|after_or_equal:start_date',
    //         ]);
    //         if ($validator->fails()) {
    //             $msg['type'] = "error";
    //             $message = "";
    //             foreach ($validator->errors()->all() as $err) {
    //                 $message .= $err;
    //             }
    //             $msg['message'] = $message;
    //             return response()->json($msg);
    //         } else {
    //             $perPage = $request->input('per_page', 10);
    //             $start_date = $request->queryParams['start_date'];
    //             $end_date = $request->queryParams['end_date'];
    //             $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
    //                 ->leftJoin('vm_ticket_time as t', function (JoinClause $join) {
    //                     $join->on('t.ticket', '=', 'vm_ticket.id')
    //                         ->where('t.status', 2);
    //                 })
    //                 ->leftJoin('vm_ticket_time as t2', function (JoinClause $join) {
    //                     $join->on('t2.ticket', '=', 'vm_ticket.id')
    //                         ->where('t2.status', 5);
    //                 })
    //                 ->leftJoin('vm_ticket_time as t3', function (JoinClause $join) {
    //                     $join->on('t3.ticket', '=', 'vm_ticket.id')
    //                         ->where('t3.status', 4);
    //                 })
    //                 ->leftJoin('vm_ticket_resource as r1', function (JoinClause $join) {
    //                     $join->on('r1.ticket', '=', 'vm_ticket.id')
    //                         ->where('r1.type', 2);
    //                 })
    //                 ->select('vm_ticket.*', 'users.brand AS brand', 't.created_by AS opened_by', 't.created_at AS open_time', 't2.created_by AS closed_by', 't3.created_at AS closed_time')
    //                 // ->orderBy('vm_ticket.id', 'desc')
    //                 ->groupBy('vm_ticket.id')
    //                 ->whereBetween('vm_ticket.created_at', [$start_date, $end_date]);

    //             if ($permissions['view'] == 2)
    //                 $tickets->where('t.created_by', $user);
    //             else {
    //                 $created_by = $request->queryParams['created_by'];
    //                 $tickets->whereIn('t.created_by', $created_by);
    //             }
    //             if ($request->has('sortBy') && $request->has('sortDirection')) {
    //                 $sortBy = $request->input('sortBy');
    //                 $sortDirection = $request->input('sortDirection');

    //                 if (in_array($sortDirection, ['asc', 'desc'])) {
    //                     $tickets = $tickets->orderBy($sortBy, $sortDirection);
    //                 }
    //             }
    //             // if export
    //             if ($request->has('export') && $request->input('export') === true) {
    //                 $AllTickets = TicketResource::collection($tickets->get());
    //                 $tickets = [];
    //             } else {
    //                 $tickets = $tickets->paginate($perPage);
    //                 $links = $tickets->linkCollection();
    //             }
    //         }
    //     }

    //     return response()->json([
    //         "Tickets" => isset($tickets) ? TicketResource::collection($tickets) : [],
    //         "AllTickets" => $AllTickets ?? null,
    //         "Links" => $links ?? [],
    //         "fields" => $formatArray ?? $defaultArray,
    //         "headerFields" => $headerFormatArray,
    //         "formats" => $formats,
    //     ]);
    // }
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
            'status'
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

        if (!empty($request->queryParams)) {

            $created_by = array_filter($request->queryParams['created_by'] ?? [], function ($val) {
                return !empty($val);
            });

            $start_date = $request->queryParams['start_date'] ?? null;
            $end_date   = $request->queryParams['end_date'] ?? null;

            if (empty($created_by) && empty($start_date) && empty($end_date)) {
                return response()->json([
                    'type' => 'error',
                    'message' => 'Please send at least dates or users'
                ], 422);
            }

            $perPage = $request->input('per_page', 10);

            $tickets = VmTicket::leftJoin('users', 'users.id', '=', 'vm_ticket.created_by')
                ->leftJoin('vm_ticket_time as t', function (JoinClause $join) {
                    $join->on('t.ticket', '=', 'vm_ticket.id')->where('t.status', 2);
                })
                ->leftJoin('vm_ticket_time as t2', function (JoinClause $join) {
                    $join->on('t2.ticket', '=', 'vm_ticket.id')->where('t2.status', 5);
                })
                ->leftJoin('vm_ticket_time as t3', function (JoinClause $join) {
                    $join->on('t3.ticket', '=', 'vm_ticket.id')->where('t3.status', 4);
                })
                ->leftJoin('vm_ticket_resource as r1', function (JoinClause $join) {
                    $join->on('r1.ticket', '=', 'vm_ticket.id')->where('r1.type', 2);
                })
                ->select(
                    'vm_ticket.*',
                    'users.brand AS brand',
                    't.created_by AS opened_by',
                    't.created_at AS open_time',
                    't2.created_by AS closed_by',
                    't3.created_at AS closed_time'
                )
                ->groupBy('vm_ticket.id');

            if (!empty($start_date) && !empty($end_date)) {
                $tickets->whereBetween('vm_ticket.created_at', [$start_date, $end_date]);
            }

            if (!empty($created_by)) {
                $tickets->whereIn('t.created_by', $created_by);
            }

            if ($permissions['view'] == 2) {
                $tickets->where('t.created_by', $user);
            }

            if ($request->has('sortBy') && $request->has('sortDirection')) {
                $sortBy = $request->input('sortBy');
                $sortDirection = $request->input('sortDirection');

                if (in_array($sortDirection, ['asc', 'desc'])) {
                    $tickets->orderBy($sortBy, $sortDirection);
                }
            }

            if ($request->has('export') && $request->input('export') === true) {
                $AllTickets = TicketResource::collection($tickets->get());
                $tickets = [];
            } else {
                $tickets = $tickets->paginate($perPage);
                $links = $tickets->linkCollection();
            }
        }

        return response()->json([
            "Tickets" => isset($tickets) ? TicketResource::collection($tickets) : [],
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
        // if ($user->use_type != 2  && $view != 3) {
        //     $tasks->whereIn('created_by', $piv);
        //     if (count($piv) > 1) {
        //         $tasks->orWhereNull('created_by');
        //     }
        // }
        // default columns array to display
        $tableColumns = DB::getSchemaBuilder()->getColumnListing('job_task');

        $renameArrayForSearch = ['job.priceList.source' => 'source_name', 'job.priceList.target' => 'target_name', 'user.brand' => 'brand_name', 'brand' => 'brand_name'];
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
        } else {
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
                        if (!in_array($key, $formatArray) && ($key != 'start_date' && $key != 'end_date')) {
                            if (isset($renameArrayForSearch[$key]) && !in_array($renameArrayForSearch[$key], $formatArray)) {
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
        $relationships = [
            "task_type" => ['id', 'name'],
            "vendor" => ['id', 'name'],
            "source_name" => ['id', 'name'],
        ];
        // if special format exists
        if (isset($formatArray)) {
            $selectArray = array_intersect($tableColumns, $formatArray);
            $tasks = $tasks->select('id', 'job_id', 'code', 'status', 'rate', 'count', 'created_by')->addSelect(DB::raw(implode(',', $selectArray)));
        }
        // $tasks = $tasks->orderBy('created_at', 'desc');
        // if export
        if ($request->has('export') && $request->input('export') === true) {
            $data = DB::table('job_task')
                ->leftJoin('job', 'job_task.job_id', '=', 'job.id')
                ->leftJoin('job_price_list', 'job.price_list', '=', 'job_price_list.id')
                ->leftJoin('languages as source_lang', 'job_price_list.source', '=', 'source_lang.id')
                ->leftJoin('languages as target_lang', 'job_price_list.target', '=', 'target_lang.id')
                ->leftJoin('vendor as vendor', 'job_task.vendor', '=', 'vendor.id')
                ->leftJoin('unit as unit', 'job_task.unit', '=', 'unit.id')
                ->leftJoin('currency as currency', 'job_task.currency', '=', 'currency.id')
                ->leftJoin('task_type as task_type', 'job_task.task_type', '=', 'task_type.id')
                ->leftJoin('users as users', 'job_task.created_by', '=', 'users.id')
                ->leftJoin('brand as brand', 'users.brand', '=', 'brand.id')
                ->select(
                    'source_lang.name as source_name',
                    'target_lang.name as target_name',
                    "job_task.code",
                    "job_task.subject",
                    "vendor.name as vendor",
                    "job_task.count",
                    "unit.name as unit",
                    "job_task.rate",
                    "task_type.name as task_type",
                    "task_type.name as task_type",
                    "job_task.start_date",
                    "job_task.delivery_date",
                    "job_task.status",
                    "job_task.closed_date",
                    "users.user_name as created_by",
                    "brand.name as brand_name",
                    "job_task.created_at",
                    DB::raw('job_task.count * job_task.rate as total_cost')
                )
                ->orderBy('job_task.created_at', 'desc');

            // ->get();

            // foreach ($relationships as $relation => $columns) {
            //     if (in_array($relation, $formatArray)) {
            //         $tasks2->with([$relation => function ($query) use ($columns) {
            //             $query->select($columns);
            //         }]);
            //     }
            // }
            // $AllTasks = TaskResource::collection($tasks->get());
            $AllTasks = $data->get();
        }
        if ($request->has('sortBy') && $request->has('sortDirection')) {
            $sortBy = $request->input('sortBy');
            $sortDirection = $request->input('sortDirection');

            if (in_array($sortDirection, ['asc', 'desc'])) {
                $tasks = $tasks->orderBy($sortBy, $sortDirection);
            }
        }
        $perPage = $request->input('per_page', 10);
        $tasks = $tasks->paginate($perPage);
        $links = $tasks->linkCollection();
        return response()->json([
            "Tasks" => $tasks ? TaskResource::collection($tasks) : [],
            "Links" => $links ?? [],
            "fields" => $formatArray,
            "formats" => $formats,
            "AllTasks" => $AllTasks ?? null,
        ]);
    }
    public function VPOs(Request $request)
    {
        $stander_format = [
            "payment_status" => "p.status AS payment_status",
            "user_name" => 'u.user_name',
            "code" => 't.code',
            "status" => 't.status',
            "closed_date" => 't.closed_date',
            "vpo_file" => 't.vpo_file',
            "po_verified" => "CASE WHEN (po.verified = '1') THEN 'Verified' ELSE '' END AS po_verified",
            "po_verified_at" => 'po.verified_at as po_verified_at',
            "vendor_name" => 'v.name as vendor_name',
            "source_lang" => 'slang.name as source_lang',
            "target_lang" => 'tlang.name as target_lang',
            "task_type_name" => 'tp.name as task_type_name',
            "count" => "t.count",
            "unit_name" => 'un.name as unit_name',
            "rate" => 't.rate',
            "currency_name" => 'c.name as currency_name',
            "totalamount" => '(ifnull(t.rate,0) * ifnull(t.count,0)) as totalamount',
            "verifiedStat" => "case when (t.verified = '1' and t.verified is not null) then 'Verified' 
                          when (t.verified = '2' and t.verified is not null) then 'Has Error' 
                          else '' end as verifiedStat",
            "invoice_dated" => "STR_TO_DATE(t.invoice_date,\"%m/%d/%Y\") as invoice_dated",
            "date45" => "case when (t.invoice_date <> '' and t.invoice_date is not null) then DATE_ADD(STR_TO_DATE(t.invoice_date,\"%m/%d/%Y\"), INTERVAL 45 DAY) else '' end as date45",
            "date60" => "case when (t.invoice_date <> '' and t.invoice_date is not null) then DATE_ADD(STR_TO_DATE(t.invoice_date,\"%m/%d/%Y\"), INTERVAL 60 DAY) else '' end as date60",
            "PaidStat" => "case when (p.status = '1' and p.status is not null) then 'Paid'  else '' end as PaidStat",
            "payment_date" => "ifnull(p.payment_date,'') AS payment_date",
            "payment_method_name" => "ifnull(pm.name,'') as payment_method_name",
            "portalStat" => "case when (t.job_portal = '1' and t.job_portal is not null) then 'Nexus System' else '' end as portalStat",
            "job_portal" => 't.job_portal',
            "brand" => 'b.name as brand',
        ];

        $formats = (new VendorProfileController)->format($request);
        $filteredFormats = $formats->filter(function ($format) {
            return $format->status == 1;
        });
        if ($filteredFormats->isNotEmpty()) {
            $formatArray = $filteredFormats->pluck('format')->toArray();
            $formatArray = array_merge(...array_map(function ($item) {
                return explode(',', $item);
            }, $formatArray));
            $formatArray = array_map(fn($item) => $stander_format[$item] ?? $item, $formatArray);

        } else {
            $formatArray = array_values($stander_format);
        }
        $renameMap = [
            'p.status AS payment_status' => ["Payment status", "payment_status"],
            'u.user_name' => ["PM name", "user_name"],
            't.code' => ['P.O Number', 'code'],            
            't.status' => ['VPO status', 'status'],
            't.vpo_file' => ['VPO file', 'vpo_file'],
            't.closed_date' => ['VPO date', 'closed_date'],
            "CASE WHEN (po.verified = '1') THEN 'Verified' ELSE '' END AS po_verified" => ['CPO verified', 'po_verified'],
            'po.verified_at as po_verified_at' => ['CPO verified date', 'po_verified_at'],
            'v.name as vendor_name' => ['Vendor name', 'vendor_name'],
            'slang.name as source_lang' => ['Source language', 'source_lang'],
            'tlang.name as target_lang' => ['Target language', 'target_lang'],
            'tp.name as task_type_name' => ['Task type', 'task_type_name'],
            // 'v.name as vendor_name' => ['Vendor name', 'vendor_name'],
            't.count' => ['count', 'count'],
            't.rate' => ['rate', 'rate'],
            't.job_portal' => [null, null],
            'un.name as unit_name' => ['unit', "unit_name"],
            'c.name as currency_name' => ['currency', "currency_name"],
            '(ifnull(t.rate,0) * ifnull(t.count,0)) as totalamount' => ['P.O amount', "totalamount"],
            "case when (t.verified = '1' and t.verified is not null) then 'Verified' 
             when (t.verified = '2' and t.verified is not null) then 'Has Error' 
             else '' end as verifiedStat" => ['Invoice Status', "verifiedStat"],
            "STR_TO_DATE(t.invoice_date,\"%m/%d/%Y\") as invoice_dated" => ['invoice date', "invoice_dated"],
            "case when (t.invoice_date <> '' and t.invoice_date is not null) then DATE_ADD(STR_TO_DATE(t.invoice_date,\"%m/%d/%Y\"), INTERVAL 45 DAY) else '' end as date45" => ['Due Date (45 days)', "date45"],
            "case when (t.invoice_date <> '' and t.invoice_date is not null) then DATE_ADD(STR_TO_DATE(t.invoice_date,\"%m/%d/%Y\"), INTERVAL 60 DAY) else '' end as date60" => ['Max Due Date (60 days)', "date60"],
            "case when (p.status = '1' and p.status is not null) then 'Paid'  else '' end as PaidStat" => ['Payment Status', "PaidStat"],
            "ifnull(p.payment_date,'') AS payment_date" =>['Payment date', "payment_date"],
            "ifnull(pm.name,'') as payment_method_name" => ['Payment method', "payment_method_name"],
            "case when (t.job_portal = '1' and t.job_portal is not null) then 'Nexus System' else '' end as portalStat"=>['System',"portalStat"],
            'b.name as brand' => ['brand', 'brand'],
        ];

       
        $columns = implode(', ', $formatArray);
        $query = Task::query()
            ->from('job_task as t')
            ->leftJoin('vendor_payment as p', 'p.task', '=', 't.id')
            ->leftJoin('payment_method As pm', 'pm.id', '=', 'p.payment_method')
            ->leftJoin('users AS u', 't.created_by', '=', 'u.id')
            ->leftJoin('vendor As v', 't.vendor', '=', 'v.id')
            ->leftJoin('task_type AS tp', 't.task_type', '=', 'tp.id')
            ->leftJoin('unit As un', 't.unit', '=', 'un.id')
            ->leftJoin('currency As c', 't.currency', '=', 'c.id')
            ->leftJoin('job As j', 't.job_id', '=', 'j.id')
            ->leftJoin('job_price_list AS jo', 'j.price_list', '=', 'jo.id')
            ->leftJoin('languages As slang', 'jo.source', '=', 'slang.id')
            ->leftJoin('languages As tlang', 'jo.target', '=', 'tlang.id')
            ->leftJoin('po as po', 'j.po', '=', 'po.id')
            ->leftJoin('brand as b', 't.brand', '=', 'b.id')
            ->selectRaw($columns);
        if ($request->has('queryParams') && is_array($request->queryParams)) {
            $stander_format_Search = [
                "code" => ['t.code', DB::raw("t.code AS code") ,"t.code"],
                "rate" => ["t.rate" , DB::raw("t.rate AS rate") ,"t.rate"],
                "totalamount" => [DB::raw("(ifnull(t.rate,0) * ifnull(t.count,0))"), DB::raw("(ifnull(t.rate,0) * ifnull(t.count,0)) as totalamount"),"(ifnull(t.rate,0) * ifnull(t.count,0)) as totalamount"],
                "currency" => ["c.name", DB::raw("c.name AS currency_name"),'c.name as currency_name'],
                "count" => ["t.count", DB::raw("t.count AS count") , "t.count" ],
                "unit" => ["un.name" , DB::raw("un.name AS unit_name") ,"un.name as unit_name"],
                "source_lang" => ["slang.name" , DB::raw("slang.name AS source_lang") ,"slang.name as source_lang"],
                "target_lang" => ["tlang.name", DB::raw("tlang.name AS target_lang"), 'tlang.name as target_lang'],
                "task_type" => ["tp.name", DB::raw("tp.name AS task_type_name") , 'tp.name as task_type_name'],
                "vendor" => ["v.name", DB::raw("v.name as vendor_name"),"v.name as vendor_name"],
                "po_verified_at" => ['po.verified_at', DB::raw("po.verified_at as po_verified_at"),'po.verified_at as po_verified_at'],
                "po_verified" => ["po.verified", DB::raw("po.verified as po_verified") ,"CASE WHEN (po.verified = '1') THEN 'Verified' ELSE '' END AS po_verified"],
                "payment_status" => ["p.status", DB::raw("p.status as payment_status"), 'p.status AS payment_status'],
                "status" => ['t.status', DB::raw("po.verified as status"), 't.status'],
                "user_name" => ['t.created_by', DB::raw("u.user_name as user_name"), 'u.user_name'],
                "closed_date" => ['t.closed_date', DB::raw("t.closed_date as closed_date"), 't.closed_date'],
                "invoice_dated"=> ["t.invoice_date", DB::raw("t.invoice_date as invoice_dated"), "STR_TO_DATE(t.invoice_date,\"%m/%d/%Y\") as invoice_dated"],
                "brand" => ["b.name" , DB::raw("b.name AS brand") ,"b.name as brand"],
            ];
           

             $queryParams = $request->queryParams;
            foreach ($queryParams as $key => $val) {
                if ($stander_format_Search[$key] !== 'filters' && !empty($val)) {
                    if (!in_array($stander_format_Search[$key][2], $formatArray)) {
                        $query->addSelect($stander_format_Search[$key][1]);
                        $formatArray[] = $stander_format_Search[$key][2];
                    }
                    if ($key === 'closed_date' || $key === 'po_verified_at' || $key === 'invoice_dated' ) {
                        if( is_array($val) && count($val) === 2){
                            if (!empty($val[0]) && !empty($val[1])) {
                                $query->whereBetween($stander_format_Search[$key][0], [$val[0], $val[1]]);
                            } elseif (!empty($val[0])) {
                                $query->where($stander_format_Search[$key][0], '>=', $val[0]);
                            } elseif (!empty($val[1])) {
                                $query->where($stander_format_Search[$key][0], '<=', $val[1]);
                            }
                        }
                       
                    } elseif (is_array($val)) {
                        $query->where(function ($query) use ($key, $val, $stander_format_Search) {
                            foreach ($val as $k => $v) {
                                if ($key === 'payment_status' && $v == 2) {
                                    $v = null;
                                }

                                if ($k == 0) {
                                    if (is_null($v)) {
                                        $query->whereNull($stander_format_Search[$key][0]);
                                    } else {
                                        $query->where($stander_format_Search[$key][0], "like", "%" . $v . "%");
                                    }
                                } else {
                                    if (is_null($v)) {
                                        $query->orWhereNull($stander_format_Search[$key][0]);
                                    } else {
                                        $query->orWhere($stander_format_Search[$key][0], "like", "%" . $v . "%");
                                    }
                                }
                            }
                        });
                    } else {
                        if ($key === 'payment_status' && $val == 2) {
                            $query->whereNull($stander_format_Search[$key][0]);
                        } else {
                            $query->where($stander_format_Search[$key][0], "like", "%" . $val . "%");
                        }
                    }
                }
            }

        }
        $renamedFormatArray = array_values(array_filter(array_map(function ($item) use ($renameMap) {
            return $renameMap[$item] ?? null;
        }, $formatArray)));
        if ($request->has('export') && $request->input('export') === true) {
            $AllData = $query->get();
        }
        $perPage = $request->input('per_page', 10);
        $q = $query->paginate($perPage);
        $links = $q->linkCollection();
        
        return response()->json(
            [
                "data" => $q,
                "fields" => $renamedFormatArray,
                "Links" => $links ?? [],
                "formats" => $formats,
                "totalVendors" => $q->total(),
                "AllData" => $AllData ?? null,

            ]

        );
    }
    public function download(Request $request)
    {
        $fileName = $request->input("filename");
        $status = $request->input("status");

        if (!$fileName) {
            return response()->json(['message' => 'Filename is required'], 400);
        }

        if ($status == "0") {
            $filePath = Storage::disk('external')->path("/vpo/{$fileName}");
        } elseif ($status == "1") {
            $filePath = Storage::disk('external')->path("/invoiceVendorFiles/{$fileName}");
        } else {
            return response()->json(['message' => 'Invalid status'], 400);
        }

        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->download($filePath, $fileName);
    }

}
