<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {       
        // $data['pageMainTitle'] = "All Jobs";
       // $query = Task::query()->where('vendor',  Auth::id())->where('job_portal',1)->where('status', '!=',6);
        $query = Task::query()->where('job_portal',1)->where('status', '!=',6);
        $tasks = $query->orderBy('created_at', 'desc')
            ->paginate(10);
   
                                                                                   
           
    
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
