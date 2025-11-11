<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskHistoryResource;
use App\Http\Resources\TaskNotesResource;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use App\Models\BrandUsers;
use App\Models\Logger;
use App\Models\OfferList;
use App\Models\Task;
use App\Models\TaskConversation;
use App\Models\TaskLog;
use App\Models\VendorInvoice;
use App\Models\VmSetup;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\PortalMail;
use App\Models\Vendor;

class TaskController extends Controller
{
    protected $per_page;

    public function __construct()
    {
        $this->per_page = 10;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['id'] = 0;
        } else {
            $vendorID = $request['id'] = Crypt::decrypt($request->id);
        }

        $runningJobsData = Task::where('job_portal', 1)->where('status',  0);
        $finishedJobsData = Task::where('job_portal', 1)->where('status', 1);
        $offers1Data = Task::where('job_portal', 1)->where('status', 4);
        $offers2Data = OfferList::where('status', 4);
        if ($vendorID != 0) {
            $runningJobsData = $runningJobsData->where('vendor',  $request->id);
            $finishedJobsData = $finishedJobsData->where('vendor',  $request->id);
            $offers1Data = $offers1Data->where('vendor',  $request->id);
            $offers2Data = $offers2Data->where('vendor_list', 'Like', "%$request->id,%");
        }
        $runningJobs = $runningJobsData->orderBy('created_at', 'desc')->take(3)->get();
        $finishedJobs = $finishedJobsData->orderBy('created_at', 'desc')->take(3)->get();
        $offers1 = $offers1Data->orderBy('created_at', 'desc')->take(2)->get();
        $offers2 = $offers2Data->orderBy('created_at', 'desc')->take(2)->get();
        // start count
        $invoiceCount = VendorInvoice::query();
        $pendingInvoicesCount = VendorInvoice::where('verified', 3);
        $paidInvoicesCount = VendorInvoice::where('verified', 1);
        $pendingTasksCount = Task::select('id', 'code')->where('job_portal', 1)->where('status', 1)->where(function ($query) {
            $query->where('verified', '=', 2)
                ->orWhereNull('verified');
        });
        if ($vendorID != 0) {
            $invoiceCount = $invoiceCount->where('vendor_id',  $request->id);
            $pendingInvoicesCount = $pendingInvoicesCount->where('vendor_id',  $request->id);
            $paidInvoicesCount = $paidInvoicesCount->where('vendor_id',  $request->id);
            $pendingTasksCount = $pendingTasksCount->where('vendor',  $request->id);
        }
        $runningJobsCount = $runningJobsData->count();
        $closedJobsCount = $finishedJobsData->count();
        $offerJobsCount1 = $offers1Data->count();
        $offerJobsCount2 = $offers2Data->count();
        $invoiceCount = $invoiceCount->count();
        $pendingInvoicesCount = $pendingInvoicesCount->count();
        $paidInvoicesCount = $paidInvoicesCount->count();
        $pendingTasksCount = $pendingTasksCount->count();


        // get last 12 months data 
        $allJobsArray = $closedJobsArray = $monthNameArray = array();
        for ($i = 11; $i >= 0; $i--) {
            $date = date(strtotime("-$i month"));
            $monthName = date('M Y', $date);
            $allJobs = Task::whereMonth('created_at', date('m', $date))->whereYear('created_at', date('Y', $date));
            $closedJobs = Task::whereMonth('created_at', date('m', $date))->whereYear('created_at', date('Y', $date))->where('status', 1);
            if ($vendorID != 0) {
                $allJobs = $allJobs->where('vendor',  $request->id);
                $closedJobs = $closedJobs->where('vendor',  $request->id);
            }
            $allJobs = $allJobs->count();
            $closedJobs = $closedJobs->count();

            array_push($allJobsArray, $allJobs);
            array_push($closedJobsArray, $closedJobs);
            array_push($monthNameArray, $monthName);
        }

