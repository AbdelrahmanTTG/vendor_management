<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\OfferList;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Vendor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

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

    public function allJobOffers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 4);
        $tasks = $query->orderBy('created_at', 'desc')->get();

        // $data['jobOfferVL'] = $this->db->query("select * from job_offer_list where status = 4 and job_portal = 1 and vendor_list Like '%$this->user,%'")->result();
        // ->paginate(10);
        return response()->json(["Tasks" => TaskResource::collection($tasks)], 200);
    }

    public function allClosedJobs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1);
        $tasks = $query->orderBy('created_at', 'desc')->get();
        return response()->json(["Tasks" => TaskResource::collection($tasks)], 200);
    }

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
    public function ViewOffer(Request $request)
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
  * View Job Task
  */
    public function ViewJob(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'vendor' => 'required'           
        ]);
        

        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->first();
        // $data['timeline'] = $this->db->get_where('job_task_conversation', array('task' => $data['jobID']))->result();
        // $data['jobHisory'] = $this->db->get_where('job_task_log', array('task' => $data['jobID']))->result();
        return response()->json(["Task" => new TaskResource($task)], 200);
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
       
        $data['status'] = 4;
     //   $data['status'] = 3;
        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->where('status', 4)->first();
        
       // $this->admin_model->addToLoggerUpdate('job_task', 'id', $data['id'], $this->user);
       
        if ($task->update($data)) {
            //  add to task log
          //  $this->admin_model->addToTaskLogger($data['id'], 2);
          //  $this->admin_model->sendVendorRejectionMail($data['id'], $this->user);
            $msg['type'] = "success";           
            $message = "Your Offer Rejected Successfully";           
           
        } else {
            $msg['type'] = "Error";           
            $message = "Error Cancelling Offer Job, Please Try Again!";           
           
        }
        $msg['message'] = $message;    
        echo json_encode($msg);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
