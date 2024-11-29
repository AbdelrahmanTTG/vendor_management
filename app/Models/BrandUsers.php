<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandUsers extends Model
{   
    protected $table = 'users'; 
   
    public static function SelectPMSalesData()
    {
        $role = ['2,3,12,16,20,29,42,43,45,47,49'];
        $query = self::whereIn("role",$role)->select('id', 'user_name');      
        return $query->get();
    }
   
}
