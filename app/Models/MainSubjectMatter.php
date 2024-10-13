<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainSubjectMatter extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'Active', "status"];

    public $timestamps = false;
    protected $table = 'fields';
    public static function insert($data)
    {
        $data['status'] = 0;
        $insertedData = self::create($data);
        unset($insertedData['status']);
        return $insertedData;
    }
}
