<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DataLogger extends Model
{
    protected $table = 'data_logger';
    public $timestamps = false;

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
    public static function queryVendorLogs($vendorId, $billingDataIds = [])
    {
        return self::query()
            ->select('data_logger.*', 'master_user.user_name as created_by')
            ->leftJoin('master_user', 'master_user.id', '=', 'data_logger.created_by')
            ->where(function ($q) use ($vendorId, $billingDataIds) {
                $q->where(function ($sub) use ($vendorId) {
                    $sub->where('table_name', 'vendor')
                        ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.id')) = ?", [$vendorId]);
                });

                $q->orWhere(function ($sub) use ($vendorId, $billingDataIds) {
                    $sub->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.vendor_id')) = ?", [$vendorId])
                        ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.vendor')) = ?", [$vendorId]);

                    if (!empty($billingDataIds)) {
                        foreach ($billingDataIds as $id) {
                            $sub->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.billing_data_id')) = ?", [$id]);
                        }
                    }
                });
            });
    }
}
