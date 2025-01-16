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
            'region' => (object) [
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
        $relatedRecord = Regions::find($item->region);

        return [
            'id' => $item->id,
            'name' => $item->name,
            'region' => (object) [
                'id' => $relatedRecord->id,
                'name' => $relatedRecord->name
            ],
            'Active' => $item->Active,
        ];

    }
    public static function getColumnValue($id)
    {
        return self::where('region', $id)->where('Active', 1)->get();
    }
    public static function SelectData($searchTerm = null)
    {

        if ($searchTerm) {
            $query = self::where('name', 'like', '%' . $searchTerm . '%')->where('Active', 1);
        } else {
            $query = self::select('id', 'name')->where('Active', 1)->limit(5);

        }
        return $query->get();
    }



}
