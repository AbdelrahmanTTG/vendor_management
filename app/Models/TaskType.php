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
            'Service' => $relatedRecord->name,
            'Active' => $insetData->Active,
        ];
       
    }
}
