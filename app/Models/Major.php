<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'major';

    protected $fillable = ['name', 'Active'];
    public static function insert($data)
    {
        $insertedData = self::create($data);
        unset($insertedData['updated_at']);
        unset($insertedData['created_at']);
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
        unset($item['updated_at']);
        unset($item['created_at']);
        return $item;

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
