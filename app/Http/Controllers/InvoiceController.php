<?php

namespace App\Http\Controllers;

use App\Http\Resources\InvoiceResource;
use App\Http\Resources\TaskResource;
use App\Mail\PortalMail;
use App\Models\BankDetails;
use App\Models\BillingData;
use App\Models\Brand;
use App\Models\Logger;
use App\Models\Task;
use App\Models\Vendor;
use App\Models\VendorInvoice;
use App\Models\VendorPaymentMethod;
use App\Models\VmSetup;
use App\Models\WalletsPaymentMethods;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;


class InvoiceController extends Controller
{
    protected $per_page;

    public function __construct()
    {
        $this->per_page = 10;
    }

    public function allInvoices(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['id'] = 0;
        } else {
            $vendorID = $request['id'] = Crypt::decrypt($request->id);
        }
        //   $query = Task::query()->where('vendor',  $request->id)->where('job_portal', 1)->where('status', 1)->where('verified', '!=', 0);
        $query = VendorInvoice::query();
        if ($vendorID != 0) {
            $query = $query->where('vendor_id',  $request->id);
        }
        $Invoices = $query->orderBy('created_at', 'desc')->paginate($this->per_page);
        $links = $Invoices->linkCollection();

        return response()->json([
            "Invoices" => InvoiceResource::collection($Invoices),
            "Links" => $links,
        ], 200);
    }

    public function paidInvoices(Request $request)
    {
        if (isset($request['userType']) && $request['userType'] == 'admin') {
            $vendorID = $request['id'] = 0;
        } else {
            $vendorID = $request['id'] = Crypt::decrypt($request->id);
        }
        $query = VendorInvoice::query()->where('verified', 1);
        if ($vendorID != 0) {
            $query = $query->where('vendor_id',  $request->id);
        }
        $Invoices = $query->orderBy('created_at', 'desc')->paginate($this->per_page);
        $links = $Invoices->linkCollection();

        return response()->json([
            "Invoices" => InvoiceResource::collection($Invoices),
            "Links" => $links,
        ], 200);
    }

    public function selectCompletedJobs(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
        $brand_id = $request->brand;
        $jobs = Task::select('id', 'code')->where('vendor',  $request->vendor)->where('job_portal', 1)->where('status', 1)->where(function ($query) {
            $query->where('verified', '=', 2)
                ->orWhereNull('verified');
        })->where(function ($query)use ($brand_id) {
            $query->whereHas('job.project.customer', function ($q) use ($brand_id) {
                $q->where('brand', $brand_id);
            })->orWhere('brand',$brand_id);
        })->get();
        return response()->json(["CompletedJobs" => $jobs]);
    }

    public function getSelectedJobData(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);
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
            $vendorId = Crypt::decrypt($request->vendor);
            $billingData = BillingData::where('vendor_id', $vendorId)->first();
            $bankIsEmpty = false;
            $walletIsEmpty = false;
            if($billingData->bank_required ==1){
                $bankIsEmpty = empty($request->bank_name) || empty($request->bank_account_holder)
                    || empty($request->bank_swift) || empty($request->bank_IBAN) || empty($request->bank_address);
            }
            if($billingData->wallet_required ==1){
                $walletIsEmpty = empty($request->wallet_method) || empty($request->wallet_account);
            }

            $walletIsEmpty = empty($request->wallet_method) || empty($request->wallet_account);

            if ($bankIsEmpty && $walletIsEmpty) {
                $msg['type'] = "error";
                $message = "Please enter either full Bank Account details or full Wallet details!";
            } else {
                $data['invoice_created_at'] = date("Y-m-d H:i:s");
                $data['invoice_date'] = date("Y-m-d H:i:s");
                $data['verified'] = 3;
                $jobs = $request->jobs;

                if ($request->file('file') != null) {
                    $file = $request->file('file');
                    // $path = $file->store('uploads/invoiceVendorFiles/', 'public');
                    $folderPath = storage_path('app/external/invoiceVendorFiles');
                    if (!file_exists($folderPath)) {
                        mkdir(
                            $folderPath,
                            0777,
                            true
                        );
                    }
                    $path = $file->store('invoiceVendorFiles/', 'external');
                    if (!$path) {
                        $msg['type'] = "error";
                        $msg['message'] = "Error Uploading File, Please Try Again!";
                        return response()->json($msg);
                    } else {
                        $data['vpo_file'] = $file->hashName();
                    }
                }
                // invoice data 
                $request['vendor'] = Crypt::decrypt($request->vendor);
                $billingData = BillingData::where('vendor_id', $request->vendor)->first();
                $inv['verified'] = 3;
                $inv['vpo_file'] = $data['vpo_file'];
                $inv['vendor_id'] = $request->vendor;
                $inv['payment_method'] = $request->payment_method;
                $inv['total'] = $request->total;
                $inv['invoice_date'] = date("Y-m-d H:i:s");
                $inv['billing_legal_name'] = $billingData->billing_legal_name ?? '';
                $inv['billing_address'] = $billingData->billing_address ?? '';
                $inv['billing_currency'] = $billingData->billing_currency ?? '';
                $inv['billing_due_date'] = $billingData->billing_due_date ?? '';
                $inv['bank_name'] = $request->bank_name;
                $inv['bank_account_holder'] = $request->bank_account_holder;
                $inv['bank_swift'] = $request->bank_swift;
                $inv['bank_IBAN'] = $request->bank_IBAN;
                $inv['bank_address'] = $request->bank_address;
                $inv['wallet_method'] = $request->wallet_method;
                $inv['wallet_account'] = $request->wallet_account;
                $inv['brand_id'] = 0;
                $invoice = VendorInvoice::create($inv);
                $insert_id = $invoice->id;
                $data['invoice_id'] = $insert_id;

                for ($i = 0; $i < count($jobs); $i++) {
                    $id = $jobs[$i];
                    $offer = Task::where('vendor', $request->vendor)->where('id', $id)->where('status', 1)->first();
                    $brand['brand_id'] = !empty($offer->brand) ? $offer->brand : $offer->getTaskBrandId();
                    $data['brand'] = !empty($offer->brand) ? $offer->brand : $offer->getTaskBrandId();
                    $invoice->update($brand);
                    if ($offer->update($data)) {
                        Logger::addToLoggerUpdate('job_task', 'id', $id, $request->vendor);
                        $msg['type'] = "success";
                        $message = "Selected Jobs Added To Invoice Successfully ...";
                    } else {
                        $msg['type'] = "error";
                        $message = "Problem found, please upload invoice file and try Again  ...";
                        break;
                    }
                }
                if ($msg['type'] = "success") {
                    // get config & vendor email
                    $tasks = Task::whereIn('id', $jobs)->get();
                    $vmConfig = VmSetup::first();
                    $vendorEmail = Vendor::select('email')->where('id', $request->vendor)->get();
                    $mailData = [
                        'subject' => $vmConfig->pe_invoice_subject,
                        'title' => 'New Invoice',
                        'body' =>  $vmConfig->pe_invoice_body,
                        'taskDetails' => $tasks,
                        'invoiveData' => VendorInvoice::find($insert_id)

                    ];
                    Mail::to($vendorEmail)->cc($vmConfig->accounting_email)->send(new PortalMail($mailData));
                }
            }
        }

        $msg['message'] = $message;
        return response()->json($msg);
    }

    public function getVendorBillingData($id)
    {

        $id = Crypt::decrypt($id);
        $vendor_payment_methods = VendorPaymentMethod::select('id','name')->where('Active',1)->get();
        $billingData = BillingData::where('vendor_id', $id)
            ->with(['bankDetail', 'walletPaymentMethod.method', 'currency:id,name'])
            ->first();

        if ($billingData) {
            $billingData->billing_currency = $billingData->currency ?? null;

            unset($billingData->currency);

            $bankData = $billingData->bankDetail ?? '';
            $walletData = $billingData->walletPaymentMethod ?? '';
        } else {
            $bankData = '';
            $walletData = '';
        }
        $vmConfig = VmSetup::first();
        return [
            "billingData" => $billingData ?? '',
            "bankData" => $bankData,
            "walletData" => $walletData,
            "vendor_payment_methods" => $vendor_payment_methods,
             "amount" =>  $vmConfig ? $vmConfig->amount : ''
        ];
    }

    public function getPendingTasksCount(Request $request)
    {
        $request['vendor'] = Crypt::decrypt($request->vendor);        
        $brands = Brand::select('id', 'name')->get();
        foreach ($brands as $brand) {
            $pendingTasks[$brand->id]['brand_id'] = $brand->id;
            $pendingTasks[$brand->id]['brand_name'] = $brand->name;
            $pendingTasks[$brand->id]['count'] = Task::where('vendor',  $request->vendor)->where('job_portal', 1)->where('status', 1)->where(function ($query) {
                $query->where('verified', '=', 2)
                    ->orWhereNull('verified');
            })->where(function ($query)use ($brand) {
                $query->whereHas('job.project.customer', function ($q) use ($brand) {
                    $q->where('brand', $brand->id);
                })->orWhere('brand',$brand->id);
            })->count();          
        }
        $data = array_filter($pendingTasks, function ($item) {
            return $item['count'] >= 1;
        });
        return response()->json($data);
    }
}
