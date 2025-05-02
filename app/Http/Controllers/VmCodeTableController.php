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
            $relatedList = isset($related[0]) ? $related : [$related];

            $columns = array_map(function ($column) use ($table) {
                return $table . '.' . $column;
            }, $columns);

            $data = DB::table($table);
            $relatedJsonColumns = [];

            foreach ($relatedList as $rel) {
                $relatedTable = $rel['table'];
                $foreignKey = $rel['foreign_key'];
                $primaryKey = $rel['primary_key'];

                // LEFT JOIN
                $data->leftJoin(
                    $relatedTable,
                    $table . '.' . $foreignKey,
                    '=',
                    $relatedTable . '.' . $primaryKey
                );

                $json = DB::raw('JSON_OBJECT(' . implode(', ', array_map(function ($column) use ($relatedTable) {
                    return "'$column', $relatedTable.$column";
                }, $rel['columns'])) . ') as ' . $foreignKey);

                $relatedJsonColumns[] = $json;
            }

            $data = $data->select(array_merge($columns, $relatedJsonColumns));

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

            if ($request->has('sortBy') && $request->has('sortDirection')) {
                $sortBy = $request->input('sortBy');
                $sortDirection = $request->input('sortDirection');
                if (in_array($sortDirection, ['asc', 'desc'])) {
                    $data = $data->orderBy($sortBy, $sortDirection);
                }
            }

            $data = $data->paginate($perPage);

            $data->map(function ($item) use ($relatedList) {
                foreach ($relatedList as $rel) {
                    $key = $rel['foreign_key'];
                    $item->$key = json_decode($item->$key);
                }
                return $item;
            });
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

            if ($request->has('sortBy') && $request->has('sortDirection')) {
                $sortBy = $request->input('sortBy');
                $sortDirection = $request->input('sortDirection');

                if (in_array($sortDirection, ['asc', 'desc'])) {
                    $data = $data->orderBy($sortBy, $sortDirection);
                }
            }

            $data = $data->select($columns)->paginate($perPage);
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
