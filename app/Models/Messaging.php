<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Messaging extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'Active'];
    public $timestamps = false;
    protected $table = 'messaging_types';

    public static function insert($data)
    {
        return self::create($data);
    }
    public function updatedata($data)
    {
        $item = self::find($data['id']);
        if (!$item) {
            return null;
        }
        $item->fill($data);
        $item->save();
        $result = array_filter($item->toArray(), function ($value) {
            return $value !== null;
        });
        return $result;

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
