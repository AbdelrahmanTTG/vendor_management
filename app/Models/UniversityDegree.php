<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversityDegree extends Model
{
    use HasFactory;
    protected $table = 'university_degree';
    public $timestamps = false;

    protected $fillable = ['name', 'Active'];
    public static function insert($data)
    {
        $insertedData = self::create($data);
        unset($insertedData['updated_at']);
        unset($insertedData['created_at']);
        return $insertedData;
    }
}
