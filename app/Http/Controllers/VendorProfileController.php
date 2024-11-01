<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Countries;
use App\Models\BillingData;
use App\Models\BankDetails;
use App\Models\WalletsPaymentMethods;
use Illuminate\Support\Facades\Validator;
use App\Models\Vendor;
use Illuminate\Support\Facades\Crypt;
use App\Events\Message;
use App\Models\Messages;

class VendorProfileController extends Controller
{

    public function Vendors(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $vendors = Vendor::select('id', 'name', 'email', 'legal_Name', 'phone_number', 'country', 'nationality')
            ->with(['country:id,name', 'nationality:id,name'])
            ->paginate($perPage);
        return response()->json($vendors);
    }
    public function findCountry(Request $request)
    {
        $id = $request->input('id');
        $Countries = Countries::getColumnValue($id);
        return response()->json($Countries, 201);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'type' => 'required|string',
            'status' => 'required|string',
            'prfx_name' => 'required|string',
            'contact_name' => 'required|string',
            'legal_name' => 'required|string',
            'email' => 'required|email|unique:vendor,email',
            'phone_number' => 'required|string',
            // 'another_number' => 'nullable|string',
            'contact_linked_in' => 'required|string',
            'contact_ProZ' => 'required|string',
            'region' => 'required|int',
            'country' => 'required|int',
            'nationality' => 'required|int',
            // 'rank' => 'nullable|string',
            'timezone' => 'nullable|int',
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
        // $encryptedId = Crypt::encrypt($vendor->id);

        return response()->json([
            'message' => 'Vendor created successfully!',
            'vendor' => ['id' => $vendor->id,"email"=> $vendor->email]
        ], 201);
    }
    public function updatePersonalInfo(Request $request)
    {
        if (!$request->has('id')) {
            return response()->json([
                'message' => 'ID is required'
            ], 400);
        }
        $id = $request->input('id');
        $vendor = Vendor::findOrFail($id);
        if (!$vendor) {
            return response()->json([
                'message' => 'Vendor not found'
            ], 404);
        }
        // $validator = Validator::make($request->all(), [
        //     'name' => 'required|string',
        //     'type' => 'required|string',
        //     'status' => 'required|string',
        //     'prfx_name' => 'required|string',
        //     'contact_name' => 'required|string',
        //     'legal_name' => 'required|string',
        //     'phone_number' => 'required|string',
        //     'contact' => 'required|string',
        //     'region' => 'required|int',
        //     'country' => 'required|int',
        //     'nationality' => 'required|int',
        //     'timezone' => 'nullable|int',
        //     'street' => 'nullable|string',
        //     'city' => 'nullable|string',
        //     'note' => 'nullable|string',
        //     'address' => 'nullable|string',
        //     'reject_reason' => 'nullable|string',
        // ]);
        // if ($validator->fails()) {
        //     return response()->json($validator->errors(), 422);
        // }

        $vendor->update($request->all());

        return response()->json([
            'message' => 'Vendor updated successfully!',
            'vendor' => ['id' => $vendor->id]
        ], 200);
    }
    public function storeBilling(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'account_holder' => 'required|string|max:255',
            'bank_address' => 'nullable|string',
            'bank_name' => 'required|string|max:255',
            'billing_address' => 'nullable|string',
            'billing_legal_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'iban' => ['required', 'string', 'regex:/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/'],
            'payment_terms' => 'nullable|string',
            'street' => 'required|string|max:255',
            'swift_bic' => ['required', 'string', 'regex:/^[A-Z]{6}[A-Z2-9][A-NP-Z0-9](XXX)?$/'],
            'Wallets Payment methods' => 'required|array|min:1',
            'Wallets Payment methods.*.method' => 'required|string|max:10',
            'Wallets Payment methods.*.account' => 'required|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $billingData = BillingData::create([
            'vendor_id' => $request['vendor_id'],
            'billing_legal_name' => $request['billing_legal_name'],
            'billing_currency' => $request['billing_currency'],
            'city' => $request['city'],
            'street' => $request['street'],
            'billing_address' => $request['billing_address'],
        ]);
        $bankDetails = BankDetails::create([
            'billing_data_id' => $billingData->id,
            'bank_name' => $request['bank_name'],
            'account_holder' => $request['account_holder'],
            'swift_bic' => $request['swift_bic'],
            'iban' => $request['iban'],
            'payment_terms' => $request['payment_terms'],
            'bank_address' => $request['bank_address'],
        ]);
        foreach ($request['Wallets Payment methods'] as $wallet) {
            WalletsPaymentMethods::create([
                'billing_data_id' => $billingData->id,
                'method' => $wallet['method'],
                'account' => $wallet['account'],
            ]);
        }
        return response()->json([
            'message' => 'Added successfully!',
        ], 200);
    }


    public function ModificationComplex(Request $request){
        $id = $request->input('id');
        if($request->input('PersonalData')){
            $PersonalData = $this->PersonalData($id);
        }
        if ($request->input('BillingData')) {
            // $BillingData = $this->BillingData($id);
        }
        return response()->json(['Data'=> $PersonalData], 200);

    }
    public function PersonalData($id)
    {
        $vendor = Vendor::with(['country:id,name', 'nationality:id,name' , 'region:id,name' , 'timezone:id,gmt'])->findOrFail($id);
        if($vendor){
            return $vendor;
        }
        
    }

    public function Message_VM_to_Vendor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sender_id' => 'required|string|max:255',
            'receiver_id' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $senderId = app('decrypt')(base64_decode($request->input('sender_id'))) ;
        $receiverId = $request->input('receiver_id');
        $content = $request->input('content');
        Messages::createMessage(
            $senderId,
            $receiverId,
            $content
        );
        event(new Message($content, base64_encode(app('encrypt')($receiverId) )));
        return response()->json(['Message'=> "The message has been sent."],200);
       
    }
 
}
