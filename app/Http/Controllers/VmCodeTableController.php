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

        // Apply query parameters filter (if provided)
     
        if ($related) {
            if ($related) {
                $columns = array_map(function ($column) use ($table) {
                    return $table . '.' . $column;
                }, $columns);

                $relatedJsonColumns = DB::raw('JSON_OBJECT(' . implode(', ', array_map(function ($column) use ($related) {
                    return "'" . $column . "', " . $related['table'] . '.' . $column;
                }, $related['columns'])) . ') as ' . $related['foreign_key']);

                $data = DB::table($table)
                ->leftJoin($related['table'], $table . '.' . $related['foreign_key'], '=', $related['table'] . '.' . $related['primary_key'])
                ->select(array_merge(
                    $columns,
                    [$relatedJsonColumns]
                ));

                if ($request->has('queryParams') && is_array($request->queryParams)) {
                    $queryParams = $request->queryParams;

                    foreach ($queryParams as $key => $val) {
                        if ($key !== 'filters' && !empty($val)) {
                            if (is_array($val)) {
                                $data->where(function ($query) use ($key, $val, $table) {
                                    foreach ($val as $k => $v) {
                                        if ($k == 0) {
                                            $query->where($table . '.' . $key, "like", "%" . $v . "%");
                                        } else {
                                            $query->orWhere($table . '.' . $key, "like", "%" . $v . "%");
                                        }
                                    }
                                });
                            } else {
                                $data->where($table . '.' . $key, "like", "%" . $val . "%");
                            }
                        }
                    }
                }
                $data = $data->paginate($perPage);
                $data->map(function ($item) use ($related) {
                    $item->{$related['foreign_key']} = json_decode($item->{$related['foreign_key']});
                    return $item;
                });
            }
          
        } else {
            $data = DB::table($table);
            if ($request->has('queryParams') && is_array($request->queryParams)) {
                $queryParams = $request->queryParams;

                foreach ($queryParams as $key => $val) {
                    if ($key !== 'filters' && !empty($val)) {
                        if (is_array($val)) {
                            $data->where(function ($query) use ($key, $val) {
                                foreach ($val as $k => $v) {
                                    if ($k == 0) {
                                        $query->where($key, "like", "%" . $v . "%");
                                    } else {
                                        $query->orWhere($key, "like", "%" . $v . "%");
                                    }
                                }
                            });
                        } else {
                            $data->where($key, "like", "%" . $val . "%");
                        }
                    }
                }
            }
            $data = $data->select($columns)
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
