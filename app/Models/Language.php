<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;
    protected $table = 'languages';
    protected $fillable = ['name', 'Active',"created_by"];
    public $timestamps = false;
    public static function SelectData($searchTerm = null)
    {

        if ($searchTerm) {
            $query = self::where('name', 'like', '%' . $searchTerm . '%');
        } else {
            $query = self::select('id', 'name')->limit(5);

        }
        return $query->get();
    }
    public static function insert($data)
    {
        $data['created_by'] = 0;
        $insertedData = self::create($data);
        unset($insertedData['created_by']);
        unset($insertedData['created_at']);
        return $insertedData;
    }
                   
}
