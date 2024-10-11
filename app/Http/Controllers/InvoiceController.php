<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{

    public function allInvoices(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
        $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where('verified', '!=', 0);
        $Invoices = $query->orderBy('created_at', 'desc')->get();
        // ->paginate(10);
        return response()->json(["Invoices" => TaskResource::collection($Invoices)], 200);
    }
    
    public function paidInvoices(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);      
        $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where('verified', 1);
        $Invoices = $query->orderBy('created_at', 'desc')->get();
        // ->paginate(10);
        return response()->json(["Invoices" => TaskResource::collection($Invoices)], 200);
    }
}
