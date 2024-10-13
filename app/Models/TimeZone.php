<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeZone extends Model
{
    use HasFactory;
    protected $table = 'time_zone';
    public $timestamps = false;
    protected $fillable = ['zone', 'gmt', 'Active',"status"];
    public static function insert($data)
    {
        $data['status'] = 0;
        $insertedData = self::create($data);
        unset($insertedData['status']);
        return $insertedData;
    }
}
