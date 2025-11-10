<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $table = 'division';
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
