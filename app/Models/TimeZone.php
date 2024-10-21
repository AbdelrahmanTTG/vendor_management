<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeZone extends Model
{
    use HasFactory;
    protected $table = 'time_zone';
    public $timestamps = false;
    protected $fillable = ['zone', 'gmt', 'Active',"status"];
    public static function insert($data)
    {
        $data['status'] = 0;
        $insertedData = self::create($data);
        unset($insertedData['status']);
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
        unset($item['status']);
        return $item;

    }
    public static function SelectData($searchTerm = null)
    {

        if ($searchTerm) {
            $query = self::where('gmt', 'like', '%' . $searchTerm . '%');
        } else {
            $query = self::select('id', 'gmt')->limit(5);

        }
        return $query->get();
    }
}
