<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Regions extends Model
{
    use HasFactory ;
    protected $fillable = ['name', 'abbreviations', 'Active'];
    public $timestamps = false;
    public static function SelectData($searchTerm = null){

        if ($searchTerm) {
            $query = self::where('name', 'like', '%' . $searchTerm . '%');
        }else{
            $query = self::select('id', 'name')->limit(5);

        }
        return $query->get();
    }
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

        return $item; 
    
    }


}
