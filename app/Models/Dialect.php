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
        $relatedRecord = Language::find(id: $insetData->language);
        return [
            'id' => $insetData->id,
            'dialect' => $insetData->dialect,
            'Language' => (object) [
                'id' => $relatedRecord->id,
                'name' => $relatedRecord->name
            ],
            'Active' => $insetData->Active,
        ];

    }
    public function updatedata($data)
    {
        $item = self::find($data['id']);
        if (!$item) {
            return null;
        }
        $item->fill($data);
        $item->save();
        $relatedRecord = Language::find($item->language);

        return [
            'id' => $item->id,
            'dialect' => $item->dialect,
            'Language' => (object) [
                'id' => $relatedRecord->id,
                'name' => $relatedRecord->name
            ],
            'Active' => $item->Active,
        ];

    }
}
