<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Countries extends Model
{
    use HasFactory;

    protected $fillable = ['region', 'name', 'Active'];
    public $timestamps = false;
    public static function insert($data)
    {
       
         $insetData = self::create($data);
         $relatedRecord = Regions::find($insetData->region);
         return [
            'id' => $insetData->id,
            'name' => $insetData->name,
            'region' => $relatedRecord->name,
            'Active' => $insetData->Active,
        ];
    }
}
