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
use App\Models\TaskType;
use App\Models\VendorSheet;
use App\Models\VendorTest;
use App\Models\VendorEducation;
use App\Models\Formatstable;


use App\Http\Controllers\InvoiceController;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class VendorProfileController extends Controller
{
    public function format($request){
            try {
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;
            } catch (JWTException $e) {
        return response()->json(['error' => 'Token is invalid or expired'], 401);
                }
            $tableName = $request->input('table');
            $formats = DB::table('formatsTable')
                ->where('user_id', $userId)
                ->where('table', $tableName)
                ->get();
                return $formats;
            }
 public function Vendors(Request $request)
{
    try {
        $formats = $this->format($request);
        $filteredFormats = $formats->filter(function ($format) {
            return $format->status == 1;
        });

        if ($filteredFormats->isEmpty()) {
            $formatArray = ['name', 'email', 'status', 'type', 'country'];
        } else {
            $formatArray = $filteredFormats->pluck('format')->toArray();
            $formatArray = array_merge(...array_map(function ($item) {
                return explode(',', $item);
            }, $formatArray));
        }

        $relationships = [
            'country' => ['id', 'name'],
            'nationality' => ['id', 'name'],
            'region' => ['id', 'name'],
            "timezone" => ['id', 'gmt'],
        ];

        $vendorsQuery = Vendor::select('id')->addSelect(DB::raw(implode(',', $formatArray)));

        foreach ($relationships as $relation => $columns) {
            if (in_array($relation, $formatArray)) {
                $vendorsQuery->with([$relation => function ($query) use ($columns) {
                    $query->select($columns);
                }]);
            }
        }

     if ($request->has('queryParams') && is_array($request->queryParams)) {
    $queryParams = $request->queryParams;

    foreach ($queryParams as $key => $val) {
        if ($key !== 'filters' && !empty($val)) {
            if (!in_array($key, $formatArray)) {
                $vendorsQuery->addSelect($key);
                $formatArray[] = $key;
            }

            if (is_array($val)) {
                $vendorsQuery->where(function ($query) use ($key, $val) {
                    foreach ($val as $k => $v) {
                        if ($k == 0) {
                            $query->where($key, "like", "%" . $v . "%");
                        } else {
                            $query->orWhere($key, "like", "%" . $v . "%");
                        }
                    }
                });
            } else {
                $vendorsQuery->where($key, "like", "%" . $val . "%");
            }

            if (array_key_exists($key, $relationships)) {
                $vendorsQuery->with([$key => function ($query) use ($key, $relationships) {
                    $query->select($relationships[$key]);
                }]);
            }
        }
    }

if (isset($queryParams['filters']) && is_array($queryParams['filters']) && !empty($queryParams['filters'])) {
    foreach ($queryParams['filters'] as $filter) {
        if (method_exists(Vendor::class, $filter['table'])) {
            $table = $filter['table'];
            $vendorsQuery->whereHas($table, function ($query) use ($filter) {
                $query->where(function ($query) use ($filter) {
                    foreach ($filter['columns'] as $columnFilter) {
                        if (!empty($columnFilter['column']) && !empty($columnFilter['value'])) {
                            $column = $columnFilter['column'];
                            $values = $columnFilter['value'];
                            if (count($values) > 1) {
                                $query->where(function ($query) use ($column, $values) {
                                    foreach ($values as $value) {
                                        $query->orWhere($column, '=', $value);
                                    }
                                });
                            } else {
                                $query->where($column, '=', $values[0]);
                            }
                        }
                    }
                });
            });
        }
    }
}


}

        if ($request->has('sortBy') && $request->has('sortDirection')) {
            $sortBy = $request->input('sortBy');
            $sortDirection = $request->input('sortDirection');

            if (in_array($sortDirection, ['asc', 'desc'])) {
                $vendorsQuery = $vendorsQuery->orderBy($sortBy, $sortDirection);
            }
        }

        if ($request->has('export') && $request->input('export') === true) {
            $AllVendors = $vendorsQuery->get();
        }
        $totalVendors = $vendorsQuery->count();
        $perPage = $request->input('per_page', 10);
        $vendors = $vendorsQuery->paginate($perPage);

        return response()->json([
            "vendors" => $vendors,
            "fields" => $formatArray,
            "formats" => $formats,
            "totalVendors" => $totalVendors,
            "AllVendors" => $AllVendors ?? null,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            // 'error' => "Server error",
            'error' => $e->getMessage(),
            // 'trace' => $e->getTraceAsString(),
        ], 500);
    }
}



    public function findCountry(Request $request)
    {
        $id = $request->input('id');
        $Countries = Countries::getColumnValue($id);
        return response()->json($Countries, 201);
    }
    public function findTask(Request $request)
    {
        $id = $request->input('id');
        $TaskType = TaskType::getColumnValue($id);
        return response()->json($TaskType, 201);
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
            'contact_linked_in' => 'required|string',
            'contact_ProZ' => 'required|string',
            'region' => 'required|int',
            'country' => 'required|int',
            'nationality' => 'required|int',
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
        $vendor = Vendor::find($id);

        if (!$vendor) {
            return response()->json([
                'message' => 'Vendor not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string',
            'type' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
            'prfx_name' => 'sometimes|required|string',
            'contact_name' => 'sometimes|required|string',
            'legal_Name' => 'sometimes|required|string',
            'phone_number' => 'sometimes|required|string',
            'contact_linked_in' => 'sometimes|required|string',
            'contact_ProZ' => 'sometimes|required|string',
            'region' => 'sometimes|required|int',
            'country' => 'sometimes|required|int',
            'nationality' => 'sometimes|required|int',
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
            'Wallets Payment methods' => 'array|min:1',
            'Wallets Payment methods.*.method' => 'string|max:10',
            'Wallets Payment methods.*.account' => 'string|max:255',
        ]);

        $validator->after(function ($validator) use ($request) {
            $hasBankDetails = $request->filled('bank_name') || $request->filled('account_holder') || $request->filled('swift_bic') || $request->filled('iban') || $request->filled('payment_terms') || $request->filled('bank_address');
            $hasWalletMethods = $request->has('Wallets Payment methods') && is_array($request->input('Wallets Payment methods')) && count($request->input('Wallets Payment methods')) > 0;

            if (!$hasBankDetails && !$hasWalletMethods) {
                $validator->errors()->add('bank_or_wallet', 'You must provide either bank details or wallet payment methods.');
            }

            if ($hasBankDetails) {
                if (
                    empty($request->bank_name) ||
                    empty($request->account_holder) ||
                    empty($request->swift_bic) ||
                    empty($request->iban) ||
                    empty($request->payment_terms) ||
                    empty($request->bank_address)
                ) {
                    $validator->errors()->add('bank_details', 'Incomplete bank details provided. All fields must be filled or omitted entirely.');
                }
            }

            if ($hasWalletMethods) {
                foreach ($request->input('Wallets Payment methods') as $wallet) {
                    if (empty($wallet['method']) || empty($wallet['account'])) {
                        $validator->errors()->add('wallet_payment', 'Incomplete wallet payment method provided. Each method must include both method and account.');
                        break;
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $existingBillingData = BillingData::where('vendor_id', $request['vendor_id'])->first();
        if ($existingBillingData) {
            return response()->json(['message' => 'Billing data for this vendor already exists.'], 400);
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
            $request->filled('iban') &&
            $request->filled('payment_terms') &&
            $request->filled('bank_address')
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
                if (!empty($wallet['method']) && !empty($wallet['account'])) {
                    WalletsPaymentMethods::create([
                        'billing_data_id' => $billingData->id,
                        'method' => $wallet['method'],
                        'account' => $wallet['account'],
                    ]);
                }
            }
        }

        $InvoiceController = new InvoiceController();
        $decID = Crypt::encrypt($request->input('vendor_id'));
        $BillingData = $InvoiceController->getVendorBillingData($decID);
        return response()->json($BillingData, 200);
    }

 public function ModificationComplex(Request $request)
{
    try {
        $id = $request->input('id');
        $PersonalData = $BillingData = $VMNotes = $VendorExperience = $VendorFiles = $InstantMessaging = $priceList = $VendorTools = $VendorTestData = $EducationVendor = null;

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
            if (isset($request->input('VMNotes')['receiver_email'])) {
                 $receiver_email = $request->input('VMNotes')['receiver_email'];
            } else {
                $receiver_email = $PersonalData->email;
                }
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
        if ($request->input('priceList')) {
            $VendorTools = $this->getVendorTools($id);
            $priceList = $this->getpriceListByVendorId($id);
        }
        if ($request->input('VendorTestData')) {
            $VendorTestData = $this->getVendorTestData($id);
        }
        if ($request->input('EducationVendor')) {
            $EducationVendor = $this->getEducationByVendorId($id);
        }

        return response()->json(
               [
                'Data' => $PersonalData ?? null,
                "VMNotes" => $VMNotes ?? null,
                "BillingData" => $BillingData ?? null,
                "Experience" => $VendorExperience ?? null,
                "VendorFiles" => $VendorFiles ?? null,
                "InstantMessaging" => $InstantMessaging ?? null,
                "priceList" => [$priceList ?? null, $VendorTools ?? null],
                "VendorTestData" => $VendorTestData ?? null,
                "EducationVendor" => $EducationVendor ?? null,
            ],
            200
        );
    } catch (\Exception $e) {
        return response()->json([
            'error' => "Server error"
            // 'error' => $e->getMessage(),
            // 'trace' => $e->getTraceAsString(),
        ], 500);
    }
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
        try{
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

        }catch (\Exception $e) {
        return response()->json([
            // 'error' => "Server error",
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
 
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
        $hasBankDetails = $request->filled('bank_name') && $request->filled('account_holder') && $request->filled('swift_bic') && $request->filled('iban');
        $hasWalletMethods = $request->has('Wallets Payment methods') && is_array($request->input('Wallets Payment methods')) && count($request->input('Wallets Payment methods')) > 0;

        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'BillingData_id' => 'nullable|integer',
            'BankData_id' => 'nullable|integer',
            'billing_legal_name' => 'required|string|max:255',
            'billing_currency' => 'required|integer',
            'city' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'billing_address' => 'required|string|max:255',
            'Wallets Payment methods' => 'nullable|array|min:1',
            'Wallets Payment methods.*.method' => 'string|max:10',
            'Wallets Payment methods.*.account' => 'string|max:255',
        ]);

        $validator->after(function ($validator) use ($request) {
            $hasBankDetails = $request->filled('bank_name') && $request->filled('account_holder') && $request->filled('swift_bic') && $request->filled('iban');
            $hasWalletMethods = $request->has('Wallets Payment methods') && is_array($request->input('Wallets Payment methods')) && count($request->input('Wallets Payment methods')) > 0;

            if (!$hasBankDetails && !$hasWalletMethods) {
                $validator->errors()->add('bank_or_wallet', 'You must provide either complete bank details or wallet payment methods.');
            }
        });

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->filled('BillingData_id')) {
            $billingData = BillingData::find($request->input('BillingData_id'));
            if ($billingData) {
                $billingData->update($request->only([
                    'billing_legal_name',
                    'billing_currency',
                    'city',
                    'street',
                    'billing_address',
                ]));
            } else {
                $billingData = BillingData::create([
                    'vendor_id' => $request->input('vendor_id'),
                    'billing_legal_name' => $request->input('billing_legal_name'),
                    'billing_currency' => $request->input('billing_currency'),
                    'city' => $request->input('city'),
                    'street' => $request->input('street'),
                    'billing_address' => $request->input('billing_address'),
                ]);
            }
        }else{
            $billingData = BillingData::create([
                'vendor_id' => $request->input('vendor_id'),
                'billing_legal_name' => $request->input('billing_legal_name'),
                'billing_currency' => $request->input('billing_currency'),
                'city' => $request->input('city'),
                'street' => $request->input('street'),
                'billing_address' => $request->input('billing_address'),
            ]);
        }

        if ($hasBankDetails) {
            if ($request->filled('BankData_id')) {
                $bankDetails = BankDetails::find($request->input('BankData_id'));
                if ($bankDetails) {
                    $bankDetails->update($request->only([
                        'bank_name',
                        'account_holder',
                        'swift_bic',
                        'iban',
                        'payment_terms',
                        'bank_address',
                    ]));
                } else {
                    $bankDetails = BankDetails::create([
                        'billing_data_id' => $billingData->id,
                        'bank_name' => $request->input('bank_name'),
                        'account_holder' => $request->input('account_holder'),
                        'swift_bic' => $request->input('swift_bic'),
                        'iban' => $request->input('iban'),
                        'payment_terms' => $request->input('payment_terms'),
                        'bank_address' => $request->input('bank_address'),
                    ]);
                }
            } else {
                $bankDetails = BankDetails::create([
                    'billing_data_id' => $billingData->id,
                    'bank_name' => $request->input('bank_name'),
                    'account_holder' => $request->input('account_holder'),
                    'swift_bic' => $request->input('swift_bic'),
                    'iban' => $request->input('iban'),
                    'payment_terms' => $request->input('payment_terms'),
                    'bank_address' => $request->input('bank_address'),
                ]);
            }
        }

        if ($hasWalletMethods) {
            foreach ($request->input('Wallets Payment methods') as $wallet) {
                if (isset($wallet['id'])) {
                    $walletUpdate = WalletsPaymentMethods::find($wallet['id']);
                    if ($walletUpdate) {
                        $walletUpdate->update([
                            'method' => $wallet['method'],
                            'account' => $wallet['account'],
                        ]);
                    }
                } else {
                    WalletsPaymentMethods::create([
                        'billing_data_id' => $billingData->id,
                        'method' => $wallet['method'],
                        'account' => $wallet['account'],
                    ]);
                }
            }
        }

        $InvoiceController = new InvoiceController();
        $decID = Crypt::encrypt($request->input('vendor_id'));
        $BillingData = $InvoiceController->getVendorBillingData($decID);
        return response()->json($BillingData, 200);
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

     $data = $this->getVendorExperience($request->input('vendor_id'));
        return response()->json($data, 201);
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
            })
        ], 200);
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

                    if ($file && $file->getClientOriginalExtension() !== 'zip' || $file->getSize() > 5 * 1024 * 1024) {
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

            DB::commit();

            return response()->json([
                'message' => 'Files uploaded and vendor updated successfully.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Storage::delete([$cvFilePath, $ndaFilePath]);
            foreach ($additionalFiles as $file) {
                Storage::delete($file['file_path']);
            }

            return response()->json([
                'error' => 'An error occurred while processing the request.',
             
            ], 500);
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
    // public function AddinstantMessaging(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'vendor_id' => 'required|integer',
    //         'Instant_Messaging' => 'sometimes|required|array|min:1',
    //         'Instant_Messaging.*.messaging_type_id' => 'required|integer',
    //         'Instant_Messaging.*.contact' => 'required|string',

    //     ]);
    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }
    //     $vendor_id = $request->input('vendor_id');
    //     if ($request->has('Instant_Messaging')) {
    //         foreach ($request['Instant_Messaging'] as $wallet) {
    //             InstantMessaging::create([
    //                 "vendor_id" => $vendor_id,
    //                 'messaging_type_id' => $wallet['messaging_type_id'],
    //                 'contact' => $wallet['contact'],
    //             ]);
    //         }
    //     }
    //     return response()->json(['message' => 'Added successfully.'], 200);

    // }


    public function getMessagesByVendorId($vendorId)
    {
        $messages = InstantMessaging::where('vendor_id', $vendorId)
            ->with('messagingType:id,name')
            ->get();
        return $messages;
    }

    // public function updateMessagesByVendorId(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'vendor_id' => 'required|integer',
    //         'Instant_Messaging' => 'sometimes|required|array|min:1',
    //         'Instant_Messaging.*.messaging_type_id' => 'required|integer',
    //         'Instant_Messaging.*.contact' => 'required|string',

    //     ]);
    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }
    //     $vendor_id = $request->input('vendor_id');
    //     if ($request->has('Instant_Messaging')) {
    //         foreach ($request['Instant_Messaging'] as $Messaging) {
    //             if (isset($Messaging['id'])) {
    //                 $MessagingUpdate = InstantMessaging::find($Messaging['id']);
    //                 $MessagingUpdate->update([
    //                     'messaging_type_id' => $Messaging['messaging_type_id'],
    //                     'contact' => $Messaging['contact'],
    //                 ]);
    //             } else {
    //                 InstantMessaging::create([
    //                     "vendor_id" => $vendor_id,
    //                     'messaging_type_id' => $Messaging['messaging_type_id'],
    //                     'contact' => $Messaging['contact'],
    //                 ]);
    //             }
    //         }
    //     }
    //     $data = $this->getMessagesByVendorId($vendor_id);
    //     return response()->json($data, 200);
    // }
    public function deleteMessagesByVendorId(Request $request)
    {
        return $this->deleteItem($request, InstantMessaging::class);

    }
    public function AddPriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor' => 'required|integer',
            'subject' => 'required|integer',
            'SubSubject' => 'required|integer',
            'service' => 'required|integer',
            'task_type' => 'required|integer',
            'source_lang' => 'required|integer',
            'target_lang' => 'required|integer',
            'dialect' => 'nullable|integer',
            'dialect_target' => 'nullable|integer',
            'unit' => 'required|integer',
            'rate' => 'required|integer',
            'special_rate' => 'required|integer',
            'Status' => 'required|string',
            'currency' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $vendorSheet = VendorSheet::create($request->all());
        $vendorSheet->load([
            'sourceLanguage:id,name',
            'targetLanguage:id,name',
            'dialect:id,dialect',
            'dialect_target:id,dialect',
            'service:id,name',
            'taskType:id,name',
            'unit:id,name',
            'currency:id,name',
            'subject:id,name',
            'subSubject:id,name'
        ]);
        return response()->json($vendorSheet, 201);


    }
    public function getpriceListByVendorId($vendorId)
    {
        $vendorData = VendorSheet::with([
            'sourceLanguage:id,name',
            'targetLanguage:id,name',
            'dialect:id,dialect',
            'dialect_target:id,dialect',
            'service:id,name',
            'taskType:id,name',
            'unit:id,name',
            'currency:id,name',
            'subject:id,name',
            'subSubject:id,name'
        ])->where('vendor', $vendorId)->get(['id', 'vendor', 'subject', 'SubSubject', 'service', 'task_type', 'source_lang', 'target_lang', 'dialect', 'dialect_target', 'unit', 'rate', 'special_rate', 'Status', 'currency']);

        if ($vendorData->isEmpty()) {
            return response()->json([
                'message' => 'No data found for the given vendor ID.'
            ], 404);
        }
        return $vendorData;

    }
    public function deletePricelist(Request $request)
    {
        return $this->deleteItem($request, VendorSheet::class);

    }
    public function UpdatePriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'subject' => 'required|integer',
            'SubSubject' => 'required|integer',
            'service' => 'required|integer',
            'task_type' => 'required|integer',
            'source_lang' => 'required|integer',
            'target_lang' => 'required|integer',
            'dialect' => 'nullable|integer',
            'dialect_target' => 'nullable|integer',
            'unit' => 'required|integer',
            'rate' => 'required|integer',
            'special_rate' => 'required|integer',
            'Status' => 'required|string',
            'currency' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $vendorSheet = VendorSheet::findOrFail($request->input("id"));
        $vendorSheet->update($request->except(['vendor']));
        $vendorSheet->load([
            'sourceLanguage:id,name',
            'targetLanguage:id,name',
            'dialect:id,dialect',
            'dialect_target:id,dialect',
            'service:id,name',
            'taskType:id,name',
            'unit:id,name',
            'currency:id,name',
            'subject:id,name',
            'subSubject:id,name'
        ]);
        return response()->json($vendorSheet, 200);
    }
    public function AddVendorstools(Request $request)
    {
        $vendorId = $request->input('vendor_id');

        if ($request->has('tool') && is_array($request->input('tool'))) {
            $tools = $request->input('tool');
            $toolIds = array_map(function ($tool) {
                return $tool['tool'];
            }, $tools);
            DB::table('vendor_tools')
                ->where('Vendor_id', $vendorId)
                ->whereNotIn('tool', $toolIds)
                ->delete();
            foreach ($tools as $tool) {
                DB::table('vendor_tools')->updateOrInsert(
                    [
                        'Vendor_id' => $vendorId,
                        'tool' => $tool['tool'],
                    ]
                );
            }

            return response()->json(['message' => 'Added successfully']);
        }

        return response()->json(['message' => 'Not added, something went wrong'], 400);
    }

    public function getVendorTools($vendorId)
    {
        $vendorTools = DB::table('vendor_tools')
            ->join('tools', 'vendor_tools.tool', '=', 'tools.id')
            ->where('vendor_tools.vendor_id', $vendorId)
            ->select('tools.id as id', 'tools.name as name')
            ->get();
        if ($vendorTools) {
            return $vendorTools;
        }

    }
    public function AddVendorTest(Request $request)
    {
        if (!$request->hasFile('test')) {
            return response()->json(['error' => 'Test file is required.'], 400);
        }

        $testFile = $request->file('test');

        DB::beginTransaction();
        try {
            $vendorId = $request->input('vendor_id');
            $testType = $request->input('test_type');
            $testResult = $request->input('test_result');
            $sourceLang = $request->input('source_lang');
            $targetLang = $request->input('target_lang');
            $mainSubject = $request->input('MainSubject');
            $subSubject = $request->input('SubSubject');
            $service = $request->input('service');

            $vendor = VendorTest::where('vendor_id', $vendorId)->first();

            if (!$vendor) {
                $vendor = new VendorTest();
                $vendor->vendor_id = $vendorId;
            } else {
                if ($vendor->test_upload && Storage::disk('public')->exists($vendor->test_upload)) {
                    Storage::disk('public')->delete($vendor->test_upload);
                }
            }

            $vendor->test_type = $testType;
            $vendor->test_result = $testResult;
            $vendor->source_lang = $sourceLang;
            $vendor->target_lang = $targetLang;
            $vendor->MainSubject = $mainSubject;
            $vendor->SubSubject = $subSubject;
            $vendor->service = $service;

            $path = $testFile->store('vendortests', 'public');
            $vendor->test_upload = $path;

            $vendor->save();

            DB::commit();

            return response()->json(['message' => 'Vendor test data added/updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An error occurred during the file upload or vendor update.'], 500);
        }
    }
    public function getVendorTestData($vendorId)
    {
        $vendorTest = VendorTest::where('vendor_id', $vendorId)
            ->with([
                'sourceLanguage' => function ($query) {
                    $query->select('id', 'name');
                },
                'targetLanguage' => function ($query) {
                    $query->select('id', 'name');
                },
                'mainSubject' => function ($query) {
                    $query->select('id', 'name');
                },
                'subSubject' => function ($query) {
                    $query->select('id', 'name');
                },
                'service' => function ($query) {
                    $query->select('id', 'name');
                }
            ])
            ->first();

        if ($vendorTest) {
            return $vendorTest;

        }

    }



    public function saveOrUpdateMessages(Request $request)
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
            foreach ($request['Instant_Messaging'] as $messaging) {
                if (isset($messaging['id'])) {
                    $messagingUpdate = InstantMessaging::find($messaging['id']);
                    if ($messagingUpdate) {
                        $messagingUpdate->update([
                            'messaging_type_id' => $messaging['messaging_type_id'],
                            'contact' => $messaging['contact'],
                        ]);
                    }
                } else {
                    InstantMessaging::create([
                        "vendor_id" => $vendor_id,
                        'messaging_type_id' => $messaging['messaging_type_id'],
                        'contact' => $messaging['contact'],
                    ]);
                }
            }
        }

        $data = $this->getMessagesByVendorId($vendor_id);
        return response()->json($data, 200);
    }
    public function saveOrUpdateEducation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer|exists:vendor,id',
            'university_name' => 'required|string|max:255',
            'latest_degree' => 'required|string|max:255',
            'year_of_graduation' => 'required|integer',
            'major' => 'required|integer|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $vendorId = $request->input('vendor_id');

        $vendorEducation = VendorEducation::where('vendor_id', $vendorId)->first();

        if ($vendorEducation) {
            $vendorEducation->update([
                'university_name' => $request->input('university_name'),
                'latest_degree' => $request->input('latest_degree'),
                'year_of_graduation' => $request->input('year_of_graduation'),
                'major' => $request->input('major'),
            ]);

            return response()->json(['message' => 'Education data updated successfully.'], 200);
        } else {
            VendorEducation::create([
                'vendor_id' => $vendorId,
                'university_name' => $request->input('university_name'),
                'latest_degree' => $request->input('latest_degree'),
                'year_of_graduation' => $request->input('year_of_graduation'),
                'major' => $request->input('major'),
            ]);
            return response()->json(['message' => 'Education data added successfully.'], 201);
        }
    }

    public function getEducationByVendorId($vendorId)
    {
        $education = VendorEducation::where('vendor_id', $vendorId)
            ->with('major:id,name')
            ->first();

        if ($education) {
            return $education;
        }

    }

  public function AddFormate(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is invalid or expired'], 401);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'format' => 'required|string',
            'table' => 'required|string',
        ]);

        $format = \App\Models\Formatstable::create([
            'user_id' => $userId,
            'name' => $validatedData['name'],
            'format' => $validatedData['format'],
            'table' => $validatedData['table'],
        ]);

        return response()->json([
            'message' => 'Format added successfully',
            'data' => $format
        ], 201);
    }
     public function changeFormat(Request $request){ try {

                $user = JWTAuth::parseToken()->authenticate();
                $userId = $user->id;
                    } catch (JWTException $e) {
                return response()->json(['error' => 'Token is invalid or expired'], 401);
                        }
                    $tableName = $request->input('table');
                    $formatId = $request->input('id');
                    if (isset($formatId)) {
                        DB::table('formatsTable')
                        ->where('table', $tableName)
                        ->where('user_id', $userId)
                        ->update(['status' => 0]);
                    DB::table('formatsTable')
                        ->where('user_id', $userId)
                        ->where('table', $tableName)
                        ->where('id', $formatId)  
                        ->update(['status' => 1]);
                    }else{
                        DB::table('formatsTable')
                        ->where('table', $tableName)
                        ->where('user_id', $userId)
                        ->update(['status' => 0]);
                    }
                    return response()->json([
                    'message' => 'The format has been changed.'
                ], 201);
                
            }

          public function updateFormat(Request $request) {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',     
                'id' => 'required|integer|exists:formatsTable,id', 
                'format' => 'required|string',                
            ]);
                $formatExists = DB::table('formatsTable')->where('id', $request->input('id'))->exists();

            if (!$formatExists) {
                return response()->json(['error' => 'Format not found.'], 404);
            }

            DB::table('formatsTable')
                ->where('id', $request->input('id'))
                ->update([
                    'name' => $request->input('name'),
                    'format' => $request->input('format'), 
                ]);
            $updatedFormat = DB::table('formatsTable')->where('id', $request->input('id'))->first();

            return response()->json( $updatedFormat, 200);
}

public function deleteFormat(Request $request){
        return $this->deleteItem($request, Formatstable::class);

}
        }
