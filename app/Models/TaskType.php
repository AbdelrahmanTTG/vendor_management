<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    use HasFactory;
    protected $table = 'task_type';

    public $timestamps = false;
    protected $fillable = ['name', 'parent', 'Active'];
    public static function insert($data)
    {
        if(isset($data['service'])){
            $data = [
                'name' => $data['name'],
                'Active' => $data['Active'],
                'parent' => $data['service'],
            ];
        }
        $insetData = self::create($data);
        $relatedRecord = Service::find($insetData->parent);
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
        $relatedRecord = Service::find($item->parent);

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
}
