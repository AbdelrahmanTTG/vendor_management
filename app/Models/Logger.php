<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Logger extends Model
{
    use HasFactory;
    protected $table = 'logger';
    public $timestamps = false;
    protected $guarded = ['id'];

     // add to logger
     public static function addToLoggerUpdate($table_name = "", $transaction_id_name = "", $transaction_id = "", $created_by = "",$parent ="0", $parent_id = "0")
     {
         //Table Structure ...
         $table_structure = DB::select(" select `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE  `TABLE_NAME`='$table_name' ");
        
         $key = array();
         $count = 0;
         foreach ($table_structure as $column) {
             array_push($key, $column->COLUMN_NAME);
         }
         
         //Get Data ...
         $data = DB::table("$table_name")->where($transaction_id_name , $transaction_id)->get();
        
         foreach ($data as $data) {
             $data_count = 0;
             $sets = "";
             foreach ($key as $value) {
               
                 if ($data_count == 0) {
                     $sets = $value . " = '" . $data->$value . "'";
                 } else {
                     $sets .= "," . $value . " = '" . $data->$value . "'";
                 }
                 $data_count++;
             }
             $logger['screen'] = -1;
             $logger['parent'] = $parent;
             $logger['parent_id'] = $parent_id;
             $logger['data'] = "UPDATE $table_name SET $sets WHERE $transaction_id_name = $transaction_id;";
             $logger['table_name'] = $table_name;
             $logger['transaction_id_name'] = $transaction_id_name;
             $logger['transaction_id'] = $transaction_id;
             $logger['type'] = 1;
             $logger['created_by'] = $created_by;
             $logger['created_at'] = date("Y-m-d H:i:s");
             $inserted_logger = LoggerMaster::create($logger);             
             $logger['master_id'] =  $inserted_logger->id;
              self::create($logger);
         }
     }
}
