<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Schema;
use Illuminate\Support\Facades\DB;
class VmCodeTableController extends Controller
{
    public function SelectDataTable(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'table' => 'required|string',
            'per_page' => 'sometimes|integer|min:1',
            'columns' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid data provided',
                'messages' => $validator->errors(),
            ], 422);
        }

        $table = $request->input('table');

        if (!Schema::hasTable($table)) {
            return response()->json([
                'error' => 'Table does not exist',
            ], 404);
        }

        $perPage = $request->input('per_page', 10);
        $related = $request->input('related');
        $columns = $request->input('columns');

        if ($related) {
            if ($related) {
                $columns = array_map(function ($column) use ($table) {
                    return $table . '.' . $column; 
                }, $columns);
                $data = DB::table($table)
                    ->join($related['table'], $table . '.' . $related['foreign_key'], '=', $related['table'] . '.' . $related['primary_key'])
                    ->select(
                        array_merge(
                            $columns,  
                            array_map(function ($column) use ($related) {
                                return $related['table'] . '.' . $column . ' as ' . $related['table'] . '_' . $column;
                            }, $related['columns'])
                        )
                    )
                    ->paginate($perPage);
            }

        } else {
            $data = DB::table($table)
                ->select($columns)
                ->paginate($perPage);
        }



        return response()->json([
            'data' => $data->items(),
            'current_page' => $data->currentPage(),
            'last_page' => $data->lastPage(),
            'per_page' => $data->perPage(),
            'total' => $data->total(),
            'next_page_url' => $data->nextPageUrl(),
            'prev_page_url' => $data->previousPageUrl(),
        ], 200);
    }

}
