<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataLogger extends Model
{
    protected $table = 'data_logger';

    protected $fillable = [
        'created_by',
        'action',
        'url',
        'table_name',
        'data',
        'id_row',
    ];

    public static function addToLogger($created_by, $action, $url, $table_name, $data, $id_row = null)
    {
        return self::create([
            'created_by' => $created_by,
            'action'     => $action,
            'url'        => $url,
            'table_name' => $table_name,
            'data'       => is_array($data) ? json_encode($data) : $data,
            'id_row'     => $id_row,
        ]);
    }
}
