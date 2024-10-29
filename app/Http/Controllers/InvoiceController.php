<?php

namespace App\Http\Controllers;

use App\Http\Resources\InvoiceResource;
use App\Http\Resources\TaskResource;
use App\Models\BankDetails;
use App\Models\BillingData;
use App\Models\Task;
use App\Models\VendorInvoice;
use App\Models\WalletsPaymentMethods;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use function PHPUnit\Framework\isEmpty;

class InvoiceController extends Controller
{

    public function allInvoices(Request $request)
    {
        //   $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where('verified', '!=', 0);
        $query = VendorInvoice::query()->where('vendor_id',  $request->id);
        $Invoices = $query->orderBy('created_at', 'desc')->get();

        //return response()->json(["Invoices" => TaskResource::collection($Invoices)], 200);
        return response()->json(["Invoices" => InvoiceResource::collection($Invoices)], 200);
    }

    public function paidInvoices(Request $request)
    {
        //  $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where('verified', 1);
        $query = VendorInvoice::query()->where('vendor_id',  $request->id)->where('verified', 1);
        $Invoices = $query->orderBy('created_at', 'desc')->get();

        // return response()->json(["Invoices" => TaskResource::collection($Invoices)], 200);
        return response()->json(["Invoices" => InvoiceResource::collection($Invoices)], 200);
    }

    public function selectCompletedJobs(Request $request)
    {
        $jobs = Task::select('id', 'code')->where('vendor',  $request->vendor)->where('job_portal', 1)->where('status', 1)->where(function ($query) {
            $query->where('verified', '=', 2)
                ->orWhereNull('verified');
        })->get();
        return response()->json(["CompletedJobs" => $jobs]);
    }

    public function getSelectedJobData(Request $request)
    {
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
            'payment_method' => 'required',
            'total' => 'required',
            'file' => 'required|mimes:zip,rar|max:2048',
        ]);
        if ($validator->fails()) {
            $msg['type'] = "error";
            $message = "";
            foreach ($validator->errors()->all() as $err) {
                $message .= $err;
            }
        } else {
            if ($request->payment_method == 0 && (empty($request->bank_name) || empty($request->bank_account_holder)
                || empty($request->bank_swift) || empty($request->bank_IBAN) || empty($request->bank_address)
            )) {
                $msg['type'] = "error";
                $message = "Please Enter Bank Account Details!";
            } elseif ($request->payment_method == 1 && (empty($request->wallet_method) || empty($request->wallet_account))) {
                $msg['type'] = "error";
                $message = "Please Enter Wallet Details!";
            } else {
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
                // invoice data 
                $billingData = BillingData::where('vendor_id', $request->vendor)->first();
                $inv['verified'] = 3;
                $inv['vpo_file'] = $data['vpo_file'];
                $inv['vendor_id'] = $request->vendor;
                $inv['payment_method'] = $request->payment_method;
                $inv['total'] = $request->total;
                $inv['invoice_date'] = date("Y-m-d H:i:s");
                $inv['billing_legal_name'] = $billingData->billing_legal_name;
                $inv['billing_address'] = $billingData->billing_address;
                $inv['billing_currency'] = $billingData->billing_currency ?? '';
                $inv['billing_due_date'] = $billingData->billing_due_date ?? '';
                $inv['bank_name'] = $request->bank_name;
                $inv['bank_account_holder'] = $request->bank_account_holder;
                $inv['bank_swift'] = $request->bank_swift;
                $inv['bank_IBAN'] = $request->bank_IBAN;
                $inv['bank_address'] = $request->bank_address;
                $inv['wallet_method'] = $request->wallet_method;
                $inv['wallet_account'] = $request->wallet_account;
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
            }
        }

        $msg['message'] = $message;
        return response()->json($msg);
    }

    public function getVendorBillingData(Request $request)
    {
        $billingData = BillingData::where('vendor_id', $request->vendor)->first();
        if ($billingData) {
            $bankData = BankDetails::where('billing_data_id', $billingData->id)->first();
            $walletData = WalletsPaymentMethods::where('billing_data_id', $billingData->id)->first();
        }
        return response()->json([
            "billingData" => ($billingData),
            "bankData" => ($bankData ?? ''),
            "walletData" => ($walletData ?? ''),
        ]);
    }
}
