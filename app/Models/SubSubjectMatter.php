<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubSubjectMatter extends Model
{
    protected $fillable = ['name', 'Active', "mainSubjectId"];

    protected $table = 'subSubject';
    public static function insert($data)
    {
        if (isset($data['mainSubjectId'])) {
            $data = [
                'name' => $data['name'],
                'Active' => $data['Active'],
                'mainSubjectId' => $data['mainSubjectId'],
            ];
        }
        $insetData = self::create($data);
        $relatedRecord = MainSubjectMatter::find($insetData->mainSubjectId);
        return [
            'id' => $insetData->id,
            'name' => $insetData->name,
            'mainSubjectId' => (object) [
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
        $relatedRecord = MainSubjectMatter::find($item->mainSubjectId);
        return [
            'id' => $item->id,
            'name' => $item->name,
            'mainSubjectId' => (object) [
                'id' => $relatedRecord->id,
                'name' => $relatedRecord->name
            ],
            'Active' => $item->Active,
        ];
    }
    public static function getColumnValue($id)
    {
        return self::where('mainSubjectId', $id)->get();
    }
    public static function SelectData($searchTerm = null)
    {

        if ($searchTerm) {
            $query = self::where('name', 'like', '%' . $searchTerm . '%');
        } else {
            $query = self::select('id', 'name')->limit(5);
        }
        return $query->get();
    }

}
