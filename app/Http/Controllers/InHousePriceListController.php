<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InHousePriceList;
use App\Models\InHouseLanguage;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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

            $priceList = InHousePriceList::where('vendor_id', $vendorId)
                ->with('currencyRelation:id,name')
                ->first();

            $languages = InHouseLanguage::where('vendor_id', $vendorId)
                ->with([
                    'sourceLanguageRelation:id,name',
                    'targetLanguageRelation:id,name',
                    'sourceDialectRelation:id,dialect',
                    'targetDialectRelation:id,dialect'
                ])
                ->get();

            return response()->json([
                'priceList' => $priceList,
                'languages' => $languages
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function saveInHouseMainData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|exists:vendor,id',
            'currency' => 'required|exists:currency,id',
            'quota_hours' => 'required|integer|min:0',
            'salary' => 'required|numeric|min:0'
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

            $priceListData = [
                'vendor_id' => $request->vendor_id,
                'currency' => $request->currency,
                'quota_hours' => $request->quota_hours,
                'salary' => $request->salary
            ];

            $priceList = InHousePriceList::updateOrCreate(
                ['vendor_id' => $request->vendor_id],
                $priceListData
            );

            $priceList->load('currencyRelation:id,name');

            return response()->json([
                'message' => 'Basic information saved successfully',
                'priceList' => $priceList
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addInHouseLanguage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|exists:vendor,id',
            'source_language' => 'required|exists:languages,id',
            'target_language' => 'required|exists:languages,id',
            'source_dialect' => 'nullable|exists:dialect,id',
            'target_dialect' => 'nullable|exists:dialect,id'
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

            // Check for duplicate
            $exists = InHouseLanguage::where('vendor_id', $request->vendor_id)
                ->where('source_language', $request->source_language)
                ->where('target_language', $request->target_language)
                ->where('source_dialect', $request->source_dialect)
                ->where('target_dialect', $request->target_dialect)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This language pair already exists'
                ], 400);
            }

            $language = InHouseLanguage::create([
                'vendor_id' => $request->vendor_id,
                'source_language' => $request->source_language,
                'source_dialect' => $request->source_dialect,
                'target_language' => $request->target_language,
                'target_dialect' => $request->target_dialect
            ]);

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

    public function updateInHouseLanguage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_language,id',
            'vendor_id' => 'required|exists:vendor,id',
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

            if ($language->vendor_id != $request->vendor_id) {
                return response()->json([
                    'message' => 'Invalid vendor ID'
                ], 400);
            }

            // Check for duplicate (excluding current record)
            $exists = InHouseLanguage::where('vendor_id', $request->vendor_id)
                ->where('id', '!=', $request->id)
                ->where('source_language', $request->source_language)
                ->where('target_language', $request->target_language)
                ->where('source_dialect', $request->source_dialect)
                ->where('target_dialect', $request->target_dialect)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This language pair already exists'
                ], 400);
            }

            $language->update([
                'source_language' => $request->source_language,
                'source_dialect' => $request->source_dialect,
                'target_language' => $request->target_language,
                'target_dialect' => $request->target_dialect
            ]);

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

    public function deleteInHouseLanguage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:in_house_language,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $language = InHouseLanguage::find($request->id);
            $language->delete();

            return response()->json([
                'message' => 'Language deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
