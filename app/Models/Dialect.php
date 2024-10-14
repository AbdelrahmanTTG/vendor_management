<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dialect extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['language', 'dialect', 'Active'];
    protected $table = 'languages_dialect';
    public static function insert($data)
    {
        $insetData = self::create($data);
        $relatedRecord = Service::find($insetData->parent);
        return [
            'id' => $insetData->id,
            'name' => $insetData->name,
            'Service' => $relatedRecord->name,
            'Active' => $insetData->Active,
        ];

    }
}
