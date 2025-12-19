<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class CancellationService
{
 
    public function buildDeleteCondition($table, $conditionsArray, $blockIfFound = true)
    {
        $formattedConditions = [];
        foreach ($conditionsArray as $cond) {
            $formattedConditions[] = [
                'column' => $cond[0],
                'operator' => $cond[1],
                'value' => $cond[2]
            ];
        }

        return [[
            'table' => $table,
            'conditions' => $formattedConditions,
            'block_if_found' => $blockIfFound
        ]];
    }

  
    public function FlexibleCancellationProcedures(
        $tableName,
        $rowID,
        $created_by,
        $action,
        $url,
        $screen = "",
        $transaction_id_name = "",
        $parent = "",
        $parent_id = "",
        $deleteConditions = []
    ) {
        foreach ($deleteConditions as $conditionSet) {
            $query = DB::table($conditionSet['table']);

            foreach ($conditionSet['conditions'] as $cond) {
                $col = $cond['column'];
                $op = $cond['operator'];
                $val = $cond['value'];

                if ($op == '=') {
                    $query->where($col, $val);
                } elseif ($op == '!=') {
                    $query->where($col, '!=', $val);
                } elseif ($op == 'in' && is_array($val)) {
                    $query->whereIn($col, $val);
                } elseif ($op == 'not_in' && is_array($val)) {
                    $query->whereNotIn($col, $val);
                } else {
                    $query->where($col, $op, $val);
                }
            }

            $count = $query->count();

            if ($conditionSet['block_if_found'] && $count > 0) {
                return [
                    'transform' => 'skipped',
                    'logger' => 'skipped',
                    'logger_delete' => 'skipped',
                    'record_deleted' => 'skipped',
                    'reason' => "Deletion blocked due to condition in table '{$conditionSet['table']}'."
                ];
            }
        }

        $transformResult = $this->transformAndInsert($tableName, $rowID);
        $this->addToLogger($created_by, $action, $url, $tableName, $rowID, null);
        $this->addToLoggerDelete($tableName, $screen, $transaction_id_name, $rowID, $parent, $parent_id, $created_by);

        DB::table($tableName)->where('id', $rowID)->delete();

        return [
            'transform' => $transformResult,
            'logger' => 'done',
            'logger_delete' => 'done',
            'record_deleted' => 'done'
        ];
    }

   
    public function transformAndInsert($tableName, $rowID)
    {
        $old_table = $tableName;
        $new_table = "{$tableName}_cancel";
        $user = JWTAuth::parseToken()->authenticate();

        if (!Schema::connection('mysql_cancel')->hasTable($new_table)) {
            $createTableQuery = DB::select("SHOW CREATE TABLE `{$old_table}`")[0];
            $createSql = $createTableQuery->{'Create Table'};

            $createSql = str_replace("CREATE TABLE `{$old_table}`", "CREATE TABLE `{$new_table}`", $createSql);
            $createSql = preg_replace('/AUTO_INCREMENT=\d+/', 'AUTO_INCREMENT=1', $createSql);

            DB::connection('mysql_cancel')->statement($createSql);

            DB::connection('mysql_cancel')->statement("
                ALTER TABLE `{$new_table}` 
                ADD COLUMN `deleted_at` DATETIME,
                ADD COLUMN `deleted_by` INT,
                ADD COLUMN `deleted_id` INT
            ");
        }

        $row = DB::table($tableName)->where('id', $rowID)->first();

        if ($row) {
            $rowArray = (array) $row;
            $rowArray['deleted_id'] = $rowArray['id'];
            unset($rowArray['id']);
            $rowArray['deleted_at'] = Carbon::now();
            $rowArray['deleted_by'] = $user->id;

            $inserted = DB::connection('mysql_cancel')->table($new_table)->insert($rowArray);

            if ($inserted) {
                return ['status' => 'success', 'message' => 'Row copied successfully.'];
            } else {
                return ['status' => 'error', 'message' => 'Insert failed.'];
            }
        } else {
            return ['status' => 'error', 'message' => 'Row not found.'];
        }
    }

  
    public function addToLogger($created_by, $action, $url, $table_name, $id_row, $data = null)
    {
        $insertData = [
            'created_by' => $created_by,
            'action' => $action,
            'url' => $url,
            'created_at' => Carbon::now(),
            'table_name' => $table_name,
            'data' => $data ? json_encode($data) : null,
            'id_row' => $id_row
        ];

        DB::table('data_logger')->insert($insertData);
    }

    
    public function addToLoggerDelete(
        $table_name = "",
        $screen = "",
        $transaction_id_name = "",
        $transaction_id = "",
        $parent = "",
        $parent_id = "",
        $created_by = ""
    ) {
        $database = env('DB_DATABASE', 'falaq');
        $columns = DB::select("
            SELECT `COLUMN_NAME` 
            FROM `INFORMATION_SCHEMA`.`COLUMNS` 
            WHERE `TABLE_SCHEMA`=? AND `TABLE_NAME`=?
        ", [$database, $table_name]);

        $key = [];
        $columns_name = [];

        foreach ($columns as $column) {
            $columnName = $column->COLUMN_NAME;
            $key[] = $columnName;
            $columns_name[] = $columnName;
        }

        $columns_name_str = implode(',', $columns_name);

        $data = DB::table($table_name)
            ->where($transaction_id_name, $transaction_id)
            ->get();

        foreach ($data as $row) {
            $columns_value = [];

            foreach ($key as $value) {
                $columns_value[] = "'" . addslashes($row->$value) . "'";
            }

            $columns_value_str = implode(',', $columns_value);

            $logger = [
                'screen' => $screen,
                'data' => "INSERT INTO {$table_name}({$columns_name_str})VALUES({$columns_value_str});",
                'table_name' => $table_name,
                'transaction_id_name' => $transaction_id_name,
                'transaction_id' => $transaction_id,
                'type' => 2,
                'parent' => $parent,
                'parent_id' => $parent_id,
                'created_by' => $created_by,
                'created_at' => Carbon::now()
            ];

            DB::table('logger')->insert($logger);
        }
    }
}