        return response()->json([
            "runningJobs" => TaskResource::collection($runningJobs),
            "finishedJobs" => TaskResource::collection($finishedJobs),
            "pendingJobs" => TaskResource::collection($offers1->merge($offers2)),
            "countData" => ([
                "runningJobsCount" => $runningJobsCount,
                "closedJobsCount" => $closedJobsCount,
                "offerJobsCount" => $offerJobsCount1 + $offerJobsCount2,
                "invoiceCount" => $invoiceCount,
            ]),
            "chartData" => ([
                "pendingInvoicesCount" => $pendingInvoicesCount,
                "paidInvoicesCount" => $paidInvoicesCount,
                "pendingTasksCount" => $pendingTasksCount,
                "allJobsArray" => $allJobsArray,
                "closedJobsArray" => $closedJobsArray,
                "monthNameArray" => $monthNameArray,
            ]),
        ], 200);
    }

    /**
     * List All Jobs 
     */
    public function allJobs(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['id'] = 0;
        } else {
            $vendorID = $request['id'] = Crypt::decrypt($request->id);
        }
        $query = Task::query()->where('job_portal', 1)->where('status', '!=', 6);
        if ($vendorID != 0) {
            $query = $query->where('vendor',  $request->id);
        }
        $tasks = $query->orderBy('created_at', 'desc')->paginate($this->per_page);
        $links = $tasks->linkCollection();
        return response()->json([
            "Tasks" => TaskResource::collection($tasks),
            "Links" => $links,
        ], 200);
    }
    /**
     * List All Offers 
     */
    public function allJobOffers(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['id'] = 0;
        } else {
            $vendorID = $request['id'] = Crypt::decrypt($request->id);
        }
        $tasks = Task::query()->where('job_portal', 1)->where('status', 4);
        $tasks2  = OfferList::query()->where('job_portal', 1)->where('status', 4);
        if ($vendorID != 0) {
            $tasks = $tasks->where('vendor',  $request->id);
            $tasks2 = $tasks2->where('vendor_list', 'Like', "%$request->id,%");
        }
        $tasks = $tasks->orderBy('created_at', 'desc')->get();
        $tasks2 = $tasks2->orderBy('created_at', 'desc')->get();

        return response()->json(["Tasks" => TaskResource::collection($tasks->merge($tasks2))], 200);
    }
    /**
     * List All Finished 
     */
    public function allClosedJobs(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['id'] = 0;
        } else {
            $vendorID = $request['id'] = Crypt::decrypt($request->id);
        }
        $query = Task::query()->where('job_portal', 1)->where('status', 1);
        if ($vendorID != 0) {
            $query = $query->where('vendor',  $request->id);
        }
        $tasks = $query->orderBy('created_at', 'desc')->paginate($this->per_page);
        $links = $tasks->linkCollection();
        return response()->json([
            "Tasks" => TaskResource::collection($tasks),
            "Links" => $links,
        ], 200);
    }
    /**
     * List All Scheduled Jobs  
     */
    public function allPlannedJobs(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['id'] = 0;
        } else {
            $vendorID = $request['id'] = Crypt::decrypt($request->id);
        }
        $query = Task::query()->where('job_portal', 1)->where('status', 7);
        if ($vendorID != 0) {
            $query = $query->where('vendor',  $request->id);
        }
        $tasks = $query->orderBy('created_at', 'desc')->paginate($this->per_page);
        $links = $tasks->linkCollection();
        return response()->json([
            "Tasks" => TaskResource::collection($tasks),
            "Links" => $links,
        ], 200);
    }
    /**
     * View Job Task Offer & Job Offer List Details
     */
    public function viewOffer(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['vendor'] = 0;
        } else {
            $vendorID = $request['vendor'] = Crypt::decrypt($request->vendor);
        }
        $type = $request->type;
        if ($type == 'task') {
            $task = Task::where('id', $request->id)->where('job_portal', 1)->where('status', 4);
            if ($vendorID != 0) {
                $task =  $task->where('vendor', $request->vendor);
            }
        } elseif ($type == 'offer_list') {
            $task  = OfferList::where('id', $request->id)->where('job_portal', 1)->where('status', 4);
            if ($vendorID != 0) {
                $task =  $task->where('vendor_list', 'Like', "%$request->vendor,%");
            }
        }
        $task =  $task->first();
        return response()->json(["Task" => new TaskResource($task)], 200);
    }
    /**
     * Display the specified Job Task.
     */
    public function viewJob(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['vendor'] = 0;
        } else {
            $vendorID = $request['vendor'] = Crypt::decrypt($request->vendor);
        }
        $vmConfig = VmSetup::select('enable_evaluation', 'v_ev_name1', 'v_ev_name2', 'v_ev_name3', 'v_ev_name4', 'v_ev_name5', 'v_ev_name6')->first();
        if ($vendorID != 0) {
            $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->first();
        } else {
            $task = Task::where('id', $request->id)->where('job_portal', 1)->first();
        }
        return response()->json([
            "Task" => new TaskResource($task),
            "Notes" => TaskNotesResource::collection($task->conversation),
            "History" => TaskHistoryResource::collection($task->log),
            "vmConfig" => $vmConfig,
        ], 200);
    }
    /**
     * Task conversation
     */
    public function sendMessage(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
        $data['message'] = $request->message;
        $data['task'] =  $request->task_id;
        $data['from'] = 2;
        $data['created_by'] = $request->vendor;
        $data['created_at'] =date("Y-m-d H:i:s");
        $task = Task::find($request->task_id);
        // echo $message;
        if (TaskConversation::create($data)) {
            // get config & pm email
            $vmConfig = VmSetup::first();
            $pmEmail = BrandUsers::select('email')->where('id', $task->created_by)->get();
            $mailData = [
                'subject' => $vmConfig->pe_message_subject,
                'title' => 'Task New Reply',
                'body' =>  $vmConfig->pe_message_body,
                'data' =>  $request->message,
                'taskDetails' => $task,
            ];
            Mail::to($pmEmail)->send(new PortalMail($mailData));
            $msg['type'] = "success";
            $message = "Your Message Send Successfully";
        } else {
            $msg['type'] = "error";
            $message = "Error Sending Messgae, Please Try Again!";
        }
        $msg['message'] = $message;
        return response()->json(["msg" => $msg, "Notes" => TaskNotesResource::collection($task->conversation)]);
    }
    /**
     * Cancel Task Offer
     */
    public function cancelOffer(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
        $data['status'] = 3;
        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        if ($task) {
            Logger::addToLoggerUpdate('job_task', 'id', $request->id, $request->vendor);
            if ($task->update($data)) {
                //  add to task log
                $this->addToTaskLogger($request->id, 2, $request->vendor);
                // send Rejection Mail          
                $pmEmail = BrandUsers::select('email')->where('id', $task->created_by)->get();
                $mailData = [
                    'subject' => 'Task Rejected',
                    'title' => 'Task Rejected',
                    'body' =>  'Hello, Task rejected in Lingo Talents',
                    'taskDetails' => $task,
                    'showMoreDetails' => 1,
                ];
                Mail::to($pmEmail)->send(new PortalMail($mailData));
                $msg['type'] = "success";
                $message = "Your Offer Rejected Successfully";
            } else {
                $msg['type'] = "error";
                $message = "Error Cancelling Offer Job, Please Try Again!";
            }

            $msg['message'] = $message;
        } else {
            $msg['type'] = "error";
            $msg['message'] = "Error Cancelling Offer Job, Please Try Again!";
        }
        return response()->json($msg);
    }
    /**
     * accept Task Offer
     */
    public function acceptOffer(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
        $data['status'] = 0;
        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        if ($task) {
            Logger::addToLoggerUpdate('job_task', 'id', $request->id, $request->vendor);
            if ($task->update($data)) {
                // add to task log
                $this->addToTaskLogger($request->id, 1, $request->vendor);
                // send Acceptance Mail          
                $pmEmail = BrandUsers::select('email')->where('id', $task->created_by)->get();
                $mailData = [
                    'subject' => 'Task Accepted',
                    'title' => 'Task Accepted',
                    'body' =>  'Hello, Task accepted in Lingo Talents',
                    'taskDetails' => $task,
                    'showMoreDetails' => 1,
                ];
                Mail::to($pmEmail)->send(new PortalMail($mailData));
                $msg['type'] = "success";
                $message = "Your Offer Accepted Successfully";
            } else {
                $msg['type'] = "error";
                $message = "Error Accepting Offer, Please Try Again!";
            }
            $msg['message'] = $message;
        } else {
            $msg['type'] = "error";
            $msg['message'] = "Error Accepting Offer, Please Try Again!";
        }
        return response()->json($msg);
    }
    /**
     * accept Task Offer List & send to job task table
     */
    public function acceptOfferList(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
        $offer = OfferList::where('vendor_list', 'Like', "%$request->vendor,%")->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        if ($offer) {
            $data['status'] = 0;
            Logger::addToLoggerUpdate('job_offer_list', 'id', $request->id, $request->vendor);
            if ($offer->update($data)) {
                $job_data['job_id'] = $offer->job_id;
                $job_data['subject'] = $offer->subject;
                $job_data['task_type'] = $offer->task_type;
                $job_data['count'] = $offer->count;
                $job_data['start_date'] = $offer->start_date;
                $job_data['delivery_date'] = $offer->delivery_date;
                $job_data['time_zone'] = $offer->time_zone;
                $job_data['insrtuctions'] = $offer->insrtuctions;
                $job_data['job_portal'] = 1;
                $job_data['status'] = 0;
                $job_data['rate'] = $offer->rate;
                $job_data['currency'] = $offer->currency;
                $job_data['unit'] = $offer->unit;
                $job_data['vendor'] = $request->vendor;
                $job_data['file'] = $offer->file;
                $job_data['created_by'] = $offer->created_by;
                $job_data['created_at'] = $offer->created_at;
                $job_data['start_after_id'] = $offer->start_after_id;
                $job_data['start_after_type'] = $offer->start_after_type;
                // generate job code
                $job_data['code'] = $offer->generateTaskCode();
                // insert data into job_task   
                $task = Task::create($job_data);
                if ($task) {
                    $insert_id = $task->id;
                    // add to task log
                    $this->addToTaskLogger($insert_id, 1, $request->vendor);
                    $data['task_id'] = $insert_id;
                    Logger::addToLoggerUpdate('job_offer_list', 'id', $request->id, $request->vendor);
                    $offer->update($data);
                    // send Acceptance Mail          
                    $pmEmail = BrandUsers::select('email')->where('id', $task->created_by)->get();
                    $mailData = [
                        'subject' => 'Task Accepted',
                        'title' => 'Task Accepted',
                        'body' =>  'Hello, Task accepted in Lingo Talents',
                        'taskDetails' => $task,
                        'showMoreDetails' => 1,
                    ];
                    Mail::to($pmEmail)->send(new PortalMail($mailData));
                    // send to other vendors emails --
                    $mailData2 = [
                        'subject' => 'Job Offer',
                        'title' => 'WE HAVE IMPORTANT INFORMATION FOR YOU',
                        'body' =>  'Hello, this job offer is no longer available in Lingo Talents',
                        'taskDetails' => $task,
                    ];
                    $vendor_list =  explode(', ', $offer->vendor_list);
                    foreach ($vendor_list as $val) {
                        if ($val == $request->vendor)
                            continue;
                        $vendorEmail = Vendor::select('email')->where('id', $val)->get();
                        Mail::to($vendorEmail)->send(new PortalMail($mailData2));
                    }

                    $msg['type'] = "success";
                    $message = "Your Offer Accepted Successfully";
                } else {
                    $msg['type'] = "error";
                    $message = "Error Accepting Offer, Please Try Again!";
                }
            } else {
                $msg['type'] = "error";
                $message = "Error Accepting Offer, Please Try Again!";
            }
            $msg['message'] = $message;
        } else {
            $msg['type'] = "error";
            $msg['message'] = "Error Accepting Offer, Please Try Again!";
        }
        return response()->json($msg);
    }
    /**
     * Finish JOB and Send File .
     */
    public function finishJob(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
        $data['vendor_notes'] = $request->note ?? '';
        $data['status'] = 5;
        $offer = Task::where('vendor', $request->vendor)->where('id', $request->task_id)->where('job_portal', 1)->where('status', 0)->first();
        if ($offer) {
            if ($request->file('file') != null) {
                $file = $request->file('file');
                // $path = $file->store('uploads/jobTaskVendorFiles/', 'public');
                $folderPath = storage_path('app/external/jobTaskVendorFiles');
                if (!file_exists($folderPath)) {
                    mkdir(
                        $folderPath,
                        0777,
                        true
                    );
                }
                $path = $file->store('jobTaskVendorFiles/', 'external');
                if (!$path) {
                    $msg['type'] = "error";
                    $message = "Error Uploading File, Please Try Again!";
                } else {
                    $data['vendor_attachment'] = $file->hashName();
                }
            }
            Logger::addToLoggerUpdate('job_task', 'id', $request->task_id, $request->vendor);
            if ($offer->update($data)) {
                $evaluation = VmSetup::first();
                if ($evaluation->enable_evaluation == 1) {
                    $dataEV['vendor_ev_select'] = $request->ev_select;
                    $dataEV['vendor_ev_type'] = ($request->ev_select < 5) ? 2 : 1;
                    $dataEV['vendor_note'] = $request->ev_note;
                    if ($request->ev_select < 5) {
                        for ($i = 1; $i <= 6; $i++) {
                            $v_ev_name = "v_ev_name" . $i;
                            $v_ev_per = "v_ev_per" . $i;
                            if ($evaluation->$v_ev_name != null) {
                                $dataEV["vendor_ev_text$i"] = $evaluation->$v_ev_name;
                                $dataEV["vendor_ev_per$i"] = $evaluation->$v_ev_per;
                                $dataEV["vendor_ev_val$i"] = in_array("v_ev_val$i", $request->ev_checkBox) ? 1 : 0;
                            }
                        }
                    }
                    // start insert data
                    $task_ev =  DB::table('task_evaluation')->where('task_id', $request->task_id)->first();
                    if (empty($task_ev)) {
                        // get job task info                       
                        $dataEV['task_id'] = $request->task_id;
                        $dataEV['project_id'] = $offer->job->project_id;
                        $dataEV['job_id'] = $offer->job_id;
                        $dataEV['vendor_id'] = $request->vendor;
                        $dataEV['vendor_ev_created_at'] =date("Y-m-d H:i:s");
                        DB::table('task_evaluation')->insert($dataEV);
                    } else {
                        // do edit 
                        if ($task_ev->vendor_ev_type == null)
                            $dataEV['vendor_ev_created_at'] =date("Y-m-d H:i:s");
                        Logger::addToLoggerUpdate('task_evaluation', 'task_id', $request->task_id, $request->vendor);

                        DB::table('task_evaluation')->where('task_id', $request->task_id)
                            ->update($dataEV);
                    }
                }
                // add to task log
                $this->addToTaskLogger($request->task_id, 3, $request->vendor);
                //send Vendor Finish Mail         
                $pmEmail = BrandUsers::select('email')->where('id', $offer->created_by)->get();
                $vendorEmail = Vendor::select('email')->where('id', $request->vendor)->get();
                $mailData = [
                    'subject' => 'Task Finished -' . $offer->subject,
                    'title' => 'Task Finished',
                    'body' =>  'Hello,  Task Finished in Lingo Talents',
                    'taskDetails' => $offer,
                    'showMoreDetails' => 1,
                ];
                Mail::to($pmEmail)->cc($vendorEmail)->send(new PortalMail($mailData));
                //send Confirm Task Mail To Pm        
                $pmEmail = BrandUsers::select('email')->where('id', $offer->created_by)->get();
                $encodeId = base64_encode($offer->id);
                $erp_link = VmSetup::getErpLink();
                $confirmLink = "<strong>Confirm Task : </strong>";
                $confirmLink .= "<a href=".$erp_link."/projectManagment/pmDirectConfirmExternalLink?task_id=".$encodeId.">Click Here To Confirm</a>";
                $mailData2 = [
                    'subject' => 'Confirm Task -' . $offer->subject,
                    'title' => 'Confirm Task',
                    'body' =>  'Hello,  Task Finished in Lingo Talents',
                    'taskDetails' => $offer,
                    'showMoreDetails' => 1,
                    'data' =>  $confirmLink,
                ];
                Mail::to($pmEmail)->send(new PortalMail($mailData2));
                $msg['type'] = "success";
                $message = "Your data has been successfully transmitted.";
            }
        } else {
            $msg['type'] = "error";
            $message = "Error, Please Try Again!";
        }
        $msg['message'] = $message;
        return response()->json($msg);
    }
    /**
     * Store Scheduled Jobs relpy.
     */
    public function planTaskReply(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
        $offer = Task::where('vendor', $request->vendor)->where('id', $request->task_id)->where('job_portal', 1)->where('status', 7)->first();
        if ($offer) {
            $status = $data['status'] = $request->status;
            $data['plan_comment'] = $request->note ?? '';
            Logger::addToLoggerUpdate('job_task', 'id', $request->task_id, $request->vendor);

            if ($offer->update($data)) {
                // add to task log
                $this->addToTaskLogger($request->task_id, $status + 1, $request->vendor);
                // send Mail          
                $pmEmail = BrandUsers::select('email')->where('id', $offer->created_by)->get();
                if ($status == 8) {
                    $subject = "Heads-up Request has been Accepted";
                    $title = "Task Accepted";
                    $body = "Hello, Heads-up Request has been Accepted in Lingo Talents";
                } elseif ($status == 9) {
                    $subject = "Heads-up Request has been Rejected";
                    $title = "Task Rejected";
                    $body = "Hello, Heads-up Request has been Rejected in Lingo Talents";
                }
                $mailData = [
                    'subject' => $subject,
                    'title' => $title,
                    'body' =>  $body,
                    'taskDetails' => $offer,
                    'showMoreDetails' => 1,
                ];
                Mail::to($pmEmail)->send(new PortalMail($mailData));
                $msg['type'] = "success";
                $message = "Your Reply sent Successfully";
            } else {
                $msg['type'] = "error";
                $message = "Error, Please Try Again!";
            }
        }

        $msg['message'] = $message;
        return response()->json($msg);
    }
    /**
     * Update the specified resource in storage.
     */
    public function addToTaskLogger($id, $status, $user)
    {
        $log_data['from'] = 2;
        $log_data['task'] = $id;
        $log_data['status'] = $status;
        $log_data['created_by'] = $user;
        $log_data['created_at'] =date("Y-m-d H:i:s");
        TaskLog::create($log_data);
    }
}
