<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeZone extends Model
{
    use HasFactory;
    protected $table = 'time_zone';
    public $timestamps = false;
    protected $fillable = ['zone', 'gmt', 'parent','Active',"status"];
    public static function insert($data)
    {
        $data['status'] = 0;
        $insertedData = self::create($data);
        unset($insertedData['status']);
        $relatedRecord = countries::find($insertedData->parent);
        return [
            'id' => $insertedData->id,
            'zone' => $insertedData->zone,
            'gmt' => $insertedData->gmt,
            'parent' => (object) [
                'id' => $relatedRecord->id,
                'name' => $relatedRecord->name
            ],
            'Active' => $insertedData->Active,
        ];    }
    public function updatedata($data)
    {
        $item = self::find($data['id']);
        if (!$item) {
            return null;
        }
        $item->fill($data);
        $item->save();
        unset($item['status']);
        $relatedRecord = Countries::find($item->parent);
        return [
            'id' => $item->id,
            'zone' => $item->zone,
            'gmt' => $item->gmt,

            'parent' => (object) [
                'id' => $relatedRecord->id,
                'name' => $relatedRecord->name
            ],
            'Active' => $item->Active,
        ];

    }
    public static function getColumnValue($id)
    {
        return self::where('parent', $id)->where('Active', 1)->first();
    }
    public static function SelectData($searchTerm = null)
    {

        if ($searchTerm) {
            $query = self::where('gmt', 'like', '%' . $searchTerm . '%')->where('Active', 1);
        } else {
            $query = self::select('id', 'gmt')->where('Active', 1)->limit(5);

        }
        return $query->get();
    }
}
