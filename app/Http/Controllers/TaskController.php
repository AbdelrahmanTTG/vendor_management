<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use App\Models\OfferList;
use App\Models\Task;
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
        $task = Task::where('vendor', $request->vendor)->where('id', $request->id)->where('job_portal', 1)->first();
        return response()->json([
            "Task" => new TaskResource($task),
            "Timeline" => $task->conversation,
            "JobHisory" => $task->log,
        ], 200);
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
        if ($task) {
            // $this->admin_model->addToLoggerUpdate('job_task', 'id', $data['id'], $this->user);
            if ($task->update($data)) {
                //  add to task log
                //  $this->admin_model->addToTaskLogger($data['id'], 2);
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
                if (Task::create($job_data)) {
                    $insert_id = $task->id;
                    // add to task log
                    //   $this->admin_model->addToTaskLogger($insert_id, 1);
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
