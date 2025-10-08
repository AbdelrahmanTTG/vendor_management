<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Countries;
use App\Models\Regions;
use App\Models\SubSubjectMatter;
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
use App\Mail\VMmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use App\Models\DataLogger;

use App\Http\Controllers\InvoiceController;
use App\Mail\UpdateDataMail;
use App\Models\TimeZone;
use App\Models\VmSetup;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class VendorProfileController extends Controller
{
    public function format($request)
    {

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
        $user = JWTAuth::parseToken()->authenticate();
        $payload = JWTAuth::getPayload(JWTAuth::getToken());
        $view = $request->input('view');
        if ($request->filled('view')) {
            if ($view == 1) {
                $piv = explode(',', $payload["piv"]);
                array_push($piv, $payload["sub"]);
            } elseif ($view == 2) {
                $piv = explode(',', $payload["sub"]);
            }
        } else {
            return response()->json([
                'message' => 'Bad Request: view parameter is missing or invalid.'
            ], 400);
        }
        $formats = $this->format($request);
        $filteredFormats = $formats->filter(function ($format) {
            return $format->status == 1;
        });

        if ($filteredFormats->isEmpty()) {
            $formatArray = ['name', 'email', 'status', "priceList", 'type', 'country', "source_lang", "target_lang", 'dialect', "service", "task_type", 'rate', 'special_rate', 'unit', 'currency', "subject", 'Status', "sub_subject", "dialect_target", "brands"];
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
            'created_by' => ['id', 'user_name'],
        ];

        $vendorColumns = Schema::getColumnListing('vendor');
        $vendorSheet = Schema::getColumnListing('vendor_sheet');

        $relatedColumns = array_diff($formatArray, $vendorColumns);
        $relatedColumns = array_diff($relatedColumns, $vendorSheet);

        // Handle created_by specifically - if it's in formatArray or queryParams, include it from vendor table
        $includeCreatedBy = false;
        if (in_array('created_by', $formatArray)) {
            $includeCreatedBy = true;
        }

        // Check if created_by is requested in queryParams
        if ($request->has('queryParams') && is_array($request->queryParams)) {
            if (array_key_exists('created_by', $request->queryParams) && !empty($request->queryParams['created_by'])) {
                $includeCreatedBy = true;
                // Add to formatArray if not already there
                if (!in_array('created_by', $formatArray)) {
                    $formatArray[] = 'created_by';
                }
            }
        }

        $relatedColumns = array_filter($relatedColumns, function ($column) {
            return $column !== 'priceList';
        });
        $relatedColumns = array_values($relatedColumns);

        $intersectColumns = array_intersect($formatArray, $vendorColumns);
        $intersectColumnsVendorSheet = array_intersect($formatArray, $vendorSheet);
        $mandatoryColumns = ['timezone', 'created_by'];
        $intersectColumns = array_unique(array_merge($intersectColumns, $mandatoryColumns));
        // Ensure created_by is included in intersectColumns if needed
        if ($includeCreatedBy && !in_array('created_by', $intersectColumns)) {
            $intersectColumns[] = 'created_by';
        }

        if (!empty($intersectColumns)) {
            $vendorsQuery = Vendor::select('vendor.id', 'vendor.vendor_brands')
                ->addSelect(DB::raw(implode(',', $intersectColumns)));
        } else {
            $vendorsQuery = Vendor::select('vendor.id', 'vendor.vendor_brands');
        }

        if (in_array('priceList', $formatArray) || !empty($intersectColumnsVendorSheet)) {
            if (!in_array('priceList', $formatArray)) {
                $middleIndex = intval(count($formatArray) / 2);
                $formatArray = array_merge(
                    array_slice($formatArray, 0, $middleIndex),
                    ['priceList'],
                    array_slice($formatArray, $middleIndex)
                );
            }
            $vendorsQuery->addSelect(DB::raw("'' as `priceList`"))
                ->with([
                    'vendor_sheet' => function ($query) use ($formatArray, $vendorSheet) {
                        $selectedColumns = array_intersect($formatArray, $vendorSheet);
                        // Remove created_by from vendor_sheet selection to avoid conflict
                        $selectedColumns = array_diff($selectedColumns, ['created_by']);

                        if (empty($selectedColumns)) {
                            $selectedColumns = ["source_lang", "target_lang", 'dialect', "service", "task_type", 'rate', 'special_rate', 'unit', 'currency', "subject", 'Status', "sub_subject", "dialect_target", "sheet_brand"];
                        }
                        $query->select(array_merge(['id', "vendor"], $selectedColumns));
                        foreach ($selectedColumns as $relation) {
                            if (method_exists($query->getModel(), $relation)) {
                                $query->with([$relation]);
                            }
                        }
                    }
                ]);
        }

        if (!empty($relatedColumns)) {
            $joinCount = 0;
            foreach ($relatedColumns as $relation) {
                if (strpos($relation, '.') !== false) {
                    list($table, $column) = explode('.', $relation);
                    if ($table === 'bank_details' || $table === 'wallets_payment_methods') {
                        $aliasBilling = "billing_data_{$joinCount}";
                        $aliasTarget = "{$table}_{$joinCount}";
                        $vendorsQuery->leftJoin("billing_data as {$aliasBilling}", "{$aliasBilling}.vendor_id", '=', 'vendor.id');
                        $vendorsQuery->leftJoin("{$table} as {$aliasTarget}", "{$aliasTarget}.billing_data_id", '=', "{$aliasBilling}.id");
                        $vendorsQuery->addSelect("{$aliasTarget}.{$column} as {$column}");
                        $vendorsQuery->distinct()->limit(1);
                    } else {
                        $alias = "{$table}_{$joinCount}";
                        $vendorsQuery->leftJoin("{$table} as {$alias}", "{$alias}.vendor_id", '=', 'vendor.id');
                        $vendorsQuery->addSelect("{$alias}.{$column} as {$column}");
                    }
                    $joinCount++;
                }
            }
        }

        $diffFormatArray = $formatArray;
        $formatArray = array_diff($formatArray, $vendorSheet);
        // Don't remove created_by from formatArray if it should come from vendor table
        if ($includeCreatedBy && !in_array('created_by', $formatArray)) {
            $formatArray[] = 'created_by';
        }
        $formatArray = array_values($formatArray);

        if ($request->has('queryParams') && is_array($request->queryParams)) {
            $queryParams = $request->queryParams;
            if (!empty($queryParams['timezone_from']) && !empty($queryParams['timezone_to'])) {
                $timezoneFrom = $queryParams['timezone_from'][0];
                $timezoneTo = $queryParams['timezone_to'][0];

                $vendorsQuery->whereHas('timezone', function ($query) use ($timezoneFrom, $timezoneTo) {
                    $query->where('gmt', '>=', $timezoneFrom)
                        ->where('gmt', '<=', $timezoneTo);
                });

                if (!in_array('timezone', $formatArray)) {
                    $formatArray[] = 'timezone';
                }

                $vendorsQuery->with(['timezone' => function ($query) {
                    $query->select(['id', 'gmt']);
                }]);
            }

            foreach ($queryParams as $key => $val) {
                if ($key !== 'filters' && !empty($val)) {
                    // check vendor brands
                    if ($key === 'timezone_from' || $key === 'timezone_to') {
                        continue;
                    }

                    if ($key === 'vendor_brands') {
                        if (!in_array('brands', $formatArray)) {
                            $formatArray[] = 'brands';
                        }
                    } else {
                        if (!in_array($key, $formatArray)) {
                            // For created_by, don't add it again if it's already selected from vendor table
                            if ($key === 'created_by' && $includeCreatedBy) {
                                // It's already included in intersectColumns
                            } else {
                                $vendorsQuery->addSelect($key);
                            }
                            $formatArray[] = $key;
                        }
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
                        if ($table === 'vendor_sheet') {
                            $vendorsQuery->whereHas('vendor_sheet', function ($query) use ($filter) {
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
                            $selectedColumnsRow = array_intersect($diffFormatArray, $vendorSheet);
                            // Remove created_by from vendor_sheet columns
                            $selectedColumnsRow = array_diff($selectedColumnsRow, ['created_by']);

                            if (empty($selectedColumnsRow)) {
                                $selectedColumnsRow = ["source_lang", "target_lang", 'dialect', "service", "task_type", 'rate', 'special_rate', 'unit', 'currency', "subject", 'Status', "sub_subject", "dialect_target", "sheet_brand"];
                            }
                            if (!in_array('priceList', $formatArray)) {
                                $formatArray[] = 'priceList';
                                $diffFormatArray[] = 'priceList';
                            }
                            $selectedColumns = array_merge(['id', "vendor"], $selectedColumnsRow);
                            foreach ($filter['columns'] as $columnFilter) {
                                if (!empty($columnFilter['column']) && $columnFilter['column'] !== 'created_by') {
                                    $selectedColumns[] = $columnFilter['column'];
                                }
                            }
                            $selectedColumns = array_unique($selectedColumns);
                            $vendorsQuery->with(['vendor_sheet' => function ($query) use ($selectedColumns, $filter, $selectedColumnsRow) {
                                $query->select($selectedColumns);
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
                                $relatedColumns = array_column($filter['columns'], 'column');
                                // Remove created_by and direct columns like rate from related columns
                                $directVendorSheetColumns = ["source_lang", "target_lang", 'dialect', "service", "task_type", 'rate', 'special_rate', 'unit', 'currency', "subject", 'Status', "sub_subject", "dialect_target", "sheet_brand"];
                                $relatedColumns = array_diff($relatedColumns, ['created_by'], $directVendorSheetColumns);
                                $mergedColumns = array_unique(array_merge($relatedColumns, $selectedColumnsRow));
                                // Only include actual relationships in with()
                                foreach ($mergedColumns as $relation) {
                                    if (method_exists($query->getModel(), $relation)) {
                                        $query->with([$relation]);
                                    }
                                }
                            }]);
                        } else {
                            // Existing logic for other tables
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
                            })->with([$table => function ($query) use ($filter, $formatArray) {
                                $columns = array_column($filter['columns'], 'column');
                                if (!empty($columns)) {
                                    $query->select(array_merge(["vendor_id"], $columns));
                                    foreach ($columns as $relation) {
                                        if (method_exists($query->getModel(), $relation)) {
                                            $query->with([$relation]);
                                        }
                                    }
                                }
                            }]);
                            foreach ($filter['columns'] as $columnFilter) {
                                if (!empty($columnFilter['column'])) {
                                    if ($columnFilter['column'] === 'created_by' && $includeCreatedBy) {
                                        // Skip, already handled
                                    } else {
                                        $formatArray[] = $columnFilter['column'];
                                    }
                                }
                            }
                        }
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

        $formatArray = array_map(function ($column) {
            if (strpos($column, '.') !== false) {
                return explode('.', $column)[1];
            }
            return $column;
        }, $formatArray);

        foreach ($relationships as $relation => $columns) {
            if (in_array($relation, $formatArray)) {
                $vendorsQuery->with([$relation => function ($query) use ($columns) {
                    $query->select($columns);
                }]);
            }
        }
        $totalVendors = $vendorsQuery->count();

        if ($request->has('export') && $request->input('export') === true) {
            $AllVendors = [];
            $vendorsQuery->chunk(100, function ($vendorsChunk) use (&$AllVendors) {
                $flattenedVendors = $this->flattenVendorsWithSheets($vendorsChunk->toArray());
                $AllVendors = array_merge($AllVendors, $flattenedVendors);
            });
            $diffFormatArrayEx = [];
            $diffFormatArrayEx = array_merge($diffFormatArrayEx, $diffFormatArray);
            if (empty(array_intersect($diffFormatArray, $vendorSheet)) && in_array('priceList', $diffFormatArray)) {
                $diffFormatArrayEx = array_merge($diffFormatArrayEx, ["source_lang", "target_lang", 'dialect', "service", "task_type", 'rate', 'special_rate', 'unit', 'currency', "subject", 'Status', "sub_subject", "dialect_target", "sheet_brand"]);
            }
            $diffFormatArrayEx = array_map(function ($column) use ($diffFormatArrayEx) {
                if (strpos($column, '.') !== false) {
                    $splitParts = explode('.', $column);
                    $secondPart = $splitParts[1];
                    if (in_array($secondPart, $diffFormatArrayEx)) {
                        return $column;
                    }
                    return $secondPart;
                }
                return $column;
            }, $diffFormatArrayEx);
            $diffFormatArrayEx = array_values(array_diff($diffFormatArrayEx, ['priceList']));
        }

        $formatArray = array_unique(array_merge(['id'], $formatArray));
        $perPage = $request->input('per_page', 10);
        $vendors = $vendorsQuery->paginate($perPage);
        $tableKeys = array_column($queryParams['filters'] ?? [], 'table');
        $vendorsData = $vendors->toArray();
        $flattenedVendors = array_map(function ($vendor) use ($tableKeys) {
            foreach ($tableKeys as $table) {
                if (isset($vendor[$table])) {
                    unset($vendor[$table]['vendor']);
                    unset($vendor[$table]['vendor_id']);
                }
            }
            return $this->flattenObject($vendor, $tableKeys);
        }, $vendorsData['data']);
        $vendors->setCollection(collect($flattenedVendors));

        return response()->json([
            "vendors" => $vendors,
            "fields" => $formatArray,
            "formats" => $formats,
            "totalVendors" => $totalVendors,
            "AllVendors" => !empty($AllVendors) ? [$diffFormatArrayEx, $AllVendors] : null,
        ], 200);
    }
    function flattenVendorsWithSheets($vendors)
    {
        $flattenedVendors = [];

        foreach ($vendors as $vendor) {
            $vendorData = $vendor;
            $vendorId = $vendor['id'];
            unset($vendorData['vendor_sheet'], $vendorData['id']);

            if (isset($vendorData['priceList'])) {
                unset($vendorData['priceList']);
            }
            if (!empty($vendor['vendor_sheet']) && is_array($vendor['vendor_sheet'])) {
                foreach ($vendor['vendor_sheet'] as $sheet) {
                    unset($sheet['id'], $sheet['vendor']);

                    $adjustedVendorData = [];
                    foreach ($vendorData as $key => $value) {
                        if (array_key_exists($key, $sheet)) {
                            $adjustedVendorData["vendorTest.{$key}"] = $value;
                        } else {
                            $adjustedVendorData[$key] = $value;
                        }
                    }
                    $flattenedVendors[] = array_merge(
                        ['id' => $vendorId],
                        $adjustedVendorData,
                        $sheet
                    );
                }
            } else {
                $flattenedVendors[] = ['id' => $vendorId] + $vendorData;
            }
        }

        return $flattenedVendors;
    }

    private function flattenObject($array, $tableKeys = null)
    {
        $flattened = [];

        foreach ($array as $key => $value) {
            if ($key === 'vendor_sheet') {
                $flattened[$key] = $value;
                continue;
            }
            $shouldFlatten = is_null($tableKeys) || (is_array($tableKeys) && in_array($key, $tableKeys));
            if ($shouldFlatten && is_array($value)) {
                $flattened += $this->flattenObject($value, $tableKeys);
            } else {
                $flattened[$key] = $value;
            }
        }

        return $flattened;
    }




    public function findCountry(Request $request)
    {
        $id = $request->input('id');
        $Countries = Countries::getColumnValue($id);
        return response()->json($Countries, 201);
    }
    public function findSubSubject(Request $request)
    {
        $id = $request->input('id');
        $Countries = SubSubjectMatter::getColumnValue($id);
        return response()->json($Countries, 201);
    }
    public function findTimeZone(Request $request)
    {
        $id = $request->input('id');
        $Countries = TimeZone::getColumnValue($id);
        return response()->json($Countries, 201);
    }
    public function findTask(Request $request)
    {
        $id = $request->input('id');
        $TaskType = TaskType::getColumnValue($id);
        return response()->json($TaskType, 201);
    }
    public function findRegions(Request $request)
    {
        $id = $request->input('id');
        $Regions = Regions::getColumnValue($id);
        return response()->json($Regions, 201);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'type' => 'required|string',
            'status' => 'required|string',
            'prfx_name' => 'nullable|string',
            'contact_name' => 'nullable|string',
            'legal_Name' => 'nullable|string',
            'email' => 'required|email|unique:vendor,email',
            'phone_number' => 'required|string',
            'contact_linked_in' => 'nullable|string',
            'contact_ProZ' => 'nullable|string',
            'contact_other1' => 'nullable|string',
            'contact_other2' => 'nullable|string',
            'contact_other3' => 'nullable|string',
            'Anothernumber' => 'nullable|string',
            'region' => 'required|int',
            'country' => 'required|int',
            'vendor_source' => 'required|string',
            'nationality' => 'required|int',
            'timezone' => 'required|int',
            'street' => 'nullable|string',
            'city' => 'nullable|string',
            'address' => 'nullable|string',
            'reject_reason' => 'nullable|string',
            'vendor_brands' => 'required',
            'profile_status' => 'nullable|string',
            'mother_tongue_language' => 'nullable|array',
            'mother_tongue_language.*.value' => 'required|int'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $vendor = Vendor::create($validator->validated());

        if ($request->has('mother_tongue_language') && is_array($request->mother_tongue_language)) {
            $motherTongues = [];

            foreach ($request->mother_tongue_language as $lang) {
                if (isset($lang['value']) && !empty($lang['value'])) {
                    $motherTongues[] = [
                        'vendor_id'   => $vendor->id,
                        'language_id' => $lang['value'],
                        'created_at'  => now(),
                        'updated_at'  => now()
                    ];
                }
            }

            if (!empty($motherTongues)) {
                DB::table('vendors_mother_tongue')->insert($motherTongues);
            }
        }

        DataLogger::addToLogger(
            $userId,
            'create_vendor',
            $request->fullUrl(),
            'vendor',
            $vendor->toArray(),   
            $vendor->id
        );


        return response()->json([
            'message' => 'Vendor created successfully!',
            'vendor' => [
                'id' => $vendor->id,
                'data' => $this->PersonalData($vendor->id)
            ]
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
            'prfx_name' => 'sometimes|nullable|string',
            'contact_name' => 'sometimes|nullable|string',
            'legal_Name' => 'sometimes|nullable|string',
            'phone_number' => 'sometimes|required|string',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('vendor', 'email')->ignore($vendor->id)
            ],
            'contact_linked_in' => 'sometimes|nullable|string',
            'contact_ProZ' => 'sometimes|nullable|string',
            'contact_other1' => 'sometimes|nullable|string',
            'contact_other2' => 'sometimes|nullable|string',
            'contact_other3' => 'sometimes|nullable|string',
            'Anothernumber' => 'sometimes|nullable|string',
            'region' => 'sometimes|required|integer',
            'country' => 'sometimes|required|integer',
            'vendor_source' => 'sometimes|required|string',
            'nationality' => 'sometimes|required|integer',
            'timezone' => 'sometimes|required|integer',
            'street' => 'sometimes|nullable|string',
            'city' => 'sometimes|nullable|string',
            'address' => 'sometimes|nullable|string',
            'reject_reason' => 'sometimes|nullable|string',
            'vendor_brands' => 'required',
            'profile_status' => 'sometimes|required|integer',
            'mother_tongue_language' => 'nullable|array',
            'mother_tongue_language.*.value' => 'required_with:mother_tongue_language|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $vendor->update($validator->validated());

        if ($request->has('mother_tongue_language') && is_array($request->mother_tongue_language)) {
            DB::table('vendors_mother_tongue')
                ->where('vendor_id', $vendor->id)
                ->delete();

            $motherTongues = [];
            foreach ($request->mother_tongue_language as $lang) {
                if (isset($lang['value']) && !empty($lang['value'])) {
                    $motherTongues[] = [
                        'vendor_id'   => $vendor->id,
                        'language_id' => $lang['value'],
                        'created_at'  => now(),
                        'updated_at'  => now()
                    ];
                }
            }

            if (!empty($motherTongues)) {
                DB::table('vendors_mother_tongue')->insert($motherTongues);
            }
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        DataLogger::addToLogger(
            $userId,
            'update_vendor',
            $request->fullUrl(),
            'vendor',
            $vendor->toArray(),
            $vendor->id
        );

        if ($request->VendorSide == true) {
            $brand = $vendor->vendor_brands;
            $from = "vm.support@thetranslationgate.com";
            $cc = [$from];

            if ($brand == 1) {
                $from = "vm.support@thetranslationgate.com";
                $cc = [$from];
            } elseif ($brand == 2) {
                $from = "vm.support@localizera.com";
                $cc = [$from];
            } elseif ($brand == 3) {
                $from = "vm.support@europelocalize.com";
                $cc = [$from];
            } elseif ($brand == 4) {
                $from = "vm@afaqtranslations.com";
                $cc = ["vm@afaqtranslations.com", "nour.mahmoud@afaqtranslations.com"];
            } elseif ($brand == 11) {
                $from = "vm.support@columbuslang.com";
                $cc = [$from];
            }

            $mailData = [
                'subject' => 'Portal - Vendor Profile Updates',
                'title' => 'The vendor has made changes to their data',
                'personalData' => $this->PersonalData($vendor->id),
            ];

            Mail::to($from)
                ->cc($cc)
                ->send(new UpdateDataMail($mailData));
        }

        return response()->json([
            'message' => 'Vendor updated successfully!',
            'vendor' => [
                'id' => $vendor->id,
                'vendor' => $this->PersonalData($vendor->id)
            ]
        ], 200);
    }
    // public function updatePersonalInfo(Request $request)
    // {
    //     if (!$request->has('id')) {
    //         return response()->json([
    //             'message' => 'ID is required'
    //         ], 400);
    //     }

    //     $id = $request->input('id');
    //     $vendor = Vendor::find($id);

    //     if (!$vendor) {
    //         return response()->json([
    //             'message' => 'Vendor not found'
    //         ], 404);
    //     }

    //     $validator = Validator::make($request->all(), [
    //         'name' => 'sometimes|required|string',
    //         'type' => 'sometimes|required|string',
    //         'status' => 'sometimes|required|string',
    //         'prfx_name' => 'sometimes|nullable|string',
    //         'contact_name' => 'sometimes|nullable|string',
    //         'legal_Name' => 'sometimes|nullable|string',
    //         'phone_number' => 'sometimes|required|string',
    //         'email' => [
    //             'sometimes',
    //             'required',
    //             'email',
    //             Rule::unique('vendor', 'email')->ignore($vendor->id)
    //         ],
    //         'contact_linked_in' => 'sometimes|nullable|string',
    //         'contact_ProZ' => 'sometimes|nullable|string',
    //         'contact_other1' => 'sometimes|nullable|string',
    //         'contact_other2' => 'sometimes|nullable|string',
    //         'contact_other3' => 'sometimes|nullable|string',
    //         'Anothernumber' => 'sometimes|nullable|string',
    //         'region' => 'sometimes|required|integer',
    //         'country' => 'sometimes|required|integer',
    //         'vendor_source' => 'sometimes|required|string',
    //         'nationality' => 'sometimes|required|integer',
    //         'timezone' => 'sometimes|required|integer',
    //         'street' => 'sometimes|nullable|string',
    //         'city' => 'sometimes|nullable|string',
    //         'address' => 'sometimes|nullable|string',
    //         'reject_reason' => 'sometimes|nullable|string',
    //         'vendor_brands' => 'required|string',
    //         'profile_status' => 'sometimes|required|integer',
    //         'mother_tongue_language' => 'nullable|array',
    //         'mother_tongue_language.*.value' => 'required_with:mother_tongue_language|integer'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }
    //     $vendor->update($validator->validated());
    //     if ($request->has('mother_tongue_language') && is_array($request->mother_tongue_language)) {
    //         DB::table('vendors_mother_tongue')
    //             ->where('vendor_id', $vendor->id)
    //             ->delete();

    //         $motherTongues = [];
    //         foreach ($request->mother_tongue_language as $lang) {
    //             if (isset($lang['value']) && !empty($lang['value'])) {
    //                 $motherTongues[] = [
    //                     'vendor_id'   => $vendor->id,
    //                     'language_id' => $lang['value'],
    //                     'created_at'  => now(),
    //                     'updated_at'  => now()
    //                 ];
    //             }
    //         }

    //         if (!empty($motherTongues)) {
    //             DB::table('vendors_mother_tongue')->insert($motherTongues);
    //         }
    //     }

    //     if ($request->VendorSide == true) {
    //         $vmConfig = VmSetup::first();
    //         $mailData = [
    //             'subject' => 'Portal - Vendor Profile Updates',
    //             'title' => 'The vendor has made changes to their data',
    //             'personalData' => $this->PersonalData($vendor->id),
    //         ];
    //         Mail::to($vmConfig->vm_email)->send(new UpdateDataMail($mailData));
    //     }

    //     return response()->json([
    //         'message' => 'Vendor updated successfully!',
    //         'vendor' => [
    //             'id' => $vendor->id,
    //             'vendor' => $this->PersonalData($vendor->id)
    //         ]
    //     ], 200);
    // }

    public function storeBilling(Request $request)
    {
        if ($request['wallet_required'] == 0 && $request['bank_required']) {
            return response()->json([
                'message' => 'You must provide either bank details or wallet payment methods.',
                'error' => true,
                'code' => 422
            ]);
        }

        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'billing_currency' => 'required|integer',
            'billing_legal_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'Wallets Payment methods' => 'array|min:1',
            'Wallets Payment methods.*.method' => 'int|max:10',
            'Wallets Payment methods.*.account' => 'string|max:255',
            'Wallets Payment defaults.*.defaults' => 'int|max:1',
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
            'billing_status' => "2",
            'bank_required' => $request['bank_required'],
            'wallet_required' => $request['wallet_required'],
        ]);

        if (
            $request->filled('bank_name') &&
            $request->filled('account_holder') &&
            $request->filled('swift_bic') &&
            $request->filled('iban') &&
            $request->filled('payment_terms') &&
            $request->filled('bank_address')
        ) {
            BankDetails::create([
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
                        'defaults' => $wallet['defaults'],
                    ]);
                }
            }
        }

        $logData = $billingData->toArray();

        $bank = BankDetails::where('billing_data_id', $billingData->id)->first();
        if ($bank) {
            $logData['bank_details'] = $bank->toArray();
        }

        $wallets = WalletsPaymentMethods::where('billing_data_id', $billingData->id)->get()->toArray();
        if (!empty($wallets)) {
            $logData['wallets'] = $wallets;
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        DataLogger::addToLogger(
            $userId,
            'create_billing',
            $request->fullUrl(),
            'billing_data',
            $logData, 
            $billingData->id
        );

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
                try {
                    $decID = Crypt::decrypt($id);
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    $decID = $id;
                }
                $PersonalData = $this->PersonalData($decID);
            }

            if ($request->input('BillingData')) {

                $InvoiceController = new InvoiceController();
                try {
                    Crypt::decrypt($id);
                    $decID = $id;
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    $decID = Crypt::encrypt($id);
                }
                // $decID = Crypt::encrypt($id);
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
                $pm = $this->getPM($id);
            }
            if ($request->input('Experience')) {
                try {
                    $decID = Crypt::decrypt($id);
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    $decID = $id;
                }
                $VendorExperience = $this->getVendorExperience($decID);
            }
            if ($request->input('VendorFiles')) {
                try {
                    $decID = Crypt::decrypt($id);
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    $decID = $id;
                }
                $VendorFiles = $this->getVendorFiles($decID);
            }
            if ($request->input('InstantMessaging')) {
                try {
                    $decID = Crypt::decrypt($id);
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    $decID = $id;
                }
                $InstantMessaging = $this->getMessagesByVendorId($decID);
            }
            if ($request->input('priceList')) {
                try {
                    $decID = Crypt::decrypt($id);
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    $decID = $id;
                }
                $VendorTools = $this->getVendorTools($decID);
                $priceList = $this->getpriceListByVendorId($decID);
            }
            if ($request->input('VendorTestData')) {
                $VendorTestData = $this->getVendorTestData($id);
            }
            if ($request->input('EducationVendor')) {
                try {
                    $decID = Crypt::decrypt($id);
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    $decID = $id;
                }
                $EducationVendor = $this->getEducationByVendorId($decID);
            }

            return response()->json(
                [
                    'Data' => $PersonalData ?? null,
                    "VMNotes" => $VMNotes ?? null,
                    "pm" => $pm ?? null,
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
                // 'error' => "Server error"
                'error' => $e->getMessage(),
                // 'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function PersonalData($id)
    {
        $vendor = Vendor::with([
            'country:id,name',
            'nationality:id,name',
            'region:id,name',
            'timezone:id,gmt',
            'motherTongueLanguages.language:id,name'
        ])->findOrFail($id);

        $vendor->mother_tongue_languages = $vendor->motherTongueLanguages->map(function ($item) {
            return [
                'value' => $item->language_id,
                'label' => $item->language ? $item->language->name : null
            ];
        })->values();
        unset($vendor->motherTongueLanguages);
        return $vendor;
    }

    public function getPM($id)
    {
        $pm = Vendor::where('id', $id)->value('PM');

        if ($pm) {
            return $pm;
        }
    }

    public function VMNotes($sender_email, $receiver_email)
    {
        $lastMessage = Messages::getLastMessageBetween($sender_email, $receiver_email);
        if ($lastMessage) {
            return $lastMessage;
        }
    }

    // public function Message_VM_to_Vendor(Request $request)
    // {
    //     try {
    //         $validator = Validator::make($request->all(), [
    //             'sender_id' => 'required|string|max:255',
    //             'receiver_id' => 'required|string|max:255',
    //             'content' => 'nullable|string',
    //             "status" => 'nullable|string',
    //         ]);
    //         if ($validator->fails()) {
    //             return response()->json($validator->errors(), 422);
    //         }
    //         $sender_email = app('decrypt')(base64_decode($request->input('sender_id')));
    //         $receiver_email = $request->input('receiver_id');
    //         $content = $request->input('content');
    //         $status = $request->input('status');
    //         $sender_email = app('decrypt')(base64_decode($request->input('sender_id')));
    //         $data = Messages::updateOrCreate(
    //             [
    //                 'sender_email' => $sender_email,
    //                 'receiver_email' => $receiver_email,
    //             ],
    //             [
    //                 'content' => $content,
    //                 'status' => $status,
    //                 "is_read" => 0
    //             ]
    //         );
    //         if ($status == 1) {
    //             $details = [
    //                 'subject' => 'New notifications ',
    //                 'title' => 'notifications',
    //                 'body' =>  $content,
    //                 'brand' => env('BRAND', "Nexus"),
    //             ];
    //             Mail::to($receiver_email)->send(new VMmail($details, env('MAIL_FROM_ADDRESS')));
    //             event(new Message($content, base64_encode(app('encrypt')($receiver_email))));
    //         }

    //         return response()->json(['Message' => "The message has been sent.", "data" => ["id" => $data->id, "content" => $content, "is_read" => 0, "updated_at" => $data->updated_at, "status" => $status]], 200);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             // 'error' => "Server error",
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString(),
    //         ], 500);
    //     }
    // }
    public function Message_VM_to_Vendor(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'sender_id'   => 'required|string|max:255',
                'receiver_id' => 'required|string|max:255',
                'content'     => 'nullable|string',
                "status"      => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;

            $sender_email   = app('decrypt')(base64_decode($request->input('sender_id')));
            $receiver_email = $request->input('receiver_id');
            $content        = $request->input('content');
            $status         = $request->input('status');

            $vendor = Vendor::where('email', $receiver_email)->first();

            if (!$vendor) {
                return response()->json(['error' => 'Vendor not found'], 404);
            }

            $vendor_brand = $vendor->vendor_brands;

            if ($vendor_brand == 1) {
                $subject   = "TTG || Nexus New Notification";
                $vm_email  = "vm.support@thetranslationgate.com";
                $_brand = 'The translation gate';
            } elseif ($vendor_brand == 3) {
                $subject   = "Europe Localize || Nexus New Notification";
                $vm_email  = "vm.support@europelocalize.com";
                $_brand = 'Europe Localize';
            } elseif ($vendor_brand == 11) {
                $subject   = "ColumbusLang || Nexus New Notification";
                $vm_email  = "vm.support@columbuslang.com";
                $_brand = 'ColumbusLang';
            } elseif ($vendor_brand == 2) {
                $subject   = "Localizera || Nexus New Notification";
                $vm_email  = "vm.support@localizera.com";
                $_brand = 'Localizera';
            } else {
                $subject   = "Nexus || New Notification";
                $_brand = 'Nexus';
                $vm_email  = 'vm.support@nexus.com';
            }

            $data = Messages::updateOrCreate(
                [
                    'sender_email'   => $sender_email,
                    'receiver_email' => $receiver_email,
                ],
                [
                    'content' => $content,
                    'status'  => $status,
                    "is_read" => 0
                ]
            );

            if ($status == 1) {
                $details = [
                    'subject' => $subject,
                    'title'   => 'notifications',
                    'body'    => $content,
                    'brand'   => $_brand,
                ];
                Mail::to($receiver_email)
                    ->send(
                        (new VMmail($details))->from($vm_email, 'Support Team')
                    );
            }

            DataLogger::addToLogger(
                $userId,
                'send_message_vm_to_vendor',
                $request->fullUrl(),
                'messages',
                array_merge($data->toArray(), [
                    'vendor_id' => $vendor->id, 
                ]),
                $data->id
            );


            return response()->json([
                'Message' => "The message has been sent.",
                "data" => [
                    "id"         => $data->id,
                    "content"    => $content,
                    "is_read"    => 0,
                    "updated_at" => $data->updated_at,
                    "status"     => $status
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }
    public function Message_VM_to_PM(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|int',
            'PM' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $id = $request->input('id');
        $pm = $request->input('PM');
        $vendor = Vendor::find($id);

        if (!$vendor) {
            return response()->json([
                'message' => 'Vendor not found'
            ], 404);
        }

        $vendor->update(['PM' => $pm]);

        DataLogger::addToLogger(
            $userId,
            'update_vendor_PM',
            $request->fullUrl(),
            'vendor',
            $vendor->toArray(),
            $vendor->id
        );

        return response()->json([
            'message' => 'Vendor updated successfully',
            'vendor' => $vendor
        ], 200);
    }


    public function deleteWalletsPayment(Request $request)
    {
        $id = $request->input('id');
        $WalletsPaymentMethods = WalletsPaymentMethods::find($id);

        if (!$WalletsPaymentMethods) {
            return response()->json(['message' => 'Wallet not found'], 404);
        }

        if ($WalletsPaymentMethods->defaults == 1) {
            return response()->json([
                'message' => 'Cannot delete before default wallet is selected'
            ], 500);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        DataLogger::addToLogger(
            $userId,
            'delete_wallet_payment',
            $request->fullUrl(),
            'wallets_payment_methods',
            $WalletsPaymentMethods->toArray(),
            $WalletsPaymentMethods->id
        );

        return $this->deleteItem($request, WalletsPaymentMethods::class);
    }

    public function deleteSkill(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;
        $row = VendorSkill::find($request->id);

        if (!$row) {
            return response()->json(['error' => 'Record not found'], 404);
        }
        $rowData = $row->toArray();
        $response = $this->deleteItem($request, VendorSkill::class);
        if ($response->getStatusCode() === 200) {
            DataLogger::addToLogger(
                $userId,
                'delete_skill',
                $request->fullUrl(),
                'vendor_skills',
                $rowData,   
                $request->id
            );
        }

        return $response;
    }


    public function updateBillingData(Request $request)
    {
        $hasBankDetails = $request->filled('bank_name') && $request->filled('account_holder') && $request->filled('swift_bic') && $request->filled('iban');
        $hasWalletMethods = $request->has('Wallets Payment methods') && is_array($request->input('Wallets Payment methods')) && count($request->input('Wallets Payment methods')) > 0;
        if ($request['wallet_required'] == 0 && $request['bank_required']) {
            return response()->json([
                'message' => 'You must provide either bank details or wallet payment methods.',
                'error' => true,
                'code' => 422
            ]);
        }
        try {
            $request['vendor_id'] = Crypt::decrypt($request->vendor_id);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            $request['vendor_id'] = $request->vendor_id;
        }

        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'BillingData_id' => 'nullable|integer',
            'BankData_id' => 'nullable|integer',
            'billing_status' => 'nullable|string|max:1',
            'billing_legal_name' => 'required|string|max:255',
            'billing_currency' => 'required|integer',
            'city' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'billing_address' => 'required|string|max:255',
            'Wallets Payment methods' => 'nullable|array|min:1',
            'Wallets Payment methods.*.method' => 'int|max:10',
            'Wallets Payment methods.*.account' => 'string|max:255',
            'Wallets Payment defaults.*.defaults' => 'int|max:1',
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
                $requestData = $request->only([
                    'billing_legal_name',
                    'billing_currency',
                    'city',
                    'street',
                    'billing_address',
                    'billing_status',
                    "wallet_required",
                    "bank_required"
                ]);
                if (empty($requestData['billing_status'])) {
                    $requestData['billing_status'] = '2';
                }
                $billingData->update($requestData);
            } else {
                $billingData = BillingData::create([
                    'vendor_id' => $request->input('vendor_id'),
                    'billing_legal_name' => $request->input('billing_legal_name'),
                    'billing_currency' => $request->input('billing_currency'),
                    'city' => $request->input('city'),
                    'street' => $request->input('street'),
                    'billing_address' => $request->input('billing_address'),
                    'billing_status' => "2",
                    "wallet_required" => $request->input('wallet_required'),
                    "bank_required" => $request->input('bank_required')
                ]);
            }
        } else {
            $billingData = BillingData::create([
                'vendor_id' => $request->input('vendor_id'),
                'billing_legal_name' => $request->input('billing_legal_name'),
                'billing_currency' => $request->input('billing_currency'),
                'city' => $request->input('city'),
                'street' => $request->input('street'),
                'billing_address' => $request->input('billing_address'),
                'billing_status' => "2",
                "wallet_required" => $request->input('wallet_required'),
                "bank_required" => $request->input('bank_required')
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
                            'defaults' => $wallet['defaults'],
                        ]);
                    }
                } else {
                    WalletsPaymentMethods::create([
                        'billing_data_id' => $billingData->id,
                        'method' => $wallet['method'],
                        'account' => $wallet['account'],
                        'defaults' => $wallet['defaults'],
                    ]);
                }
            }
        }

        $InvoiceController = new InvoiceController();
        $decID = Crypt::encrypt($request->input('vendor_id'));
        $BillingData = $InvoiceController->getVendorBillingData($decID);

        $vendor = Vendor::find($decID);
        if ($request->VendorSide == true) {
            $brand = $vendor->vendor_brands;
            $from = "vm.support@thetranslationgate.com";
            $cc = [$from];

            if ($brand == 1) {
                $from = "vm.support@thetranslationgate.com";
                $cc = [$from];
            } elseif ($brand == 2) {
                $from = "vm.support@localizera.com";
                $cc = [$from];
            } elseif ($brand == 3) {
                $from = "vm.support@europelocalize.com";
                $cc = [$from];
            } elseif ($brand == 4) {
                $from = "vm@afaqtranslations.com";
                $cc = ["vm@afaqtranslations.com", "nour.mahmoud@afaqtranslations.com"];
            } elseif ($brand == 11) {
                $from = "vm.support@columbuslang.com";
                $cc = [$from];
            }

            $mailData = [
                'subject' => 'Portal - Vendor Profile Updates',
                'title' => 'The vendor has made changes to their data',
                'billingData' => $BillingData,
            ];

            Mail::to($from)
                ->cc($cc)
                ->send(new UpdateDataMail($mailData));
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        DataLogger::addToLogger(
            $userId,
            'update_billing_data',
            $request->fullUrl(),
            'billing_data',
            $request->all(),
            $billingData->id
        );

        return response()->json($BillingData, 200);
    }

    // public function updateBillingData(Request $request)
    // {
    //     $hasBankDetails = $request->filled('bank_name') && $request->filled('account_holder') && $request->filled('swift_bic') && $request->filled('iban');
    //     $hasWalletMethods = $request->has('Wallets Payment methods') && is_array($request->input('Wallets Payment methods')) && count($request->input('Wallets Payment methods')) > 0;
    //     if ($request['wallet_required'] == 0 && $request['bank_required']) {
    //         return response()->json([
    //             'message' => 'You must provide either bank details or wallet payment methods.',
    //             'error' => true,
    //             'code' => 422
    //         ]);
    //     }
    //     try {
    //         $request['vendor_id'] = Crypt::decrypt($request->vendor_id);
    //     } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
    //         $request['vendor_id'] = $request->vendor_id;
    //     }

    //     $validator = Validator::make($request->all(), [
    //         'vendor_id' => 'required|integer',
    //         'BillingData_id' => 'nullable|integer',
    //         'BankData_id' => 'nullable|integer',
    //         'billing_status' => 'nullable|string|max:1',
    //         'billing_legal_name' => 'required|string|max:255',
    //         'billing_currency' => 'required|integer',
    //         'city' => 'required|string|max:255',
    //         'street' => 'required|string|max:255',
    //         'billing_address' => 'required|string|max:255',
    //         'Wallets Payment methods' => 'nullable|array|min:1',
    //         'Wallets Payment methods.*.method' => 'int|max:10',
    //         'Wallets Payment methods.*.account' => 'string|max:255',
    //         'Wallets Payment defaults.*.defaults' => 'int|max:1',

    //     ]);

    //     $validator->after(function ($validator) use ($request) {
    //         $hasBankDetails = $request->filled('bank_name') && $request->filled('account_holder') && $request->filled('swift_bic') && $request->filled('iban');
    //         $hasWalletMethods = $request->has('Wallets Payment methods') && is_array($request->input('Wallets Payment methods')) && count($request->input('Wallets Payment methods')) > 0;

    //         if (!$hasBankDetails && !$hasWalletMethods) {
    //             $validator->errors()->add('bank_or_wallet', 'You must provide either complete bank details or wallet payment methods.');
    //         }
    //     });

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     if ($request->filled('BillingData_id')) {
    //         $billingData = BillingData::find($request->input('BillingData_id'));
    //         if ($billingData) {
    //             $requestData = $request->only([
    //                 'billing_legal_name',
    //                 'billing_currency',
    //                 'city',
    //                 'street',
    //                 'billing_address',
    //                 'billing_status',
    //                 "wallet_required",
    //                 "bank_required"
    //             ]);
    //             if (empty($requestData['billing_status'])) {
    //                 $requestData['billing_status'] = '2';
    //             }
    //             $billingData->update($requestData);
    //         } else {
    //             $billingData = BillingData::create([
    //                 'vendor_id' => $request->input('vendor_id'),
    //                 'billing_legal_name' => $request->input('billing_legal_name'),
    //                 'billing_currency' => $request->input('billing_currency'),
    //                 'city' => $request->input('city'),
    //                 'street' => $request->input('street'),
    //                 'billing_address' => $request->input('billing_address'),
    //                 'billing_status' => "2",
    //                 "wallet_required" => $request->input('wallet_required'),
    //                 "bank_required" => $request->input('bank_required')
    //             ]);
    //         }
    //     } else {
    //         $billingData = BillingData::create([
    //             'vendor_id' => $request->input('vendor_id'),
    //             'billing_legal_name' => $request->input('billing_legal_name'),
    //             'billing_currency' => $request->input('billing_currency'),
    //             'city' => $request->input('city'),
    //             'street' => $request->input('street'),
    //             'billing_address' => $request->input('billing_address'),
    //             'billing_status' => "2",
    //             "wallet_required" => $request->input('wallet_required'),
    //             "bank_required" => $request->input('bank_required')
    //         ]);
    //     }

    //     if ($hasBankDetails) {
    //         if ($request->filled('BankData_id')) {
    //             $bankDetails = BankDetails::find($request->input('BankData_id'));
    //             if ($bankDetails) {
    //                 $bankDetails->update($request->only([
    //                     'bank_name',
    //                     'account_holder',
    //                     'swift_bic',
    //                     'iban',
    //                     'payment_terms',
    //                     'bank_address',
    //                 ]));
    //             } else {
    //                 $bankDetails = BankDetails::create([
    //                     'billing_data_id' => $billingData->id,
    //                     'bank_name' => $request->input('bank_name'),
    //                     'account_holder' => $request->input('account_holder'),
    //                     'swift_bic' => $request->input('swift_bic'),
    //                     'iban' => $request->input('iban'),
    //                     'payment_terms' => $request->input('payment_terms'),
    //                     'bank_address' => $request->input('bank_address'),
    //                 ]);
    //             }
    //         } else {
    //             $bankDetails = BankDetails::create([
    //                 'billing_data_id' => $billingData->id,
    //                 'bank_name' => $request->input('bank_name'),
    //                 'account_holder' => $request->input('account_holder'),
    //                 'swift_bic' => $request->input('swift_bic'),
    //                 'iban' => $request->input('iban'),
    //                 'payment_terms' => $request->input('payment_terms'),
    //                 'bank_address' => $request->input('bank_address'),
    //             ]);
    //         }
    //     }

    //     if ($hasWalletMethods) {
    //         foreach ($request->input('Wallets Payment methods') as $wallet) {
    //             if (isset($wallet['id'])) {
    //                 $walletUpdate = WalletsPaymentMethods::find($wallet['id']);
    //                 if ($walletUpdate) {
    //                     $walletUpdate->update([
    //                         'method' => $wallet['method'],
    //                         'account' => $wallet['account'],
    //                         'defaults' => $wallet['defaults'],

    //                     ]);
    //                 }
    //             } else {
    //                 WalletsPaymentMethods::create([
    //                     'billing_data_id' => $billingData->id,
    //                     'method' => $wallet['method'],
    //                     'account' => $wallet['account'],
    //                     'defaults' => $wallet['defaults'],

    //                 ]);
    //             }
    //         }
    //     }

    //     $InvoiceController = new InvoiceController();
    //     $decID = Crypt::encrypt($request->input('vendor_id'));
    //     $BillingData = $InvoiceController->getVendorBillingData($decID);
    //     if ($request->VendorSide == true) {
    //         $vmConfig = VmSetup::first();
    //         $mailData = [
    //             'subject' => 'Portal - Vendor Profile Updates',
    //             'title' => 'The vendor has made changes to their data',
    //             'billingData' => $BillingData,

    //         ];
    //         Mail::to($vmConfig->vm_email)->send(new UpdateDataMail($mailData));
    //     }
    //     return response()->json($BillingData, 200);
    // }
    // public function setPassword(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email|exists:vendor,email',
    //         'password' => 'required|min:8',
    //     ]);

    //     $email = $request->input('email');
    //     $password = $request->input('password');

    //     $vendor = Vendor::where('email', $email)->first();

    //     if ($vendor) {
    //         $vendor->password = base64_encode($password);
    //         $vendor->save();
    //         $details = [
    //             'subject' => 'Create password ',
    //             'title' => 'Create_password',
    //             'body' =>  $password,
    //             'brand' => env('BRAND', "Nexus"),

    //         ];
    //         Mail::to($email)->send(new VMmail($details, env('MAIL_FROM_ADDRESS')));
    //         return response()->json(['message' => 'Password updated successfully'], 200);
    //     }

    //     return response()->json(['message' => 'Vendor not found'], 404);
    // }

    public function setPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:vendor,email',
            'password' => 'required|min:8',
        ]);

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $email = $request->input('email');
        $password = $request->input('password');
        $vendor = Vendor::where('email', $email)->first();
        if ($vendor) {
            $vendor->password = base64_encode($password);
            $vendor->save();
            $nexusLink = env('NEXUS_LINK');
            switch ($vendor->vendor_brands) {
                case 1:
                    $subject   = "TTG || Nexus New Profile";
                    $vm_email  = "vm.support@thetranslationgate.com";
                    break;
                case 3:
                    $subject   = "Europe Localize || Nexus New Profile";
                    $vm_email  = "vm.support@europelocalize.com";
                    break;
                case 11:
                    $subject   = "ColumbusLang || Nexus New Profile";
                    $vm_email  = "vm.support@columbuslang.com";
                    break;
                case 2:
                    $subject   = "Localizera || Nexus New Profile";
                    $vm_email  = "vm.support@localizera.com";
                    break;
                default:
                    $subject   = "Nexus || New Profile";
                    $vm_email  = env('MAIL_FROM_ADDRESS');
            }

            $htmlTemplate = $this->getVendorEmailTemplate($vendor, $vendor->vendor_brands, $nexusLink);

            if (!$htmlTemplate) {
                return response()->json(['message' => 'Brand template not found'], 404);
            }

            Mail::send([], [], function ($message) use ($email, $htmlTemplate, $subject, $vm_email) {
                $message->to($email)
                    ->from($vm_email)
                    ->subject($subject)
                    ->html($htmlTemplate);
            });

            DataLogger::addToLogger(
                $userId,
                'set_password',
                $request->fullUrl(),
                'vendor',
                $vendor->toArray(),
                $vendor->id
            );

            return response()->json(['message' => 'Password updated successfully'], 200);
        }

        return response()->json(['message' => 'Vendor not found'], 404);
    }


    private function getVendorEmailTemplate($vendor, $brand, $nexusLink)
    {
        $password = base64_decode($vendor->password);

        switch ($brand) {
            case 1:
                return "
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Nexus | Site Manager</title>
                <style>
                    body {font-family: Helvetica, Arial, sans-serif; font-size:14px; color:#333;}
                </style>
            </head>
            <body>
                <p>Hello {$vendor->name},</p>
                <p>Hope you’re doing well. </p>
                <p>1<sup>st</sup>: We’d like to update you with our system process from now on :- </p>
                <p>2<sup>nd</sup>: We will create a new profile for you on <b>Nexus</b></p>
                <p>3<sup>rd</sup>: Initial username and password, and you can update your password later on</p>
                <p>4<sup>th</sup>: Your profile will include all of your data (to receive and accept jobs, Pos, create the invoice)</p>
                <p>5<sup>th</sup>: We will NOT consider any offline work, ONLY through the system as per the explained process above</p>
                <p>Below is your account information on Nexus:-</p>
                <p>Link: <a href='{$nexusLink}'>{$nexusLink}</a></p>
                <p>Email: {$vendor->email}</p>
                <p>Password: {$password}</p>
                <p><b>KINDLY UPDATE YOUR PASSWORD ONCE YOU LOGGED IN!</b></p>
                <p>For more instructions about Nexus: <a href='{$nexusLink}/home/instructions'>Click Here</a></p>
                <p>If you have any questions or feedback, contact us via 
                <a href='mailto:vendor.support@aixnexus.com'>vendor.support@aixnexus.com</a></p>
                <p>Thank you</p>
            </body>
            </html>";

            case 3:
                return "
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Europe Localize | Site Manager</title>
                <style>
                    body {font-family: Helvetica, Arial, sans-serif; font-size:14px; color:#333;}
                </style>
            </head>
            <body>
                <p>Hello {$vendor->name},</p>
                <p>We hope this finds you safe and sound. </p>
                <p>We would like to announce our upcoming system processes, as we are going to use a new portal called “Nexus” </p>
                <p>In order to get our work process done through “Nexus” please follow the below steps</p>
                <p>1<sup>st</sup> step: You need to create a new profile on Nexus</p>
                <p>2<sup>nd</sup>: You will create your Initial username and password. Afterwards, you can definitely change your password.</p>
                <p>3<sup>rd</sup>: Profile contains all your data (job acquisition and acceptance, POS, created invoices)</p>
                <p><b>Note :</b> Any offline work is not taken into consideration. We only consider online work through the system, following the process explained up above.</p>
                <p>Your Nexus account information is as follows:</p>
                <p>Link: <a href='{$nexusLink}'>{$nexusLink}</a></p>
                <p>Email: {$vendor->email}</p>
                <p>Password: {$password}</p>
                <p><b>After logging in, please change your password.</b></p>
                <p>For more information on using the system, kindly check: 
                <a href='{$nexusLink}/home/instructions'>Click Here</a></p>
                <p>For any questions, feedbacks, or comments, we are always happy to hear from you. 
                Please contact us at <a href='mailto:vendor.support@aixnexus.com'>vendor.support@aixnexus.com</a></p>
                <p>Thanks for your hard work on this. Please accept our deepest gratitude.</p>
            </body>
            </html>";

            case 11:
                return "
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Columbuslang | Site Manager</title>
                <style>
                    body {font-family: Helvetica, Arial, sans-serif; font-size:14px; color:#333;}
                </style>
            </head>
            <body>
                <p>Dear {$vendor->name},</p>
                <p>We hope this finds you well and in good health. </p>
                <p>Columbus Lang would like to announce the launch of our new system and the related processes; our new portal is now called “Nexus”. </p>
                <p>The following steps will introduce the process and how to get our work done through “Nexus”:</p>
                <p><b>Step 1:</b> You need to create a new profile on Nexus.</p>
                <p><b>Step 2:</b> You need to create your initial username and password. Your password can be changed later on.</p>
                <p><b>Step 3:</b> The profile includes all your data: Job Acquisition, Job Acceptance, Purchase Orders, and the Created Invoices.</p>
                <p><b>N.B:</b> Any offline work is not allowed. We only take into consideration the work completed online through Nexus.</p>
                <p><b>Please find below your login credentials for your Nexus account:</b></p>
                <p><b>Link:</b> <a href='{$nexusLink}'>{$nexusLink}</a></p>
                <p><b>Email:</b> {$vendor->email}</p>
                <p><b>Password:</b> {$password}</p>
                <p><b>Please make sure to change your password after signing in.</b></p>
                <p>For more information on using the system, kindly 
                <a href='{$nexusLink}/home/instructions'>Click Here</a></p>
                <p>For any questions, feedbacks or comments, please contact us at 
                <a href='mailto:vendor.support@aixnexus.com'>vendor.support@aixnexus.com</a></p>
                <p>We sincerely appreciate your time and efforts.</p>
            </body>
            </html>";

            case 2:
                return "
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Localizera | Site Manager</title>
                <style>
                    body {font-family: Helvetica, Arial, sans-serif; font-size:14px; color:#333;}
                </style>
            </head>
            <body>
                <p>Hello {$vendor->name},</p>
                <p>We hope this email finds you well and safe. </p>
                <p>We would like to announce the launch of Localizera’s new system “Nexus” and the respected processes. </p>
                <p>We will pave the way for you and share the required steps to complete our work on “Nexus”:</p>
                <p><b>• First Step:</b> You must create a new profile on Nexus.</p>
                <p><b>• Second Step:</b> You must create the initial username and password. You can update or change your password in the future.</p>
                <p><b>• Third Step:</b> The profile contains your data like Job Acquisition, Job Acceptance, Purchase Orders, and the Created Invoices.</p>
                <p><b>Note:</b> It is not permitted to perform any offline work. We take into account only the work completed online via Nexus.</p>
                <p><b>You may find below your login details for your Nexus account:</b></p>
                <p><b>Link:</b> <a href='{$nexusLink}'>{$nexusLink}</a></p>
                <p><b>Email:</b> {$vendor->email}</p>
                <p><b>Password:</b> {$password}</p>
                <p><b>Kindly update your password after signing in.</b></p>
                <p>For more information on how to navigate Nexus, please check out this link 
                <a href='{$nexusLink}/home/instructions'>Click Here</a></p>
                <p>For any questions, feedbacks or comments, please contact us at 
                <a href='mailto:vendor.support@aixnexus.com'>vendor.support@aixnexus.com</a></p>
                <p>Thank you so much for your time and attention.</p>
            </body>
            </html>";

            default:
                return null;
        }
    }

    public function AddExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'started_working' => 'required|digits:4',
            'experience_year' => 'required|integer',
            'summary' => 'nullable|string|max:255',
            'skills' => 'sometimes|required|array|min:1',
            'skills.*.skill' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

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

        DataLogger::addToLogger(
            $userId,
            'add_experience',
            $request->fullUrl(),
            'experience',
            $request->all(),
            $Experience->id
        );

        $data = $this->getVendorExperience($request->input('vendor_id'));
        return response()->json($data, 201);
    }
    public function UpdateExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer',
            'experience' => 'nullable|integer',
            'started_working' => 'required|digits:4',
            'experience_year' => 'required|integer',
            'summary' => 'nullable|string|max:255',
            'skills' => 'sometimes|required|array|min:1',
            'skills.*.skill' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $Experience = Experience::find($request->input("experience"));

        if (!$Experience) {
            $Experience = Experience::create([
                'vendor_id' => $request->input('vendor_id'),
                'started_working' => $request->input('started_working'),
                'experience_year' => $request->input('experience_year'),
                'summary' => $request->input('summary'),
            ]);
            DataLogger::addToLogger(
                $userId,
                'create_experience',
                $request->fullUrl(),
                'experience',
                $request->all(),
                $Experience->id
            );
        } else {
            $Experience->update($request->only([
                'started_working',
                'experience_year',
                'summary',
            ]));
            DataLogger::addToLogger(
                $userId,
                'update_experience',
                $request->fullUrl(),
                'experience',
                $request->all(),
                $Experience->id
            );
        }

        if ($request->has('skills')) {
            foreach ($request['skills'] as $skill) {
                if (isset($skill['id'])) {
                    $skillUpdate = VendorSkill::find($skill['id']);
                    $skillId = is_numeric($skill['skill'])
                        ? $skill['skill']
                        : Skill::firstOrCreate(['name' => $skill['skill']])->id;
                    $skillUpdate->update([
                        'skill_id' => $skillId,
                    ]);
                    DataLogger::addToLogger(
                        $userId,
                        'update_skill',
                        $request->fullUrl(),
                        'vendor_skills',
                        $skill,
                        $skillUpdate->id
                    );
                } else {
                    $skillId = is_numeric($skill['skill'])
                        ? $skill['skill']
                        : Skill::firstOrCreate(['name' => $skill['skill']])->id;
                    $newSkill = VendorSkill::create([
                        'vendor_id' => $request->input('vendor_id'),
                        'skill_id' => $skillId,
                    ]);
                    DataLogger::addToLogger(
                        $userId,
                        'create_skill',
                        $request->fullUrl(),
                        'vendor_skills',
                        $skill,
                        $newSkill->id
                    );
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
        if (!$request->hasFile('cv') && !$request->hasFile('nda')) {
            return response()->json(['error' => 'Both CV and NDA files are required.'], 400);
        }

        $cvFile = $request->file('cv');
        $ndaFile = $request->file('nda');

        if ($cvFile->getSize() > 5 * 1024 * 1024) {
            $allowedExtensions = ['zip', 'rar'];
            if (!in_array($cvFile->getClientOriginalExtension(), $allowedExtensions)) {
                return response()->json(['error' => 'CV file must be ZIP or RAR if it is larger than 5MB.'], 400);
            }
        }

        if ($ndaFile->getSize() > 5 * 1024 * 1024) {
            $allowedExtensions = ['zip', 'rar'];
            if (!in_array($ndaFile->getClientOriginalExtension(), $allowedExtensions)) {
                return response()->json(['error' => 'NDA file must be ZIP or RAR if it is larger than 5MB.'], 400);
            }
        }

        DB::beginTransaction();

        try {
            $originalFileNameCV = $cvFile->getClientOriginalName();
            $encryptedFileName = Crypt::encrypt($originalFileNameCV);
            $cvFilePath = $cvFile->storeAs('cv_files', $encryptedFileName . '.' . $cvFile->getClientOriginalExtension());

            $originalFileNameNDA = $ndaFile->getClientOriginalName();
            $encryptedFileName = Crypt::encrypt($originalFileNameNDA);
            $ndaFilePath = $ndaFile->storeAs('nda_files', $encryptedFileName . '.' . $ndaFile->getClientOriginalExtension());

            $vendorId = $request->input('vendor_id');
            $vendor = Vendor::find($vendorId);
            if (!$vendor) {
                Storage::disk('external')->delete([$cvFilePath, $ndaFilePath]);
                return response()->json(['error' => 'Vendor not found.'], 404);
            }
            $vendor->cv = $cvFilePath;
            $vendor->NDA = $ndaFilePath;
            $vendor->save();

            $additionalFiles = [];
            foreach ($request->all() as $key => $value) {
                if (strpos($key, 'file_') === 0) {
                    $file = $request->file($key);
                    $fileTitle = $request->input("file_title_" . substr($key, 5));
                    $fileContent = $request->input("file_content_" . substr($key, 5));
                    if ($file) {
                        if ($file->getSize() > 5 * 1024 * 1024) {
                            $allowedExtensions = ['zip', 'rar'];
                            if (!in_array($file->getClientOriginalExtension(), $allowedExtensions)) {
                                return response()->json(['error' => 'Each additional file must be ZIP or RAR if it is larger than 5MB.'], 400);
                            }
                        }
                    }
                    if ($file) {
                        $originalFileName = $file->getClientOriginalName();
                        $encryptedFileName = Crypt::encrypt($originalFileName);
                        $filePath = $file->storeAs('other_files', $encryptedFileName . '.' . $file->getClientOriginalExtension());
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

            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;

            DataLogger::addToLogger(
                $userId,
                'upload_files',
                $request->fullUrl(),
                'vendor',
                [
                    'vendor_id' => $vendorId,
                    'cv' => $cvFilePath,
                    'nda' => $ndaFilePath,
                    'additional_files' => $additionalFiles
                ],
                $vendor->id
            );

            DB::commit();

            return response()->json([
                'message' => 'Files uploaded and vendor updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Storage::disk('external')->delete([$cvFilePath, $ndaFilePath]);
            foreach ($additionalFiles as $file) {
                Storage::disk('external')->delete($file['file_path']);
            }

            return response()->json([
                'error' => 'An error occurred while processing the request.',
            ], 500);
        }
    }
    public function NDA_vendor(Request $request)
    {
        if (!$request->hasFile('nda_file')) {
            return response()->json(['error' => ' NDA files are required.'], 400);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $ndaFile = $request->file('nda_file');
        DB::beginTransaction();
        try {
            $vendorId = Crypt::decrypt($request->input('vendor_id'));
            $vendor = Vendor::find($vendorId);
            if (!$vendor) {
                return response()->json(['error' => 'Vendor not found.'], 404);
            }

            $path = storage_path('app/external/nda_files');
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }

            $originalFileNameN = $ndaFile->getClientOriginalName();
            $encryptedFileName = Crypt::encryptString($originalFileNameN);
            $ndaFilePath = $ndaFile->storeAs('nda_files', $encryptedFileName . '.' . $ndaFile->getClientOriginalExtension(), 'external');

            $vendor->NDA = $ndaFilePath;
            $vendor->first_login = 1;
            $vendor->Approval_nda_date = $request->input('date');
            $vendor->save();

            DataLogger::addToLogger(
                $userId,
                'upload_nda',
                $request->fullUrl(),
                'vendor',
                ['vendor_id' => $vendor->id, 'nda_file' => $originalFileNameN, 'nda_path' => $ndaFilePath, 'approval_date' => $request->input('date')],
                $vendor->id
            );

            DB::commit();
            return response()->json([
                'message' => 'Files uploaded and vendor updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($ndaFilePath)) {
                Storage::disk('external')->delete([$ndaFilePath]);
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
        $filePath = Storage::disk('external')->path("{$directory}/{$fileName}");

        if (!Storage::disk('external')->exists("{$directory}/{$fileName}")) {
            return response()->json(['message' => 'File not found'], 404);
        }
        $encryptedFileName = pathinfo($fileName, PATHINFO_FILENAME);
        try {
            $originalFileName = Crypt::decryptString($encryptedFileName);
            // $originalFileName = trim($originalFileName, '_');
        } catch (\Exception $e) {
            return response()->download($filePath, $fileName);
            return response()->json(['message' => 'Invalid file encryption'], 400);
        }
        return response()->download($filePath, $originalFileName);
    }
    public function deleteFile(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $id = $request->input('id');
        $file = VendorFile::find($id);

        if (!$file) {
            return response()->json(['message' => 'File not found in database'], 404);
        }
        $fileData = $file->toArray();
        $filePath = $file->file_path;
        if (Storage::disk('external')->exists($filePath)) {
            Storage::disk('external')->delete($filePath);
        } else {
            return response()->json(['message' => 'File not found on server'], 404);
        }

        $file->delete();

        DataLogger::addToLogger(
            $userId,
            'delete_file',
            $request->fullUrl(),
            'vendor_files',
            $fileData,
            $id
        );

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

                if ($cvFile->getSize() > 5 * 1024 * 1024) {
                    $allowedExtensions = ['zip', 'rar'];
                    if (!in_array($cvFile->getClientOriginalExtension(), $allowedExtensions)) {
                        return response()->json(['error' => 'CV file must be ZIP or RAR if it is larger than 5MB.'], 400);
                    }
                }

                if ($vendor->cv && Storage::disk('external')->exists($vendor->cv)) {
                    Storage::disk('external')->delete($vendor->cv);
                }
                $path = storage_path('app/external/cv_files');
                if (!file_exists($path)) {
                    mkdir(
                        $path,
                        0777,
                        true
                    );
                }
                $originalFileName = $cvFile->getClientOriginalName();
                $encryptedFileName = Crypt::encryptString($originalFileName);
                $cvFilePath = $cvFile->storeAs('cv_files', $encryptedFileName . '.' . $cvFile->getClientOriginalExtension(), 'external');
                $vendor->cv = $cvFilePath;
                $vendor->save();
            }

            if ($request->hasFile('nda')) {
                $ndaFile = $request->file('nda');

                if ($ndaFile->getSize() > 5 * 1024 * 1024) {
                    $allowedExtensions = ['zip', 'rar'];
                    if (!in_array($ndaFile->getClientOriginalExtension(), $allowedExtensions)) {
                        return response()->json(['error' => 'NDA file must be ZIP or RAR if it is larger than 5MB.'], 400);
                    }
                }

                if ($vendor->NDA && Storage::disk('external')->exists($vendor->NDA)) {
                    Storage::disk('external')->delete($vendor->NDA);
                }
                $path = storage_path('app/external/nda_files');
                if (!file_exists($path)) {
                    mkdir(
                        $path,
                        0777,
                        true
                    );
                }
                $originalFileNameN = $ndaFile->getClientOriginalName();
                $encryptedFileName = Crypt::encryptString($originalFileNameN);
                $ndaFilePath = $ndaFile->storeAs('nda_files', $encryptedFileName . '.' . $ndaFile->getClientOriginalExtension(), 'external');
                $vendor->NDA = $ndaFilePath;
                $vendor->save();
            }

            $additionalFiles = [];
            foreach ($request->all() as $key => $value) {
                if (strpos($key, 'file_') === 0) {
                    $file = $request->file($key);
                    $fileId = $request->input("file_id_" . substr($key, 5));
                    $fileTitle = $request->input("file_title_" . substr($key, 5));
                    $fileContent = $request->input("file_content_" . substr($key, 5));

                    if ($file) {
                        if ($file->getSize() > 5 * 1024 * 1024) {
                            $allowedExtensions = ['zip', 'rar'];
                            if (!in_array($file->getClientOriginalExtension(), $allowedExtensions)) {
                                return response()->json(['error' => 'Each additional file must be ZIP or RAR if it is larger than 5MB.'], 400);
                            }
                        }
                    }

                    if ($fileId) {
                        $vendorFile = VendorFile::find($fileId);
                        if ($vendorFile) {
                            if ($vendorFile->file_path && Storage::disk('external')->exists($vendorFile->file_path)) {
                                Storage::disk('external')->delete($vendorFile->file_path);
                            }
                            $path = storage_path('app/external/other_files');
                            if (!file_exists($path)) {
                                mkdir(
                                    $path,
                                    0777,
                                    true
                                );
                            }
                            $originalFileName = $file->getClientOriginalName();
                            $encryptedFileName = Crypt::encryptString($originalFileName);
                            $filePath = $file->storeAs('other_files', $encryptedFileName . '.' . $file->getClientOriginalExtension(), 'external');

                            $vendorFile->file_path = $filePath;
                            $vendorFile->file_title = $fileTitle;
                            $vendorFile->file_content = $fileContent;
                            $vendorFile->save();
                        } else {
                            return response()->json(['error' => 'File not found for the provided ID.'], 404);
                        }
                    } else {
                        if ($file) {
                            $path = storage_path('app/external/other_files');
                            if (!file_exists($path)) {
                                mkdir(
                                    $path,
                                    0777,
                                    true
                                );
                            }
                            $originalFileName = $file->getClientOriginalName();
                            $encryptedFileName = Crypt::encryptString($originalFileName);
                            $filePath = $file->storeAs('other_files', $encryptedFileName . '.' . $file->getClientOriginalExtension(), 'external');

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
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;
            DataLogger::addToLogger(
                $userId,
                'update_vendor_files',
                $request->fullUrl(),
                'vendor_files',
                $request->all(),
                $vendor->id
            );
            DB::commit();
            return response()->json([
                'message' => 'Files updated and vendor information saved successfully.',
                'files' => $this->getVendorFiles($vendorId)
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Storage::disk('external')->delete($cvFilePath);
            Storage::disk('external')->delete($ndaFilePath);
            foreach ($additionalFiles as $file) {
                Storage::disk('external')->delete($file['file_path']);
            }
            return response()->json($e->getMessage(), 500);
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
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $message = InstantMessaging::find($request->id);

        if (!$message) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        $messageData = $message->toArray();

        $response = $this->deleteItem($request, InstantMessaging::class);

        DataLogger::addToLogger(
            $userId,
            'delete_message',
            $request->fullUrl(),
            'instant_messaging',
            $messageData,
            $request->id
        );

        return $response;
    }

    public function AddPriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor' => 'required|integer',
            'subject' => 'required|integer',
            'sub_subject' => 'nullable|integer',
            'service' => 'required|integer',
            'task_type' => 'required|integer',
            'source_lang' => 'required|integer',
            'target_lang' => 'required|integer',
            'dialect' => 'nullable|integer',
            'dialect_target' => 'nullable|integer',
            'unit' => 'required|integer',
            'rate' => 'required|numeric',
            'special_rate' => 'nullable|numeric',
            'Status' => 'required|string',
            'currency' => 'required|integer',
            'sheet_brand' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $data = $request->all();
        $data['dialect'] = $data['dialect'] ?? null;
        $data['dialect_target'] = $data['dialect_target'] ?? null;
        $data['currency'] = $data['currency'] ?? null;
        $data['sub_subject'] = $data['sub_subject'] ?? null;

        $vendorSheet = VendorSheet::create($data);

        $vendorSheet->load([
            'source_lang:id,name',
            'target_lang:id,name',
            'dialect:id,dialect',
            'dialect_target:id,dialect',
            'service:id,name',
            'task_type:id,name',
            'unit:id,name',
            'currency:id,name',
            'subject:id,name',
            'sub_subject:id,name',
            'sheet_brand:id,name',
        ]);

        DataLogger::addToLogger(
            $userId,
            'add_price_list',
            $request->fullUrl(),
            'vendor_sheet',
            $request->all(),
            $vendorSheet->id
        );

        return response()->json($vendorSheet, 201);
    }

    public function getpriceListByVendorId($vendorId)
    {
        $vendorData = VendorSheet::with([
            'source_lang:id,name',
            'target_lang:id,name',
            'dialect:id,dialect',
            'dialect_target:id,dialect',
            'service:id,name',
            'task_type:id,name',
            'unit:id,name',
            'currency:id,name',
            'subject:id,name',
            'sub_subject:id,name',
            'sheet_brand:id,name'
        ])->where('vendor', $vendorId)->get(['id', 'vendor', 'subject', 'sub_subject', 'service', 'task_type', 'source_lang', 'target_lang', 'dialect', 'dialect_target', 'unit', 'rate', 'special_rate', 'Status', 'currency', 'sheet_brand']);

        if ($vendorData->isEmpty()) {
            return response()->json([
                'message' => 'No data found for the given vendor ID.'
            ], 404);
        }
        return $vendorData;
    }
    public function deletePricelist(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $row = VendorSheet::find($request->id);

        if (!$row) {
            return response()->json(['error' => 'Record not found'], 404);
        }

        $rowData = $row->toArray();

        $result = $this->deleteItem($request, VendorSheet::class);

        DataLogger::addToLogger(
            $userId,
            'delete_pricelist',
            $request->fullUrl(),
            'vendor_sheet',
            $rowData,  
            $request->id
        );

        return $result;
    }


    public function UpdatePriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'subject' => 'required|integer',
            'sub_subject' => 'nullable|integer',
            'service' => 'required|integer',
            'task_type' => 'required|integer',
            'source_lang' => 'required|integer',
            'target_lang' => 'required|integer',
            'dialect' => 'nullable|integer',
            'dialect_target' => 'nullable|integer',
            'unit' => 'required|integer',
            'rate' => 'required|numeric',
            'special_rate' => 'nullable|numeric',
            'Status' => 'required|string',
            'currency' => 'required|integer',
            'sheet_brand' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $vendorSheet = VendorSheet::findOrFail($request->input("id"));
        $data = $request->except(['vendor']);
        $data['dialect'] = $data['dialect'] ?? null;
        $data['dialect_target'] = $data['dialect_target'] ?? null;
        $data['currency'] = $data['currency'] ?? null;
        $data['sub_subject'] = $data['sub_subject'] ?? null;

        $vendorSheet->update($data);

        DataLogger::addToLogger(
            $userId,
            'update_price_list',
            $request->fullUrl(),
            'vendor_sheet',
            $request->all(),
            $vendorSheet->id
        );

        $vendorSheet->load([
            'source_lang:id,name',
            'target_lang:id,name',
            'dialect:id,dialect',
            'dialect_target:id,dialect',
            'service:id,name',
            'task_type:id,name',
            'unit:id,name',
            'currency:id,name',
            'subject:id,name',
            'sub_subject:id,name',
            'sheet_brand:id,name'
        ]);

        $vendorSheet->makeHidden([
            'created_at',
            'created_by',
            'sheet_fields',
            'sheet_tools',
            'comment',
            'copied',
            'tools',
            'ticket_id',
            'i',
        ]);

        return response()->json($vendorSheet, 200);
    }
    // public function UpdatePriceList(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'id' => 'required|integer',
    //         'subject' => 'required|integer',
    //         'sub_subject' => 'nullable|integer',
    //         'service' => 'required|integer',
    //         'task_type' => 'required|integer',
    //         'source_lang' => 'required|integer',
    //         'target_lang' => 'required|integer',
    //         'dialect' => 'nullable|integer',
    //         'dialect_target' => 'nullable|integer',
    //         'unit' => 'required|integer',
    //         'rate' => 'required|numeric',
    //         'special_rate' => 'nullable|numeric',
    //         'Status' => 'required|string',
    //         'currency' => 'required|integer',
    //         'sheet_brand' => 'required|integer',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     $user = JWTAuth::parseToken()->authenticate();
    //     $userId = $user->id;

    //     $vendorSheet = VendorSheet::findOrFail($request->input("id"));

    //     $data = $request->except(['vendor']);
    //     $data['dialect'] = $data['dialect'] ?? null;
    //     $data['dialect_target'] = $data['dialect_target'] ?? null;
    //     $data['currency'] = $data['currency'] ?? null;
    //     $data['sub_subject'] = $data['sub_subject'] ?? null;

    //     $vendorSheet->update($data);

    //     VendorSheet::where('vendor', $vendorSheet->vendor)
    //         ->where('id', '!=', $vendorSheet->id)
    //         ->update(['currency' => $data['currency']]);

    //     DataLogger::addToLogger(
    //         $userId,
    //         'update_price_list',
    //         $request->fullUrl(),
    //         'vendor_sheet',
    //         $request->all(),
    //         $vendorSheet->id
    //     );

    //     $vendorSheet->load([
    //         'source_lang:id,name',
    //         'target_lang:id,name',
    //         'dialect:id,dialect',
    //         'dialect_target:id,dialect',
    //         'service:id,name',
    //         'task_type:id,name',
    //         'unit:id,name',
    //         'currency:id,name',
    //         'subject:id,name',
    //         'sub_subject:id,name',
    //         'sheet_brand:id,name'
    //     ]);

    //     $vendorSheet->makeHidden([
    //         'created_at',
    //         'created_by',
    //         'sheet_fields',
    //         'sheet_tools',
    //         'comment',
    //         'copied',
    //         'tools',
    //         'ticket_id',
    //         'i',
    //     ]);

    //     return response()->json($vendorSheet, 200);
    // }
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

            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;

            DataLogger::addToLogger(
                $userId,
                'add_vendor_tools',
                $request->fullUrl(),
                'vendor_tools',
                $request->all(),
                $vendorId
            );

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
        DB::beginTransaction();
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;

            $vendorId = $request->input('vendor_id');
            $testType = $request->input('test_type');
            $testResult = $request->input('test_result');
            $sourceLang = $request->input('source_lang');
            $targetLang = $request->input('target_lang');
            $main_subject = $request->input('main_subject');
            $sub_subject = $request->input('sub_subject');
            $service = $request->input('service');
            $vendor = VendorTest::where('vendor_id', $vendorId)->first();

            if (!$vendor) {
                $vendor = new VendorTest();
                $vendor->vendor_id = $vendorId;
                if (!$request->hasFile('test')) {
                    return response()->json(['error' => 'Test file is required.'], 400);
                }
                $testFile = $request->file('test');
            }

            $vendor->test_type = $testType;
            $vendor->test_result = $testResult;
            $vendor->source_lang = $sourceLang;
            $vendor->target_lang = $targetLang;
            $vendor->main_subject = $main_subject;
            $vendor->sub_subject = $sub_subject;
            $vendor->service = $service;

            if ($request->file('test')) {
                if ($vendor->test_upload && Storage::disk('external')->exists($vendor->test_upload)) {
                    Storage::disk('external')->delete($vendor->test_upload);
                }
                $path = storage_path('app/external/vendortests');
                if (!file_exists($path)) {
                    mkdir($path, 0777, true);
                }
                $originalFileName = $testFile->getClientOriginalName();
                $encryptedFileName = Crypt::encryptString($originalFileName);
                $filePath = $testFile->storeAs('vendortests', $encryptedFileName . '.' . $testFile->getClientOriginalExtension(), 'external');
                $vendor->test_upload = $filePath;
            }

            $vendor->save();

            DataLogger::addToLogger(
                $userId,
                'add_vendor_test',
                $request->fullUrl(),
                'vendor_tests',
                $request->all(),
                $vendor->id
            );

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
                'source_lang' => function ($query) {
                    $query->select('id', 'name');
                },
                'target_lang' => function ($query) {
                    $query->select('id', 'name');
                },
                'main_subject' => function ($query) {
                    $query->select('id', 'name');
                },
                'sub_subject' => function ($query) {
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

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

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

        DataLogger::addToLogger(
            $userId,
            'save_or_update_messages',
            $request->fullUrl(),
            'instant_messaging',
            $request->all(),
            $vendor_id
        );

        $data = $this->getMessagesByVendorId($vendor_id);
        return response()->json($data, 200);
    }

   
    public function saveOrUpdateEducation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|integer|exists:vendor,id',
            'university_name' => 'required|string|max:255',
            'latest_degree' => 'required|integer|max:255',
            'year_of_graduation' => 'required|integer',
            'major' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $vendorId = $request->input('vendor_id');
        $vendorEducation = VendorEducation::where('vendor_id', $vendorId)->first();

        if ($vendorEducation) {
            $vendorEducation->update([
                'university_name' => $request->input('university_name'),
                'latest_degree' => $request->input('latest_degree'),
                'year_of_graduation' => $request->input('year_of_graduation'),
                'major' => $request->input('major'),
            ]);

            DataLogger::addToLogger(
                $userId,
                'update_education',
                $request->fullUrl(),
                'vendor_education',
                $request->all(),
                $vendorEducation->id
            );

            return response()->json(['message' => 'Education data updated successfully.'], 200);
        } else {
            $newEducation = VendorEducation::create([
                'vendor_id' => $vendorId,
                'university_name' => $request->input('university_name'),
                'latest_degree' => $request->input('latest_degree'),
                'year_of_graduation' => $request->input('year_of_graduation'),
                'major' => $request->input('major'),
            ]);

            DataLogger::addToLogger(
                $userId,
                'create_education',
                $request->fullUrl(),
                'vendor_education',
                $request->all(),
                $newEducation->id
            );

            return response()->json(['message' => 'Education data added successfully.'], 201);
        }
    }


    public function getEducationByVendorId($vendorId)
    {
        $education = VendorEducation::where('vendor_id', $vendorId)
            ->with('latest_degree:id,name')
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
    public function changeFormat(Request $request)
    {
        try {

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
        } else {
            DB::table('formatsTable')
                ->where('table', $tableName)
                ->where('user_id', $userId)
                ->update(['status' => 0]);
        }
        return response()->json([
            'message' => 'The format has been changed.'
        ], 201);
    }

    public function updateFormat(Request $request)
    {
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

        return response()->json($updatedFormat, 200);
    }

    public function deleteFormat(Request $request)
    {
        return $this->deleteItem($request, Formatstable::class);
    }
    public function getPriceListById(Request $request)
    {
        $id = $request->input("id");
        $vendorData = VendorSheet::with([
            'source_lang:id,name',
            'target_lang:id,name',
            'dialect:id,dialect',
            'dialect_target:id,dialect',
            'service:id,name',
            'task_type:id,name',
            'unit:id,name',
            'currency:id,name',
            'subject:id,name',
            'sub_subject:id,name',
            'sheet_brand:id,name'
        ])->where('id', $id)->get(['id',  'subject', 'sub_subject', 'service', 'task_type', 'source_lang', 'target_lang', 'dialect', 'dialect_target', 'unit', 'rate', 'special_rate', 'Status', 'currency', 'sheet_brand']);

        if ($vendorData->isEmpty()) {
            return response()->json([
                'message' => 'No data found for the given  ID.'
            ], 404);
        }
        return response()->json($vendorData, 200);
    }

    public function getDashboardChart(Request $request)
    {
        $cacheKey = 'dashboard_chart_data';
        $cacheTime = now()->addMinutes(60);
        $data = Cache::remember($cacheKey, $cacheTime, function () {
            return [
                "Vendors" => $this->getVendorsChart(),
                "TaskStatus" => $this->countTaskStatus(),
                "service" => $this->getServiceChart(),
                "taskType" => $this->getTaskTypeChart(),
                "source" => $this->getSourceChart(),
                "target" => $this->getTargetChart(),
                "requestType" => $this->countTicketsType(),
            ];
        });

        return response()->json($data, 200);
    }

    public function getVendorsChart()
    {
        $startDate = Carbon::now()->subMonths(6)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();
        $Vendors = DB::table('vendor')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as total')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();
        return $Vendors;
    }
    public function countTaskStatus()
    {
        $statusesCount = DB::table('job_task')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get();
        return $statusesCount;
    }
    public function countTicketsType()
    {
        $request_type = DB::table('vm_ticket')
            ->select('request_type', DB::raw('COUNT(*) as total'))
            ->groupBy('request_type')
            ->get();
        return $request_type;
    }
    public function getSourceChart()
    {
        $data = DB::table('job_task')
            ->leftJoin('job', 'job_task.job_id', '=', 'job.id')
            ->leftJoin('job_price_list', 'job.price_list', '=', 'job_price_list.id')
            ->leftJoin('languages', 'job_price_list.source', '=', 'languages.id')
            ->select('languages.name as source_name', DB::raw('COUNT(*) as total'))
            ->groupBy('languages.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        return $data;
    }
    public function getTargetChart()
    {
        $data = DB::table('job_task')
            ->leftJoin('job', 'job_task.job_id', '=', 'job.id')
            ->leftJoin('job_price_list', 'job.price_list', '=', 'job_price_list.id')
            ->leftJoin('languages', 'job_price_list.target', '=', 'languages.id')
            ->select('languages.name as target_name', DB::raw('COUNT(*) as total'))
            ->groupBy('languages.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        return $data;
    }
    public function getServiceChart()
    {

        $data = DB::table('job_task')
            ->leftJoin('job', 'job_task.job_id', '=', 'job.id')
            ->leftJoin('job_price_list', 'job.price_list', '=', 'job_price_list.id')
            ->leftJoin('services', 'job_price_list.service', '=', 'services.id')
            ->select('services.name as service_name', DB::raw('COUNT(*) as total'))
            ->groupBy('services.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        return $data;
    }
    public function getTaskTypeChart()
    {

        $data = DB::table('job_task')
            ->leftJoin('job', 'job_task.job_id', '=', 'job.id')
            ->leftJoin('job_price_list', 'job.price_list', '=', 'job_price_list.id')
            ->leftJoin('task_type', 'job_price_list.task_type', '=', 'task_type.id')
            ->select('task_type.name as task_type_name', DB::raw('COUNT(*) as total'))
            ->groupBy('task_type.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();
        return $data;
    }

    public function storeBankData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'account_holder'  => 'required|string',
            'bank_address'    => 'required|string',
            'bank_name'       => 'required|string',
            'billing_data_id' => 'required|integer|unique:bank_details,billing_data_id',
            'iban'            => 'required|string',
            'payment_terms'   => 'required|string',
            'swift_bic'       => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $bankData = BankDetails::create([
            'account_holder'  => $request->account_holder,
            'bank_address'    => $request->bank_address,
            'bank_name'       => $request->bank_name,
            'billing_data_id' => $request->billing_data_id,
            'iban'            => $request->iban,
            'payment_terms'   => $request->payment_terms,
            'swift_bic'       => $request->swift_bic,
        ]);

        DataLogger::addToLogger(
            $userId,
            'create_bank_data',
            $request->fullUrl(),
            'bank_details',
            $request->all(),
            $bankData->id
        );

        return response()->json([
            'status' => true,
            'message' => 'Bank data saved successfully.',
            'data' => $bankData
        ]);
    }

    public function storeWalletData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'method' => 'required|integer',
            'account'   => 'required|string',
            'billing_data_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $walletData = WalletsPaymentMethods::create([
            'method'  => $request->method,
            'account'    => $request->account,
            'defaults'       => 1,
            'billing_data_id' => $request->billing_data_id,
        ]);

        $walletData->load('method');

        DataLogger::addToLogger(
            $userId,
            'create_wallet_data',
            $request->fullUrl(),
            'wallets_payment_methods',
            $request->all(),
            $walletData->id
        );

        return response()->json([
            'status' => true,
            'message' => 'wallet data saved successfully.',
            'data' => [$walletData]
        ]);
    }

    public function storeUserTask(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalid or expired'], 401);
        }

        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'due_date'    => 'required|date',
            'status'      => 'nullable|integer',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $id = DB::table('user_tasks')->insertGetId([
            'user_id'     => $user->id,
            'title'       => $request->title,
            'due_date'    => $request->due_date,
            'status'      => $request->status,
            'description' => $request->description,
            'created_at'  => now(),
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => [
                'id' => $id,
                'title' => $request->title,
                'due_date' => $request->due_date,
                'status' => $request->status,
                'description' => $request->description,
                'created_at' => now(),
            ]
        ], 201);
    }

    public function getUserTasks(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalid or expired'], 401);
        }

        $limit = $request->input('limit', 5);
        $offset = $request->input('offset', 0);

        $query = DB::table('user_tasks')->where('user_id', $user->id);

        $total = $query->count();
        $tasks = $query->orderByDesc('due_date')->offset($offset)->limit($limit)->get();

        return response()->json([
            'tasks' => $tasks,
            'total' => $total,
        ], 200);
    }
    public function updateTaskStatus(Request $request)
    {
        $request->validate([
            'task_id' => 'required|integer|exists:user_tasks,id',
            'status' => 'required|integer',
        ]);

        $updated = DB::table('user_tasks')
            ->where('id', $request->task_id)
            ->update(['status' => $request->status]);

        if ($updated) {
            return response()->json(['message' => 'Task status updated successfully.'], 200);
        } else {
            return response()->json(['error' => 'Task not found or not updated.'], 404);
        }
    }
    public function updateTask(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:user_tasks,id',
            'title' => 'required|string|max:255',
            'due_date' => 'required|date',
            'status' => 'required|integer',
            'description' => 'required|string',
        ]);

        $updated = DB::table('user_tasks')
            ->where('id', $request->id)
            ->update([
                'title' => $request->title,
                'due_date' => $request->due_date,
                'status' => $request->status,
                'description' => $request->description,
                'updated_at' => now(),
            ]);

        if ($updated) {
            return response()->json(['message' => 'Task updated successfully.']);
        }

        return response()->json(['error' => 'Task not found or not updated.'], 404);
    }
    public function deleteTask($id)
    {
        $deleted = DB::table('user_tasks')->where('id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Task deleted successfully.']);
        }

        return response()->json(['error' => 'Task not found or could not be deleted.'], 404);
    }
    public function getAllUserTasks(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalid or expired'], 401);
        }

        $perPage = $request->input('per_page', 5);
        $sortBy = $request->input('sort_by', 'due_date');
        $sortOrder = $request->input('sort_order', 'desc');
        $queryParams = $request->input('queryParams', []);

        $allowedSorts = ['id', 'created_at', 'due_date', 'title'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'due_date';
        }

        $query = DB::table('user_tasks')->where('user_id', $user->id);

        foreach ($queryParams as $key => $val) {
            if (empty($val)) continue;

            if (Str::startsWith($key, 'start_date_')) {
                $column = Str::after($key, 'start_date_');
                $query->whereDate($column, '>=', $val);
            } elseif (Str::startsWith($key, 'end_date_')) {
                $column = Str::after($key, 'end_date_');
                $query->whereDate($column, '<=', $val);
            } elseif (is_array($val)) {
                $query->where(function ($q) use ($key, $val) {
                    foreach ($val as $index => $v) {
                        $index === 0
                            ? $q->where($key, 'like', '%' . $v . '%')
                            : $q->orWhere($key, 'like', '%' . $v . '%');
                    }
                });
            } else {
                $query->where($key, 'like', '%' . $val . '%');
            }
        }


        $tasks = $query->orderBy($sortBy, $sortOrder)->paginate($perPage);

        return response()->json([
            'tasks' => $tasks->items(),
            'total' => $tasks->total(),
            'current_page' => $tasks->currentPage(),
            'last_page' => $tasks->lastPage(),
            'per_page' => $tasks->perPage(),
        ], 200);
    }
    public function vendorLogs(Request $request)
    {
        $vendorId = $request->input('vendor_id');
        if (!$vendorId) {
            return response()->json(['error' => 'vendor_id is required'], 400);
        }
        $billingDataIds = DB::table('billing_data')
            ->where('vendor_id', $vendorId)
            ->pluck('id')
            ->toArray();
        $logsQuery = DataLogger::queryVendorLogs($vendorId, $billingDataIds);
        $logs = $logsQuery
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return response()->json($logs);
    }
}
