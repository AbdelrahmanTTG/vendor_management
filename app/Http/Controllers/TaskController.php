<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskHistoryResource;
use App\Http\Resources\TaskNotesResource;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use App\Models\OfferList;
use App\Models\Task;
use App\Models\TaskConversation;
use App\Models\TaskLog;
use App\Models\VendorInvoice;
use App\Models\VmSetup;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $runningJobs = Task::where('vendor',  $request->id)->where('job_portal', 1)->where('status',  0)->orderBy('created_at', 'desc')->take(3)->get();
        $finishedJobs = Task::where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->orderBy('created_at', 'desc')->take(3)->get();
        $offers1 = Task::where('vendor',  $request->id)->where('job_portal', 1)->where('status', 4)->orderBy('created_at', 'desc')->take(2)->get();
        $offers2 = OfferList::where('vendor_list', 'Like', "%$request->id,%")->where('status', 4)->orderBy('created_at', 'desc')->take(2)->get();
        // start count
        $runningJobsCount = Task::where('vendor',$request->id)->where('job_portal', 1)->where('status', 0)->count();
        $closedJobsCount = Task::where('vendor',$request->id)->where('job_portal', 1)->where('status',1)->count();
        $offerJobsCount1 = Task::where('vendor',$request->id)->where('job_portal', 1)->where('status',4)->count();
        $offerJobsCount2 = OfferList::where('vendor_list', 'Like', "%$request->id,%")->where('job_portal', 1)->where('status',4)->count();
        $invoiceCount = VendorInvoice::where('vendor_id',  $request->id)->count();

             
        $pendingInvoicesCount = VendorInvoice::query()->where('vendor_id',  $request->id)->where('verified', 3)->count();
        $paidInvoicesCount = VendorInvoice::query()->where('vendor_id',  $request->id)->where('verified', 1)->count();
        $pendingTasksCount = Task::select('id', 'code')->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where(function ($query) {
            $query->where('verified', '=', 2)
                ->orWhereNull('verified');
        })->count();
      
         // get last 12 months data 
         $allJobsArray = $closedJobsArray = $monthNameArray = array();
         for ($i = 11; $i >= 0; $i--) {
             $date = date(strtotime("-$i month"));
             $monthName = date('M Y',$date);            
             $allJobs = Task::where('vendor',$request->id)->whereMonth('created_at',date('m',$date))->whereYear('created_at',date('Y',$date))->count();
             $closedJobs = Task::where('vendor',$request->id)->whereMonth('created_at',date('m',$date))->whereYear('created_at',date('Y',$date))->where('status',1)->count();
             
             array_push($allJobsArray, $allJobs);
             array_push($closedJobsArray, $closedJobs);
             array_push($monthNameArray, $monthName);            
         }
                        
        return response()->json([
            "runningJobs" => TaskResource::collection($runningJobs),
            "finishedJobs" => TaskResource::collection($finishedJobs),
            "pendingJobs" => TaskResource::collection($offers1->merge($offers2)),
            "countData"=>([
                "runningJobsCount"=>$runningJobsCount,
                "closedJobsCount"=>$closedJobsCount,
                "offerJobsCount"=>$offerJobsCount1 + $offerJobsCount2,
                "invoiceCount"=>$invoiceCount,       
             ]),
            "chartData"=>([
                "pendingInvoicesCount"=>$pendingInvoicesCount,
                "paidInvoicesCount"=>$paidInvoicesCount,
                "pendingTasksCount"=>$pendingTasksCount,
                "allJobsArray"=>$allJobsArray,
                "closedJobsArray"=>$closedJobsArray,
                "monthNameArray"=>$monthNameArray,
            ]),
        ], 200);
    }

    /**
     * List All Jobs 
     */
    public function allJobs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', '!=', 6);
        $tasks = $query->orderBy('created_at', 'desc')->get();
        // ->paginate(10);

        return response()->json(["Tasks" => TaskResource::collection($tasks)], 200);
    }
    /**
     * List All Offers 
     */
    public function allJobOffers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $tasks = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 4)->orderBy('created_at', 'desc')->get();
        $tasks2  = OfferList::query()->where('vendor_list', 'Like', "%$request->id,%")->where('job_portal', 1)->where('status', 4)->orderBy('created_at', 'desc')->get();

        return response()->json(["Tasks" => TaskResource::collection($tasks->merge($tasks2))], 200);
    }
    /**
     * List All Finished 
     */
    public function allClosedJobs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1);
        $tasks = $query->orderBy('created_at', 'desc')->get();
        return response()->json(["Tasks" => TaskResource::collection($tasks)], 200);
    }
    /**
     * List All Scheduled Jobs  
     */
    public function allPlannedJobs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 7);
        $tasks = $query->orderBy('created_at', 'desc')->get();
        return response()->json(["Tasks" => TaskResource::collection($tasks)], 200);
    }
    /**
     * View Job Task Offer & Job Offer List Details
     */
    public function viewOffer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'vendor' => 'required',
            'type' => 'required|string',
        ]);
        $type = $request->type;
        if ($type == 'task') {
            $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        } elseif ($type == 'offer_list') {
            $task  = OfferList::where('vendor_list', 'Like', "%$request->vendor,%")->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        }
        return response()->json(["Task" => new TaskResource($task)], 200);
    }
    /**
     * Display the specified Job Task.
     */
    public function viewJob(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'vendor' => 'required'
        ]);
        $vmConfig = VmSetup::select('enable_evaluation','v_ev_name1','v_ev_name2','v_ev_name3','v_ev_name4','v_ev_name5','v_ev_name6')->first();
        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->first();
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
        $validator = Validator::make($request->all(), [
            'task_id' => 'required',
            'vendor' => 'required',
            'message' => 'required'
        ]);
        $data['message'] = $request->message;
        $data['task'] =  $request->task_id;
        $data['from'] = 2;
        $data['created_by'] = $request->vendor;
        $data['created_at'] = date("Y-m-d H:i:s");
        $task = Task::find($request->task_id);
        // echo $message;
        if (TaskConversation::create($data)) {
            //   $this->admin_model->sendVendorMessageMail($data['task'], $this->user, $data['message']);
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
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'vendor' => 'required'
        ]);

        $data['status'] = 3;
        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        if ($task) {
            // $this->admin_model->addToLoggerUpdate('job_task', 'id', $data['id'], $this->user);
            if ($task->update($data)) {
                //  add to task log
                $this->addToTaskLogger($request->id, 2, $request->vendor);
                //  $this->admin_model->sendVendorRejectionMail($data['id'], $this->user);
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
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'vendor' => 'required'
        ]);
        $data['status'] = 4;
        //     $data['status'] = 0;
        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        if ($task) {
            // $this->admin_model->addToLoggerUpdate('job_task', 'id', $data['id'], $this->user);
            if ($task->update($data)) {
                // add to task log
                $this->addToTaskLogger($request->id, 1, $request->vendor);
                //    $this->admin_model->addToTaskLogger($data['id'], 1);
                //    $this->admin_model->sendVendorAcceptanceMail($data['id'], $this->user);
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
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'vendor' => 'required'
        ]);
        $offer = OfferList::where('vendor_list', 'Like', "%$request->vendor,%")->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        if ($offer) {
            $data['status'] = 0;
            // $this->admin_model->addToLoggerUpdate('job_offer_list', 'id', $request->id, $request->vendor);
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
                    //  $this->admin_model->addToLoggerUpdate('job_offer_list', 'id', $data['id'], $this->user);
                    $offer->update($data);
                    //    $this->admin_model->sendVendorAcceptanceMail($insert_id, $this->user);
                    // send to other vendors emails --
                    //   $this->admin_model->SendVendorTaskAlreadyAcceptedEmail($data['id']);

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
        $validator = Validator::make($request->all(), [
            'task_id' => 'required',
            'vendor' => 'required',
            'file' => 'mimes:zip,rar|max:2048',
        ]);

        $data['vendor_notes'] = $request->note ?? '';
        $data['status'] = 5;

        $offer = Task::where('vendor', $request->vendor)->where('id', $request->task_id)->where('job_portal', 1)->where('status', 0)->first();
        if ($offer) {
            if ($request->file('file') != null) {
                $file = $request->file('file');
                $path = $file->store('uploads/jobTaskVendorFiles/', 'public');
                if (!$path) {
                    $msg['type'] = "error";
                    $message = "Error Uploading File, Please Try Again!";
                } else {
                    $data['vendor_attachment'] = $file->hashName();
                }
            }
            //   $this->admin_model->addToLoggerUpdate('job_task', 'id', $data['id'], $this->user);        
            if ($offer->update($data)) {
                //    $evaluation = $this->db->get('vm_setup')->row();
                // $dataEV['vendor_ev_select'] = $_POST['v_ev_select'];
                // $dataEV['vendor_ev_type'] = ($_POST['v_ev_select'] < 5) ? 2 : 1;
                // $dataEV['vendor_note'] = $_POST['v_note'];
                // for ($i = 1; $i <= 6; $i++) {
                // $v_ev_name = "v_ev_name" . $i;
                // $v_ev_per = "v_ev_per" . $i;
                // if ($evaluation->$v_ev_name != null) {
                // $dataEV["vendor_ev_text$i"] = $evaluation->$v_ev_name;
                // $dataEV["vendor_ev_per$i"] = $evaluation->$v_ev_per;
                // $dataEV["vendor_ev_val$i"] = $_POST["v_ev_val$i"] ?? 0;
                // }
                //  }
                /*  $task_ev = $this->db->get_where('task_evaluation', array('task_id' => $data['id']))->row();
            if (empty($task_ev)) {
                // get job task info
                $taskData = $this->admin_model->getData('job_task',['id'=>$data['id'] ,'job_portal' => 1]);
                $jobData = $this->admin_model->getData('job',['id'=>$taskData->job_id]);
                $dataEV['task_id'] = $data['id'];
                $dataEV['project_id'] = $jobData->project_id;
                $dataEV['job_id'] = $taskData->job_id;
                $dataEV['vendor_id'] = $this->user;
                $dataEV['vendor_ev_created_at'] = date("Y-m-d H:i:s");

                $this->db->insert('task_evaluation', $dataEV);
            } else {
                // do edit 
                if ($task_ev->vendor_ev_type == null)
                    $dataEV['vendor_ev_created_at'] = date("Y-m-d H:i:s");
                $this->admin_model->addToLoggerUpdate('task_evaluation', 'task_id', $data['id'], $this->user);
                $this->db->update('task_evaluation', $dataEV, array('task_id' => $data['id']));
            }*/
                // add to task log
                $this->addToTaskLogger($request->task_id, 3, $request->vendor);

                //  $this->admin_model->sendVendorFinishMail($data['id'], $this->user);
                //  $this->admin_model->sendFinishMailForPm($data['id']);
                $msg['type'] = "success";
                $message = "Your Offer Accepted Successfully";
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
        $validator = Validator::make($request->all(), [
            'task_id' => 'required',
            'vendor' => 'required',
            'status' => 'required',
        ]);

        $offer = Task::where('vendor', $request->vendor)->where('id', $request->task_id)->where('job_portal', 1)->where('status', 7)->first();
        if ($offer) {
            $status = $data['status'] = $request->status;
            $data['plan_comment'] = $request->note ?? '';

            //  $this->admin_model->addToLoggerUpdate('job_task', 'id', $data['id'], $this->user);

            if ($offer->update($data)) {
                // add to task log
                $this->addToTaskLogger($request->task_id, $status + 1, $request->vendor);

                // $this->admin_model->sendVendorPlanMail($data['id'], $this->user);

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
        $log_data['created_at'] = date("Y-m-d H:i:s");
        TaskLog::create($log_data);
    }
}
