<?php

namespace App\Http\Controllers;

use App\Models\Messages;
use App\Models\Vendor;
use App\Models\VmSetup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class PortalAdminController extends Controller
{

    public function getSettingsData()
    {
        $vmConfig = VmSetup::first();
        return response()->json(["vmConfig" => $vmConfig]);
    }

    public function saveSettings(Request $request)
    {
        $vmConfig = VmSetup::first();
        if (!$request->has('enable_evaluation')) {
            $request->request->add(['enable_evaluation' => '0']);
        }

        if ($vmConfig->update($request->all())) {
            $msg['type'] = "success";
            $message = "Settings Updated Successfully  ...";
        } else {
            $msg['type'] = "error";
            $message = "Failed To Update Vendor Management Settings ...";
        }

        $msg['message'] = $message;
        return response()->json($msg);
    }

    public function savePassword(Request $request)
    {
        $niceNames = array(
            'new_pass' => 'New Password',
            'old_pass' => 'Current Password',
        );
        $validator = Validator::make($request->all(), [
            'old_pass' => 'required',
            'new_pass' => 'required|string|min:6',
        ]);
        $validator->setAttributeNames($niceNames);

        if ($validator->fails()) {
            $msg['type'] = "error";
            $message = "";
            foreach ($validator->errors()->all() as $err) {
                $message .= $err;
            }
        } else {
            $request['id'] = Crypt::decrypt($request->id);
            $vendor = Vendor::findOrFail($request->id);
            if ($vendor->password == base64_encode($request->old_pass)) {
                $vendor_data['password'] = base64_encode($request->new_pass);
                if ($vendor->update($vendor_data)) {
                    $msg['type'] = "success";
                    $message = "Password Updated Successfully";
                } else {
                    $msg['type'] = "error";
                    $message = "Failed To Update,Please Try Again ...";
                }
            } else {
                $msg['type'] = "error";
                $message = "Current Password incorrect,Please try again ...";
            }
        }
        $msg['message'] = $message;
        return response()->json($msg);
    }

    public function getVendorData(Request $request)
    {
        $request['id'] = Crypt::decrypt($request->id);
        $vendor = Vendor::findOrFail($request->id);
        $PersonalData = Vendor::with(['country:id,name', 'nationality:id,name'])->findOrFail($request->id);
        if (!$vendor) {
            return response()->json([
                'message' => 'Vendor not found'
            ], 404);
        }
        return response()->json(['vendor' => $vendor,'Data'=> $PersonalData], 200);
    }

    public function getUnReadVMNotes(Request $request)
    {
        $limit = $request->limit;
        $messages = Messages::getUnReadMessages(app('decrypt')(base64_decode($request->email)),$limit);
        return response()->json($messages, 200);
            
    }
    public function getVmNotes(Request $request)
    {
        $messages = Messages::where('receiver_email', app('decrypt')(base64_decode($request->email)))
            ->where('status', 1)
            ->get();
        return response()->json(['Notes' =>$messages], 200);
            
    }
    public function readVmNotes(Request $request)
    {       
        $message = Messages::find($request->message_id);
        if($message->update(['is_read'=>'1'])){
            $msg['type'] = "success";
            $msg['message'] = "Note Marked Read Successfully";
        }else{
            $msg['type'] = "error";
            $msg['message'] = "Failed To Update,Please Try Again ...";
        }
       
        return response()->json($msg);
            
    }
}
