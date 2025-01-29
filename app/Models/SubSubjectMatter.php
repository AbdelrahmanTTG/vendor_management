<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubSubjectMatter extends Model
{
    protected $fillable = ['name', 'Active', "parent"];
    public $timestamps = false;

    protected $table = 'fields';
    public static function insert($data)
    {
        if (isset($data['parent'])) {
            $data = [
                'name' => $data['name'],
                'Active' => $data['Active'],
                'parent' => $data['parent'],
            ];
        }
        $insetData = self::create($data);
        $relatedRecord = MainSubjectMatter::find($insetData->parent);
        return [
            'id' => $insetData->id,
            'name' => $insetData->name,
            'parent' => (object) [
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
        $relatedRecord = MainSubjectMatter::find($item->parent);
        return [
            'id' => $item->id,
            'name' => $item->name,
            'parent' => (object) [
                'id' => $relatedRecord->id,
                'name' => $relatedRecord->name
            ],
            'Active' => $item->Active,
        ];
    }
    public static function getColumnValue($id)
    {
        return self::where('parent', $id)->where('Active', 1)->get();
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
