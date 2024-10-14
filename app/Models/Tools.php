<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tools extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['name', 'parent', 'Active'];
    public static function insert($data)
    {
        $data['parent'] = 0;
        $insertedData = self::create($data);
        unset($insertedData['parent']);
        return $insertedData;
    }
}
