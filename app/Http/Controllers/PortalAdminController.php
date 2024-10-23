<?php

namespace App\Http\Controllers;

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
        if(!$request->has('enable_evaluation')){
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
}
