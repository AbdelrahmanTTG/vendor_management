<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\VmSetup;
use Illuminate\Http\Request;
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

        $vendor = Vendor::findOrFail($request->id);
        $PersonalData = Vendor::with(['country:id,name', 'nationality:id,name'])->findOrFail($request->id);
        if (!$vendor) {
            return response()->json([
                'message' => 'Vendor not found'
            ], 404);
        }
        return response()->json(['vendor' => $vendor,'Data'=> $PersonalData], 200);
    }
}
