<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InHousePriceList;
use App\Models\InHouseLanguage;
use App\Models\InHouseUnitConversion;
use App\Models\Vendor;
use App\Models\DataLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class InHousePriceListController extends Controller
{
    public function getInHouseData(Request $request)
    {
        try {
            $vendorId = $request->input('vendor_id');

            $vendor = Vendor::find($vendorId);

            if (!$vendor || $vendor->type != 1) {
                return response()->json([
                    'message' => 'Vendor not found or not In House type'
                ], 404);
            }

            $priceLists = InHousePriceList::where('vendor_id', $vendorId)
                ->with([
                    'currencyRelation:id,name',
                    'languages.sourceLanguageRelation:id,name',
                    'languages.targetLanguageRelation:id,name',
                    'languages.sourceDialectRelation:id,dialect',
                    'languages.targetDialectRelation:id,dialect'
                ])
                ->orderBy('start_date', 'desc')
                ->get();

            $unitConversions = InHouseUnitConversion::where('vendor_id', $vendorId)
                ->with(['taskType:id,name', 'unitFromRelation:id,name', 'unitToRelation:id,name'])
                ->get();

            return response()->json([
                'priceLists' => $priceLists,
                'unitConversions' => $unitConversions
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function savePriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|exists:vendor,id',
            'currency' => 'required|exists:currency,id',
            'quota_hours' => 'required|integer|min:0',
            'salary' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
            'languages' => 'array',
            'languages.*.source_language' => 'required|exists:languages,id',
            'languages.*.target_language' => 'required|exists:languages,id',
            'languages.*.source_dialect' => 'nullable|exists:dialect,id',
            'languages.*.target_dialect' => 'nullable|exists:dialect,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $vendor = Vendor::find($request->vendor_id);

            if ($vendor->type != 1) {
                return response()->json([
                    'message' => 'Vendor is not In House type'
                ], 400);
            }

            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            $dayOfMonth = $startDate->day;
            $monthsDiff = $startDate->diffInMonths($endDate);

            $overlapping = InHousePriceList::where('vendor_id', $request->vendor_id)
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                });

            if ($overlapping->exists()) {
                return response()->json([
                    'message' => 'Date range overlaps with existing price list'
                ], 400);
            }

            DB::beginTransaction();

            $priceList = InHousePriceList::create([
                'vendor_id' => $request->vendor_id,
                'currency' => $request->currency,
                'quota_hours' => $request->quota_hours,
                'salary' => $request->salary,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'is_active' => $request->is_active ?? false
            ]);

            if ($request->has('languages') && is_array($request->languages)) {
                foreach ($request->languages as $languageData) {
                    InHouseLanguage::create([
                        'vendor_id' => $request->vendor_id,
                        'price_list_id' => $priceList->id,
                        'source_language' => $languageData['source_language'],
                        'source_dialect' => $languageData['source_dialect'] ?? null,
                        'target_language' => $languageData['target_language'],
                        'target_dialect' => $languageData['target_dialect'] ?? null
                    ]);
                }
            }

            DataLogger::addToLogger(
                Auth::user()->id,
                'create',
                $request->url(),
                'in_house_price_lists',
                $priceList->toArray(),
                $priceList->id
            );

            DB::commit();

            $priceList->load([
                'currencyRelation:id,name',
                'languages.sourceLanguageRelation:id,name',
                'languages.targetLanguageRelation:id,name',
                'languages.sourceDialectRelation:id,dialect',
                'languages.targetDialectRelation:id,dialect'
            ]);

            return response()->json([
                'message' => 'Price list created successfully',
                'priceList' => $priceList
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_price_lists,id',
            'vendor_id' => 'required|exists:vendor,id',
            'currency' => 'required|exists:currency,id',
            'quota_hours' => 'required|integer|min:0',
            'salary' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $priceList = InHousePriceList::find($request->id);

            if ($priceList->vendor_id != $request->vendor_id) {
                return response()->json([
                    'message' => 'Invalid vendor ID'
                ], 400);
            }

            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            $dayOfMonth = $startDate->day;

            $overlapping = InHousePriceList::where('vendor_id', $request->vendor_id)
                ->where('id', '!=', $request->id)
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                });

            if ($overlapping->exists()) {
                return response()->json([
                    'message' => 'Date range overlaps with existing price list'
                ], 400);
            }

            $oldData = $priceList->toArray();

            $priceList->update([
                'currency' => $request->currency,
                'quota_hours' => $request->quota_hours,
                'salary' => $request->salary,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'is_active' => $request->is_active ?? false
            ]);

            DataLogger::addToLogger(
                Auth::user()->id,
                'update',
                $request->url(),
                'in_house_price_lists',
                [
                    'old' => $oldData,
                    'new' => $priceList->toArray()
                ],
                $priceList->id
            );

            $priceList->load([
                'currencyRelation:id,name',
                'languages.sourceLanguageRelation:id,name',
                'languages.targetLanguageRelation:id,name',
                'languages.sourceDialectRelation:id,dialect',
                'languages.targetDialectRelation:id,dialect'
            ]);

            return response()->json([
                'message' => 'Price list updated successfully',
                'priceList' => $priceList
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deletePriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_price_lists,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $priceList = InHousePriceList::find($request->id);
            $deletedData = $priceList->toArray();

            $priceList->delete();

            DataLogger::addToLogger(
                Auth::user()->id,
                'delete',
                $request->url(),
                'in_house_price_lists',
                $deletedData,
                $request->id
            );

            return response()->json([
                'message' => 'Price list deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function togglePriceListStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_price_lists,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $priceList = InHousePriceList::find($request->id);

            $newStatus = !$priceList->is_active;

            // if ($newStatus) {
            //     $overlapping = InHousePriceList::where('vendor_id', $priceList->vendor_id)
            //         ->where('id', '!=', $request->id)
            //         ->where('is_active', true)
            //         ->where(function ($query) use ($priceList) {
            //             $query->whereBetween('start_date', [$priceList->start_date, $priceList->end_date])
            //                 ->orWhereBetween('end_date', [$priceList->start_date, $priceList->end_date])
            //                 ->orWhere(function ($q) use ($priceList) {
            //                     $q->where('start_date', '<=', $priceList->start_date)
            //                         ->where('end_date', '>=', $priceList->end_date);
            //                 });
            //         })
            //         ->exists();

            //     if ($overlapping) {
            //         return response()->json([
            //             'message' => 'Cannot activate: Another active price list exists in this date range'
            //         ], 400);
            //     }
            // }

            $oldData = $priceList->toArray();

            $priceList->update(['is_active' => $newStatus]);

            DataLogger::addToLogger(
                Auth::user()->id,
                'update',
                $request->url(),
                'in_house_price_lists',
                [
                    'old' => $oldData,
                    'new' => $priceList->toArray()
                ],
                $priceList->id
            );

            $priceList->load([
                'currencyRelation:id,name',
                'languages.sourceLanguageRelation:id,name',
                'languages.targetLanguageRelation:id,name',
                'languages.sourceDialectRelation:id,dialect',
                'languages.targetDialectRelation:id,dialect'
            ]);

            return response()->json([
                'message' => 'Status updated successfully',
                'priceList' => $priceList
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addLanguageToPriceList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'price_list_id' => 'required|exists:in_house_price_lists,id',
            'source_language' => 'required|exists:languages,id',
            'target_language' => 'required|exists:languages,id',
            'source_dialect' => 'nullable|exists:dialect,id',
            'target_dialect' => 'nullable|exists:dialect,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $exists = InHouseLanguage::where('price_list_id', $request->price_list_id)
                ->where('source_language', $request->source_language)
                ->where('target_language', $request->target_language)
                ->where('source_dialect', $request->source_dialect)
                ->where('target_dialect', $request->target_dialect)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This language pair already exists in this price list'
                ], 400);
            }
            $priceList = InHousePriceList::find($request->price_list_id);

            $language = InHouseLanguage::create([
                'price_list_id' => $request->price_list_id,
                'vendor_id' => $priceList->vendor_id,
                'source_language' => $request->source_language,
                'source_dialect' => $request->source_dialect,
                'target_language' => $request->target_language,
                'target_dialect' => $request->target_dialect
            ]);

            DataLogger::addToLogger(
                Auth::user()->id,
                'create',
                $request->url(),
                'in_house_languages',
                $language->toArray(),
                $language->id
            );

            $language->load([
                'sourceLanguageRelation:id,name',
                'targetLanguageRelation:id,name',
                'sourceDialectRelation:id,dialect',
                'targetDialectRelation:id,dialect'
            ]);

            return response()->json([
                'message' => 'Language pair added successfully',
                'language' => $language
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateLanguage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_languages,id',
            'price_list_id' => 'required|exists:in_house_price_lists,id',
            'source_language' => 'required|exists:languages,id',
            'target_language' => 'required|exists:languages,id',
            'source_dialect' => 'nullable|exists:dialect,id',
            'target_dialect' => 'nullable|exists:dialect,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $language = InHouseLanguage::find($request->id);

            if ($language->price_list_id != $request->price_list_id) {
                return response()->json([
                    'message' => 'Invalid price list ID'
                ], 400);
            }

            $exists = InHouseLanguage::where('price_list_id', $request->price_list_id)
                ->where('id', '!=', $request->id)
                ->where('source_language', $request->source_language)
                ->where('target_language', $request->target_language)
                ->where('source_dialect', $request->source_dialect)
                ->where('target_dialect', $request->target_dialect)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This language pair already exists in this price list'
                ], 400);
            }

            $oldData = $language->toArray();

            $language->update([
                'source_language' => $request->source_language,
                'source_dialect' => $request->source_dialect,
                'target_language' => $request->target_language,
                'target_dialect' => $request->target_dialect
            ]);

            DataLogger::addToLogger(
                Auth::user()->id,
                'update',
                $request->url(),
                'in_house_languages',
                [
                    'old' => $oldData,
                    'new' => $language->toArray()
                ],
                $language->id
            );

            $language->load([
                'sourceLanguageRelation:id,name',
                'targetLanguageRelation:id,name',
                'sourceDialectRelation:id,dialect',
                'targetDialectRelation:id,dialect'
            ]);

            return response()->json([
                'message' => 'Language pair updated successfully',
                'language' => $language
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteLanguage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_languages,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $language = InHouseLanguage::find($request->id);
            $deletedData = $language->toArray();

            $language->delete();

            DataLogger::addToLogger(
                Auth::user()->id,
                'delete',
                $request->url(),
                'in_house_languages',
                $deletedData,
                $request->id
            );

            return response()->json([
                'message' => 'Language deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function saveUnitConversion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|exists:vendor,id',
            'task_type_id' => 'required|exists:task_type,id',
            'unit_from' => 'required|exists:unit,id',
            'value_from' => 'required|numeric|min:0',
            'value_to' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $vendor = Vendor::find($request->vendor_id);

            if ($vendor->type != 1) {
                return response()->json([
                    'message' => 'Vendor is not In House type'
                ], 400);
            }

            $exists = InHouseUnitConversion::where('vendor_id', $request->vendor_id)
                ->where('task_type_id', $request->task_type_id)
                ->where('unit_from', $request->unit_from)
                ->where('unit_to', 1)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This unit conversion already exists'
                ], 400);
            }

            $conversion = InHouseUnitConversion::create([
                'vendor_id' => $request->vendor_id,
                'task_type_id' => $request->task_type_id,
                'unit_from' => $request->unit_from,
                'unit_to' => 1,
                'value_from' => $request->value_from,
                'value_to' => $request->value_to
            ]);

            DataLogger::addToLogger(
                Auth::user()->id,
                'create',
                $request->url(),
                'in_house_unit_conversions',
                $conversion->toArray(),
                $conversion->id
            );

            $conversion->load(['taskType:id,name', 'unitFromRelation:id,name', 'unitToRelation:id,name']);

            return response()->json([
                'message' => 'Unit conversion added successfully',
                'conversion' => $conversion
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUnitConversion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_unit_conversions,id',
            'vendor_id' => 'required|exists:vendor,id',
            'task_type_id' => 'required|exists:task_type,id',
            'unit_from' => 'required|exists:unit,id',
            'value_from' => 'required|numeric|min:0',
            'value_to' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $conversion = InHouseUnitConversion::find($request->id);

            if ($conversion->vendor_id != $request->vendor_id) {
                return response()->json([
                    'message' => 'Invalid vendor ID'
                ], 400);
            }

            $exists = InHouseUnitConversion::where('vendor_id', $request->vendor_id)
                ->where('id', '!=', $request->id)
                ->where('task_type_id', $request->task_type_id)
                ->where('unit_from', $request->unit_from)
                ->where('unit_to', 1)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This unit conversion already exists'
                ], 400);
            }

            $oldData = $conversion->toArray();

            $conversion->update([
                'task_type_id' => $request->task_type_id,
                'unit_from' => $request->unit_from,
                'unit_to' => 1,
                'value_from' => $request->value_from,
                'value_to' => $request->value_to
            ]);

            DataLogger::addToLogger(
                Auth::user()->id,
                'update',
                $request->url(),
                'in_house_unit_conversions',
                [
                    'old' => $oldData,
                    'new' => $conversion->toArray()
                ],
                $conversion->id
            );

            $conversion->load(['taskType:id,name', 'unitFromRelation:id,name', 'unitToRelation:id,name']);

            return response()->json([
                'message' => 'Unit conversion updated successfully',
                'conversion' => $conversion
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUnitConversion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_unit_conversions,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $conversion = InHouseUnitConversion::find($request->id);
            $deletedData = $conversion->toArray();

            $conversion->delete();

            DataLogger::addToLogger(
                Auth::user()->id,
                'delete',
                $request->url(),
                'in_house_unit_conversions',
                $deletedData,
                $request->id
            );

            return response()->json([
                'message' => 'Unit conversion deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
