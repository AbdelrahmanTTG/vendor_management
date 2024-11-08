<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;
    protected $table = 'unit';

    protected $fillable = ['name', 'le', 'Active'];
    public $timestamps = false;
    public static function insert($data)
    {
        $data['le'] = 0;
        $insertedData = self::create($data);
        unset($insertedData['le']);
        return $insertedData;
    }
    public function updatedata($data)
    {
        $item = self::find($data['id']);
        if (!$item) {
            return null;
        }
        $item->fill($data);
        $item->save();
        unset($item['le']);

        return $item;

    }

}
