<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Regions;
use App\Models\Service;
use App\Models\Language;
use App\Models\TimeZone;
use App\Models\Countries;
use App\Models\Messaging;
use App\Models\MainSubjectMatter;
use App\Models\TaskType;
use App\Models\Currency;
use App\Models\Tools;





use Illuminate\Support\Facades\Validator;



class CodingTableController extends Controller
{
    protected static $validTables = ['regions', 'services', 'languages',"time_zone","countries" ,"messaging_types" ,"fields","task_type","currency" ,"tools"];

    protected static $models = [
        'regions' =>   Regions::class,
        'services' =>  Service::class,
        'languages' => Language::class,
        "time_zone"=>  TimeZone::class,
        "countries"=>  Countries::class,
        "messaging_types" =>Messaging::class,
        "fields"=> MainSubjectMatter::class,
        "task_type"=> TaskType::class,
        "currency"=> Currency::class,
        "tools"=> Tools::class
    ];
    public function SelectDatatTable(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'table' => 'required|string|in:' . implode(',', self::$validTables),
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $searchTerm = $request->input('search');
        $table = $request->input('table');
        if (!array_key_exists($table, self::$models)) {
            return response()->json(['error' => 'Invalid table'], 400);
        }
        $modelClass = self::$models[$table];

        $data = $modelClass::SelectData($searchTerm);
        return response()->json($data, 200);
    }
    public function store(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            if (is_null($value) || (is_string($value) && trim($value) === '')) {
                return response()->json(['error' => "The field '$key' cannot be empty"], 400);
            }

            if ($this->containsScript($request)) {
                return response()->json(['error' => "The field '$key' contains invalid content"], 400);
            }
        }
        $table = $request->input('table');
        if (!$table || !in_array($table, self::$validTables)) {
            return response()->json(['error' => 'Invalid table'], 400);
        }
        $modelClass = self::$models[$table] ?? null;
        if (!$modelClass) {
            return response()->json(['error' => 'Invalid model'], 400);
        }

        $data = $request->except('table');
        if (empty($data)) {
            return response()->json(['error' => 'No data provided'], 400);
        }

        // try {
            $inserted = $modelClass::insert($data);
            return response()->json($inserted, 200);
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'An error occurred while adding the data. Please try again later.'
        //     ], 500);
        // }
    }

    protected function containsScript($request)
    {
        foreach ($request->all() as $value) {
            if (is_string($value)) {
                if (preg_match('/<script\b[^>]*>(.*?)<\/script>/is', $value)) {
                    return true;
                }
            } else if (is_array($value)) {
                foreach ($value as $item) {
                    if (is_string($item) && preg_match('/<script\b[^>]*>(.*?)<\/script>/is', $item)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }



}
