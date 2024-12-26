<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\PortalMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $request['user'] = Crypt::decrypt($request->user);
        $query = DB::table('vendor_aval_det as det')->select('brand.name as brand_name','tot.id', 'tot.created_at', 'tot.duration','tot.email_from', 'tot.attach_file', 'tot.email_subject', 'det.id as detid')
            ->join('vendor_aval_tot as tot', 'det.tot_id', '=', 'tot.id')
            ->leftJoin('brand', 'tot.brand', '=', 'brand.id')
            ->where('det.vendor', $request->user)
            ->where('tot.status', 1)
            ->where(function ($q) {
                $q->where('det.status', '')
                    ->orWhere('det.status', null)
                    ->orWhere('det.status', '0');
            });
        $availabilityCheck = ($query->count() > 0) ? $query->get() : [];
        return response()->json([
            "List" => $availabilityCheck,
        ], 200);
    }

    public function viewAvailabilityCheck(Request $request)
    {
        $request['user'] = Crypt::decrypt($request->user);
        $id = $request->id;
        $availabilityCheck = DB::table('vendor_aval_det as det')->select('tot.id','tot.email_body','tot.status', 'tot.created_at', 'tot.duration','tot.email_from', 'tot.attach_file', 'tot.email_subject', 'det.id as detid')
            ->join('vendor_aval_tot as tot', 'det.tot_id', '=', 'tot.id')
            ->where('det.vendor', $request->user)
            ->where('tot.status', 1)
            ->where('det.id', $id)
            ->first();

        return response()->json([
            "availabilityPage" => $availabilityCheck ?? [],
        ], 200);
    }

    public function acceptAvailability(Request $request)
    {
        $request['user'] = Crypt::decrypt($request->user);
        $id = $request->id;
        $availabilityCheck = DB::table('vendor_aval_det as det')->select('tot.email_from', 'tot.email_cc', 'tot.email_subject', 'det.email', 'det.name', 'det.id as detid')
            ->join('vendor_aval_tot as tot', 'det.tot_id', '=', 'tot.id')
            ->where('det.vendor', $request->user)
            ->where('tot.status', 1)
            ->where('det.id', $id)
            ->first();
        if ($availabilityCheck) {
            $row = DB::table('vendor_aval_det as det')->where('det.id', $id);
            $data['status'] = 2;
            if ($row->update($data)) {
                $msg['type'] = "success";
                $msg['message'] = "Record Accepted Successfully";
                // send email              
                $cc = rtrim(str_replace('.com', '.com,', $availabilityCheck->email_cc), ",");
                $ccArray = explode(',', $cc);
                Mail::send('emails.portalMail', array("body" => 'Vendor Acception : ' . $availabilityCheck->name), function ($message) use ($availabilityCheck, $ccArray) {
                    $message->to($availabilityCheck->email_from)->cc($ccArray)->subject($availabilityCheck->email_subject . " - Acception");
                    // if (!empty($availabilityCheck->email)) {
                    //     $message->from($availabilityCheck->email);
                    // }
                });
            } else {
                $msg['type'] = "error";
                $msg['message'] = "Error Accepting , Please Try Again!";
            }
        } else {
            $msg['type'] = "error";
            $msg['message'] = "Error, Please Try Again!";
        }
        return response()->json($msg);
    }

    public function rejectAvailability(Request $request)
    {
        $request['user'] = Crypt::decrypt($request->user);
        $id = $request->id;
        $availabilityCheck = DB::table('vendor_aval_det as det')->select('tot.email_from', 'tot.email_cc', 'tot.email_subject', 'det.email', 'det.name', 'det.id as detid')
            ->join('vendor_aval_tot as tot', 'det.tot_id', '=', 'tot.id')
            ->where('det.vendor', $request->user)
            ->where('tot.status', 1)
            ->where('det.id', $id)
            ->first();
        if ($availabilityCheck) {
            $row = DB::table('vendor_aval_det as det')->where('det.id', $id);
            $data['status'] = 1;
            $note = $data['reasons'] = $request->note;
            if ($row->update($data)) {
                $msg['type'] = "success";
                $msg['message'] = "Your Reply Sent Successfully";
                // send email              
                $cc = rtrim(str_replace('.com', '.com,', $availabilityCheck->email_cc), ",");
                $ccArray = explode(',', $cc);
                Mail::send('emails.portalMail', array("body" => $note ), function ($message) use ($availabilityCheck, $ccArray) {
                    $message->to($availabilityCheck->email_from)->cc($ccArray)->subject($availabilityCheck->email_subject . " - The reason for rejection.");
                    // if (!empty($availabilityCheck->email)) {
                    //     $message->from($availabilityCheck->email);
                    // }
                });
            } else {
                $msg['type'] = "error";
                $msg['message'] = "Error , Please Try Again!";
            }
        } else {
            $msg['type'] = "error";
            $msg['message'] = "Error, Please Try Again!";
        }
        return response()->json($msg);
      

      
    }
}
