<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
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
