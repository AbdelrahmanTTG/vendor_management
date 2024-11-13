<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Countries;
use App\Models\BillingData;
use App\Models\BankDetails;
use App\Models\WalletsPaymentMethods;
use App\Models\VendorSkill;
use App\Models\Skill;
use Illuminate\Support\Facades\Validator;
use App\Models\Vendor;
use Illuminate\Support\Facades\Crypt;
use App\Events\Message;
use App\Models\Messages;
use App\Models\Experience;
use App\Models\VendorFile;
use App\Models\InstantMessaging;
use App\Http\Controllers\InvoiceController;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
class VendorProfileController extends Controller
{

    public function Vendors(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $vendors = Vendor::select('id', 'name', 'email', 'legal_Name', 'phone_number', 'country', 'nationality')
        ->with(['country:id,name', 'nationality:id,name']);

        if (!empty(request("queryParams"))) {
           foreach(request("queryParams") as $key=> $val){
            if(!empty($val)){
                $vendors = $vendors->where($key, "like", "%" . $val . "%");
            }          
           }           
        }           
        $vendors = $vendors->paginate($perPage);
        // $vendorsArray = $vendors->toArray();
        // foreach ($vendorsArray['data'] as &$vendor) {
        //     $vendor['id'] = Crypt::encrypt($vendor['id']); 
        // }
        // $vendors->setCollection(collect($vendorsArray['data']));
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
            'legal_Name' => 'required|string',
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
            'vendor' => ['id' => $vendor->id, "email" => $vendor->email]
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
            'billing_legal_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'Wallets Payment methods' => 'required_without:bank_name|array|min:1',
            'Wallets Payment methods.*.method' => 'required_without:bank_name|string|max:10',
            'Wallets Payment methods.*.account' => 'required_without:bank_name|string|max:255',
            'bank_name' => 'required_without:Wallets Payment methods|string|max:255',
            'account_holder' => 'required_without:Wallets Payment methods|string|max:255',
            'swift_bic' => 'required_without:Wallets Payment methods|string|max:255',
            'iban' => 'required_without:Wallets Payment methods|string|max:255',
            'payment_terms' => 'required_without:Wallets Payment methods|string|max:255',
            'bank_address' => 'required_without:Wallets Payment methods|string|max:255',
        ]);

        $validator->after(function ($validator) use ($request) {
            if (
                $request->filled('bank_name') ||
                $request->filled('account_holder') ||
                $request->filled('swift_bic') ||
                $request->filled('iban') ||
                $request->filled('payment_terms') ||
                $request->filled('bank_address')

            ) {
                if (
                    empty($request->bank_name) ||
                    empty($request->account_holder) ||
                    empty($request->swift_bic) ||
                    empty($request->iban) ||
                    empty($request->payment_terms) ||
                    empty($request->bank_address)
                ) {
                    $validator->errors()->add('All bank details must be complete if you want to add them.');
                }
            }
        });

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

        if (
            $request->filled('bank_name') &&
            $request->filled('account_holder') &&
            $request->filled('swift_bic') &&
            $request->filled('iban')
        ) {
            $bankDetails = BankDetails::create([
                'billing_data_id' => $billingData->id,
                'bank_name' => $request['bank_name'],
                'account_holder' => $request['account_holder'],
                'swift_bic' => $request['swift_bic'],
                'iban' => $request['iban'],
                'payment_terms' => $request['payment_terms'],
                'bank_address' => $request['bank_address'],
            ]);
        }

        if ($request->has('Wallets Payment methods')) {
            foreach ($request['Wallets Payment methods'] as $wallet) {
                WalletsPaymentMethods::create([
                    'billing_data_id' => $billingData->id,
                    'method' => $wallet['method'],
                    'account' => $wallet['account'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Added successfully!',
        ], 200);
    }
    public function ModificationComplex(Request $request)
    {
        $id = $request->input('id');
        if ($request->input('PersonalData')) {
            $PersonalData = $this->PersonalData($id);
        }
        if ($request->input('BillingData')) {
            $InvoiceController = new InvoiceController();
            $decID = Crypt::encrypt($id);
            $BillingData = $InvoiceController->getVendorBillingData($decID);

        }
        if ($request->input('VMNotes')) {
            $sender_email = app('decrypt')(base64_decode($request->input('VMNotes')['sender_email']));
            $receiver_email = $request->input('VMNotes')['receiver_email'];
            $VMNotes = $this->VMNotes($sender_email, $receiver_email);
        }
        if ($request->input('Experience')) {
            $VendorExperience = $this->getVendorExperience($id);
        }
        if ($request->input('VendorFiles')) {
            $VendorFiles = $this->getVendorFiles($id);
        }
          if ($request->input('InstantMessaging')) {
            $InstantMessaging = $this->getMessagesByVendorId($id);
        }
        
        return response()->json(
            [
                'Data' => $PersonalData ?? null,
                "VMNotes" => $VMNotes ?? null,
                "BillingData" => $BillingData ?? null,
                "Experience" => $VendorExperience ?? null,
                "VendorFiles" => $VendorFiles ?? null,
                "InstantMessaging" => $InstantMessaging ?? null,
            ],
            200
        );

    }
    public function PersonalData($id)
    {
        $vendor = Vendor::with(['country:id,name', 'nationality:id,name', 'region:id,name', 'timezone:id,gmt'])->findOrFail($id);
        if ($vendor) {
            return $vendor;
        }

    }
    public function VMNotes($sender_email, $receiver_email)
    {
        $lastMessage = Messages::getLastMessageBetween($sender_email, $receiver_email);
        if ($lastMessage) {
            return $lastMessage;
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
        $sender_email = app('decrypt')(base64_decode($request->input('sender_id')));
        $receiver_email = $request->input('receiver_id');
        $content = $request->input('content');
        $data = Messages::createMessage(
            $sender_email,
            $receiver_email,
            $content
        );
        event(new Message($content, base64_encode(app('encrypt')($receiver_email))));
        return response()->json(['Message' => "The message has been sent.", "data" => ["id" => $data->id, "content" => $content, "is_read" => 0, "created_at" => $data->created_at]], 200);

    }
    public function deleteWalletsPayment(Request $request)
    {
        return $this->deleteItem($request, WalletsPaymentMethods::class);
    }
    public function deleteSkill(Request $request)
    {
        return $this->deleteItem($request, VendorSkill::class);

    }
    public function updateBillingData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'BillingData_id' => 'required|integer',
            "BankData_id" => 'required|integer',
            'billing_legal_name' => 'required|string|max:255',
            'billing_currency' => 'required|integer',
            'city' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'billing_address' => 'required|string|max:255',
            'account_holder' => 'required|string|max:255',
            'bank_address' => 'nullable|string',
            'bank_name' => 'required|string|max:255',
            'iban' => ['required', 'string', 'regex:/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/'],
            'payment_terms' => 'nullable|string',
            'swift_bic' => ['required', 'string', 'regex:/^[A-Z]{6}[A-Z2-9][A-NP-Z0-9](XXX)?$/'],
            'Wallets Payment methods' => 'required|array|min:1',
            'Wallets Payment methods.*.method' => 'required|string|max:10',
            'Wallets Payment methods.*.account' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $billingData = BillingData::find($request->input("BillingData_id"));
        if (!$billingData) {
            return response()->json(['message' => 'Billing data not found'], 404);
        }
        $BankDetails = BankDetails::find($request->input("BankData_id"));
        if (!$billingData) {
            return response()->json(['message' => 'Billing data not found'], 404);
        }
        $billingData->update($request->only([
            'billing_legal_name',
            'billing_currency',
            'city',
            'street',
            'billing_address',
        ]));
        $BankDetails->update($request->only([
            'bank_name',
            'account_holder',
            'swift_bic',
            'iban',
            'payment_terms',
            'bank_address',
        ]));
        if ($request->has('Wallets Payment methods')) {
            foreach ($request['Wallets Payment methods'] as $wallet) {
                if (isset($wallet['id'])) {
                    $walletUpdate = WalletsPaymentMethods::find($wallet['id']);
                    $walletUpdate->update([
                        'method' => $wallet['method'],
                        'account' => $wallet['account'],
                    ]);
                } else {
                    WalletsPaymentMethods::create([
                        'billing_data_id' => $billingData->id,
                        'method' => $wallet['method'],
                        'account' => $wallet['account'],
                    ]);
                }

            }
        }
        $newWalletsPaymentMethods = WalletsPaymentMethods::where('billing_data_id', $billingData->id)->get();

        return response()->json($newWalletsPaymentMethods, 200);



    }
    public function setPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:vendor,email',
            'password' => 'required|min:6',
        ]);

        $email = $request->input('email');
        $password = $request->input('password');

        $vendor = Vendor::where('email', $email)->first();

        if ($vendor) {
            $vendor->password = base64_encode($password);
            $vendor->save();

            return response()->json(['message' => 'Password updated successfully'], 200);
        }

        return response()->json(['message' => 'Vendor not found'], 404);
    }
    public function AddExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'started_working' => 'required|digits:4',
            'experience_year' => 'required|integer',
            'summary' => 'required|string|max:255',
            'skills' => 'sometimes|required|array|min:1',
            'skills.*.skill' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $experienceData = [
            'vendor_id' => $request->input('vendor_id'),
            'started_working' => $request->input('started_working'),
            'experience_year' => $request->input('experience_year'),
            'summary' => $request->input('summary'),
        ];

        $Experience = Experience::create($experienceData);

        if ($request->has('skills')) {
            foreach ($request['skills'] as $skill) {
                $skillId = is_numeric($skill['skill']) ? $skill['skill'] : Skill::firstOrCreate(['name' => $skill['skill']])->id;

                VendorSkill::create([
                    'vendor_id' => $request->input('vendor_id'),
                    'skill_id' => $skillId,
                ]);
            }
        }

        return response()->json(['message' => 'Experience added successfully!'], 201);
    }
    public function UpdateExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'experience' => 'required|integer',
            'started_working' => 'required|digits:4',
            'experience_year' => 'required|integer',
            'summary' => 'required|string|max:255',
            'skills' => 'sometimes|required|array|min:1',
            'skills.*.skill' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $Experience = Experience::find($request->input("experience"));
        $Experience->update($request->only([
            'started_working',
            'experience_year',
            'summary',
        ]));
        if ($request->has('skills')) {
            foreach ($request['skills'] as $skill) {
                if (isset($skill['id'])) {
                    $skillUpdate = VendorSkill::find($skill['id']);
                    $skillId = is_numeric(value: $skill['skill']) ? $skill['skill'] : Skill::firstOrCreate(['name' => $skill['skill']])->id;
                    $skillUpdate->update([
                        'skill_id' => $skillId,
                    ]);
                } else {
                    $skillId = is_numeric(value: $skill['skill']) ? $skill['skill'] : Skill::firstOrCreate(['name' => $skill['skill']])->id;
                    VendorSkill::create([
                        'vendor_id' => $request->input('vendor_id'),
                        'skill_id' => $skillId,
                    ]);
                }

            }
        }

        $VendorSkill = VendorSkill::where('vendor_id', $request->input("vendor_id"))
            ->with('skill')  
            ->get();

        return response()->json([
            'skills' => $VendorSkill->map(function ($vendorSkill) {
                return [
                    "skill_id" => $vendorSkill->skill->id,
                    'id' => $vendorSkill->id,
                    'name' => $vendorSkill->skill->name,
                ];
            })], 200);
    }
    public function getVendorExperience($vendor_id)
    {
        $experience = Experience::where('vendor_id', $vendor_id)
            ->with(['vendorSkills.skill'])
            ->first();

        if (!$experience) {
            return response()->json(['message' => 'No experience found for this vendor.'], 404);
        }

        $data = [
            'id' => $experience->id,
            'vendor_id' => $experience->vendor_id,
            'started_working' => $experience->started_working,
            'experience_year' => $experience->experience_year,
            'summary' => $experience->summary,
            'skills' => $experience->vendorSkills->map(function ($vendorSkill) {
                return [
                    "skill_id" => $vendorSkill->skill->id,
                    'id' => $vendorSkill->id,
                    'name' => $vendorSkill->skill->name,
                ];
            })
        ];

        return $data;
    }
    public function deleteItem(Request $request, $model)
    {
        if (!$request->has('id')) {
            return response()->json(['message' => 'ID is required.'], 400);
        }

        $id = $request->input('id');
        $modelInstance = $model::find($id);

        if ($modelInstance) {
            $modelInstance->delete();
            return response()->json(['message' => 'Item has been successfully deleted.'], 200);
        } else {
            return response()->json(['message' => 'Item not found.'], 404);
        }
    }
    public function uploadFiles(Request $request)
    {
        if (!$request->hasFile('cv') || !$request->hasFile('nda')) {
            return response()->json(['error' => 'Both CV and NDA files are required.'], 400);
        }

        $cvFile = $request->file('cv');
        $ndaFile = $request->file('nda');

        if ($cvFile->getClientOriginalExtension() !== 'zip' || $cvFile->getSize() > 5 * 1024 * 1024) {
            return response()->json(['error' => 'CV file must be a ZIP file and less than 5MB.'], 400);
        }

        if ($ndaFile->getClientOriginalExtension() !== 'zip' || $ndaFile->getSize() > 5 * 1024 * 1024) {
            return response()->json(['error' => 'NDA file must be a ZIP file and less than 5MB.'], 400);
        }

        DB::beginTransaction();

        try {
            $cvFilePath = $cvFile->store('cv_files');
            $ndaFilePath = $ndaFile->store('nda_files');

            $vendorId = $request->input('vendor_id');
            $vendor = Vendor::find($vendorId);

            if (!$vendor) {
                Storage::delete([$cvFilePath, $ndaFilePath]);
                return response()->json(['error' => 'Vendor not found.'], 404);
            }

            $vendor->cv = $cvFilePath;
            $vendor->nda = $ndaFilePath;
            $vendor->save();

            $additionalFiles = [];
            foreach ($request->all() as $key => $value) {
                if (strpos($key, 'file_') === 0) {
                    $file = $request->file($key);
                    $fileTitle = $request->input("file_title_" . substr($key, 5));
                    $fileContent = $request->input("file_content_" . substr($key, 5));

                    if ($file->getClientOriginalExtension() !== 'zip' || $file->getSize() > 5 * 1024 * 1024) {
                        return response()->json(['error' => 'Each additional file must be a ZIP file and less than 5MB.'], 400);
                    }

                    if ($file) {
                        $filePath = $file->store('other_files');

                        $vendorFile = new VendorFile();
                        $vendorFile->vendor_id = $vendorId;
                        $vendorFile->file_path = $filePath;
                        $vendorFile->file_title = $fileTitle;
                        $vendorFile->file_content = $fileContent;
                        $vendorFile->save();

                        $additionalFiles[] = [
                            'file_path' => $filePath,
                            'file_title' => $fileTitle,
                            'file_content' => $fileContent
                        ];
                    }
                }
            }

            if (!$vendor->wasRecentlyCreated && !$vendorFile->exists) {
                Storage::delete([$cvFilePath, $ndaFilePath]);
                foreach ($additionalFiles as $file) {
                    Storage::delete($file['file_path']);
                }
                DB::rollBack();
                return response()->json(['error' => 'Failed to save vendor or additional files.'], 500);
            }

            DB::commit();

            return response()->json([
                // 'cv_file' => $cvFilePath,
                // 'nda_file' => $ndaFilePath,
                // 'additional_files' => $additionalFiles,
                'message' => 'Files uploaded and vendor updated successfully.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Storage::delete([$cvFilePath, $ndaFilePath]);
            foreach ($additionalFiles as $file) {
                Storage::delete($file['file_path']);
            }

            return response()->json(['error' => 'An error occurred during the file upload or vendor update.'], 500);
        }
    }
    public function getVendorFiles($vendorId)
    {
        $vendor = Vendor::with('vendorFiles')->find($vendorId);
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found.'], 404);
        }
        return [
            'vendor' => [
                'id' => $vendor->id,
                'cv' => $vendor->cv,
                'nda' => $vendor->NDA,
            ],
            'files' => $vendor->vendorFiles->map(function ($file) {
                return [
                    "id" => $file->id,
                    'file_path' => $file->file_path,
                    'file_title' => $file->file_title,
                    'file_content' => $file->file_content,
                ];
            })
        ];
    }
    public function download(Request $request)
    {
        $file = $request->input("filename");
        $directory = dirname($file);
        $fileName = basename($file);

        $filePath = storage_path("app/private/{$directory}/{$fileName}");

        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->download($filePath, $fileName);
    }
    public function deleteFile(Request $request)
    {
        $id = $request->input('id');
        $file = VendorFile::find($id);
        if (!$file) {
            return response()->json(['message' => 'File not found in database'], 404);
        }
        $filePath = $file->file_path;
        if (Storage::exists($filePath)) {
            Storage::delete($filePath);
        } else {
            return response()->json(['message' => 'File not found on server'], 404);
        }
        $file->delete();

        return response()->json(['message' => 'File deleted successfully.'], 200);
    }

    public function updateFiles(Request $request)
    {
        $vendorId = $request->input('vendor_id');
        $vendor = Vendor::find($vendorId);

        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found.'], 404);
        }

        DB::beginTransaction();

        try {
            $cvFilePath = null;
            $ndaFilePath = null;

            if ($request->hasFile('cv')) {
                $cvFile = $request->file('cv');
                if ($cvFile->getClientOriginalExtension() !== 'zip' || $cvFile->getSize() > 5 * 1024 * 1024) {
                    return response()->json(['error' => 'CV file must be a ZIP file and less than 5MB.'], 400);
                }

                if ($vendor->cv && Storage::exists($vendor->cv)) {
                    Storage::delete($vendor->cv);
                }

                $cvFilePath = $cvFile->store('cv_files');
                $vendor->cv = $cvFilePath;  
            }

            if ($request->hasFile('nda')) {
                $ndaFile = $request->file('nda');
                if ($ndaFile->getClientOriginalExtension() !== 'zip' || $ndaFile->getSize() > 5 * 1024 * 1024) {
                    return response()->json(['error' => 'NDA file must be a ZIP file and less than 5MB.'], 400);
                }

                if ($vendor->NDA && Storage::exists($vendor->NDA)) {
                    Storage::delete($vendor->NDA);
                }

                $ndaFilePath = $ndaFile->store('nda_files');
                $vendor->nda = $ndaFilePath;  
            }

            $vendor->save();

            $additionalFiles = [];
            foreach ($request->all() as $key => $value) {
                if (strpos($key, 'file_') === 0) {
                    $file = $request->file($key);
                    $fileId = $request->input("file_id_" . substr($key, 5));  
                    $fileTitle = $request->input("file_title_" . substr($key, 5));
                    $fileContent = $request->input("file_content_" . substr($key, 5));

                    if ($file && ($file->getClientOriginalExtension() !== 'zip' || $file->getSize() > 5 * 1024 * 1024)) {
                        return response()->json(['error' => 'Each additional file must be a ZIP file and less than 5MB.'], 400);
                    }

                    if ($fileId) {
                        $vendorFile = VendorFile::find($fileId);
                        if ($vendorFile) {
                            if ($vendorFile->file_path && Storage::exists($vendorFile->file_path)) {
                                Storage::delete($vendorFile->file_path);
                            }
                            $filePath = $file->store('other_files');
                            $vendorFile->file_path = $filePath;
                            $vendorFile->file_title = $fileTitle;
                            $vendorFile->file_content = $fileContent;
                            $vendorFile->save();
                        } else {
                            return response()->json(['error' => 'File not found for the provided ID.'], 404);
                        }
                    } else {
                        if ($file) {
                            $filePath = $file->store('other_files');

                            $vendorFile = new VendorFile();
                            $vendorFile->vendor_id = $vendorId;
                            $vendorFile->file_path = $filePath;
                            $vendorFile->file_title = $fileTitle;
                            $vendorFile->file_content = $fileContent;
                            $vendorFile->save();

                            $additionalFiles[] = [
                                'file_path' => $filePath,
                                'file_title' => $fileTitle,
                                'file_content' => $fileContent
                            ];
                        }
                    }
                }
            }

            DB::commit();
            $vendorFiles = VendorFile::where('vendor_id', $vendorId)->get();
            return response()->json([
                'message' => 'Files updated and vendor information saved successfully.',
                'additional_files' => $vendorFiles
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            if ($cvFilePath)
                Storage::delete($cvFilePath);
            if ($ndaFilePath)
                Storage::delete($ndaFilePath);
            foreach ($additionalFiles as $file) {
                Storage::delete($file['file_path']);
            }

            return response()->json(['error' => 'An error occurred during the file update.'], 500);
        }
    }

    public function AddinstantMessaging(Request $request){
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'Instant_Messaging' => 'sometimes|required|array|min:1',
            'Instant_Messaging.*.messaging_type_id' => 'required|integer',
            'Instant_Messaging.*.contact' => 'required|string',

        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $vendor_id = $request->input('vendor_id');
        if ($request->has('Instant_Messaging')) {
            foreach ($request['Instant_Messaging'] as $wallet) {
                InstantMessaging::create([
                    "vendor_id"=> $vendor_id,
                    'messaging_type_id' => $wallet['messaging_type_id'],
                    'contact' => $wallet['contact'],
                ]);
            }
        }
        return response()->json(['message' => 'Added successfully.'], 200);

    }
    public function getMessagesByVendorId($vendorId)
    {
        $messages = InstantMessaging::where('vendor_id', $vendorId)
            ->with('messagingType:id,name') 
            ->get();
                    return $messages;
    }
    public function updateMessagesByVendorId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'Instant_Messaging' => 'sometimes|required|array|min:1',
            'Instant_Messaging.*.messaging_type_id' => 'required|integer',
            'Instant_Messaging.*.contact' => 'required|string',

        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $vendor_id = $request->input('vendor_id');
        if ($request->has('Instant_Messaging')) {
            foreach ($request['Instant_Messaging'] as $Messaging) {
                 if (isset($Messaging['id'])) {
                    $MessagingUpdate = InstantMessaging::find($Messaging['id']);
                    $MessagingUpdate->update([
                        'messaging_type_id' => $Messaging['messaging_type_id'],
                        'contact' => $Messaging['contact'],
                    ]);
                } else {
                    InstantMessaging::create([
                        "vendor_id" => $vendor_id,
                        'messaging_type_id' => $Messaging['messaging_type_id'],
                        'contact' => $Messaging['contact'],
                    ]);
                }
            }
        }
        $data = $this->getMessagesByVendorId($vendor_id);
        return response()->json($data, 200);
    }
    public function deleteMessagesByVendorId(Request $request){
        return $this->deleteItem($request, InstantMessaging::class);

    }








}
