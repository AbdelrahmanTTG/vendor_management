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
        $relatedRecord = Language::find($insetData->language);
        return [
            'id' => $insetData->id,
            'dialect' => $insetData->dialect,
            'Language' => $relatedRecord->name,
            'Active' => $insetData->Active,
        ];

    }
}
