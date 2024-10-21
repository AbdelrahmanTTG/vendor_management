<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Countries;
use Illuminate\Support\Facades\Validator;
use App\Models\Vendor;

class VendorProfileController extends Controller
{
    public function findCountry(Request $request){
        $id = $request->input('id');
        $Countries = Countries::getColumnValue($id);
        return response()->json($Countries, 201);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'prfx_name' => 'required|string',
            'contact_name' => 'required|string',
            'legal_name' => 'required|string',
            'email' => 'required|email|unique:vendor,email',
            'phone_number' => 'required|string',
            'another_number' => 'nullable|string',
            'contact' => 'nullable|string',
            'region' => 'required|string',
            'country' => 'required|string',
            'nationality' => 'required|string',
            'rank' => 'nullable|string',
            'timezone' => 'nullable|string',
            'street' => 'nullable|string',
            'city' => 'nullable|string',
            'note' => 'nullable|string',
            'address' => 'nullable|string',
            'reject_reason' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $vendor = Vendor::create($request->all());

        return response()->json(['message' => 'Vendor created successfully!', 'vendor' => $vendor], 201);
    }

}
