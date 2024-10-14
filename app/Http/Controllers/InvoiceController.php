<?php

namespace App\Http\Controllers;

use App\Http\Resources\InvoiceResource;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\VendorInvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{

    public function allInvoices(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
     //   $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where('verified', '!=', 0);
        $query = VendorInvoice::query()->where('vendor_id',  $request->id);
        $Invoices = $query->orderBy('created_at', 'desc')->get();

        //return response()->json(["Invoices" => TaskResource::collection($Invoices)], 200);
        return response()->json(["Invoices" => InvoiceResource::collection($Invoices)], 200);
    }

    public function paidInvoices(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);
      //  $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where('verified', 1);
      $query = VendorInvoice::query()->where('vendor_id',  $request->id)->where('verified', 1);
        $Invoices = $query->orderBy('created_at', 'desc')->get();
       
       // return response()->json(["Invoices" => TaskResource::collection($Invoices)], 200);
        return response()->json(["Invoices" => InvoiceResource::collection($Invoices)], 200);
    }

    public function selectCompletedJobs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor' => 'required'
        ]);
        $jobs = Task::select('id', 'code')->where('vendor',  $request->vendor)->where('job_portal', 1)->where('status', 1)->where(function ($query) {
            $query->where('verified', '=', 2)
                ->orWhereNull('verified');
        })->get();
        return response()->json(["CompletedJobs" => $jobs]);
    }

    public function getSelectedJobData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'task_id' => 'required',
            'vendor' => 'required'

        ]);
        $task = Task::where('vendor', $request->vendor)->where('status', 1)->where('id', $request->task_id)->first();
        return response()->json([
            "Task" => new TaskResource($task)
        ]);
    }

    public function saveInvoice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'jobs' => 'required',
            'vendor' => 'required',
            'payment_method' => 'payment_method',
            'total' => 'total',
            'file' => 'required|mimes:zip,rar|max:2048',
        ]);

        $data['invoice_created_at'] = date("Y-m-d H:i:s");
        $data['verified'] = 3;
        $jobs = $request->jobs;

        if ($request->file('file') != null) {
            $file = $request->file('file');
            $path = $file->store('uploads/invoiceVendorFiles/', 'public');
            if (!$path) {
                $msg['type'] = "error";
                $msg['message'] = "Error Uploading File, Please Try Again!";
                return response()->json($msg);
            } else {
                $data['vpo_file'] = $file->hashName();
            }
        }
        // invoivce data 
       
        $inv['verified'] = 3;
        $inv['vpo_file'] = $data['vpo_file'];
        $inv['vendor_id'] = $request->vendor;
        $inv['payment_method'] = $request->payment_method;
        $inv['total'] = $request->total;
        $inv['invoice_date'] = date("Y-m-d H:i:s");
        $invoice = VendorInvoice::create($inv);
        $insert_id = $invoice->id;
        $data['invoice_id'] = $insert_id;

        for ($i = 0; $i < count($jobs); $i++) {
            $id = $jobs[$i];
            $offer = Task::where('vendor', $request->vendor)->where('id', $id)->where('status', 1)->first();
            if ($offer->update($data)) {
                //  $this->admin_model->addToLoggerUpdate('job_task', 'id', $id, $this->user);
                $msg['type'] = "success";
                $message = "Selected Jobs Added To Invoice Successfully ...";
            } else {
                $msg['type'] = "error";
                $message = "Problem found, please upload invoice file and try Again  ...";
                break;
            }
        }
        if ($msg['type'] = "success") {
            // $this->admin_model->sendVPOMail($jobs, $this->user);
        }
        $msg['message'] = $message;
        return response()->json($msg);
    }
}
