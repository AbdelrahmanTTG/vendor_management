<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandUsers extends Model
{
    protected $table = 'users';
    public function aliases()
    {
        return $this->belongsToMany(AliasMail::class, 'mailer', 'user_id', 'alias_id')
         ->withPivot('status'); 
    }
    public static function SelectPMSalesData()
    {
        $role = ['2,3,12,16,20,29,42,43,45,47,49'];
        $query = self::whereIn("role", $role)->select('id', 'user_name');
        return $query->get();
    }
    public static function SelectData($searchTerm = null)
    {

        if ($searchTerm) {
            $query = self::where('user_name', 'like', '%' . $searchTerm . '%')->where('status', 1);
        } else {
            $query = self::select('id', 'user_name')->where('status', 1)->limit(5);
        }
        return $query->get();
    }
    public static function SelectPmData()
    {
        $role = ['2,29,16,42,43,45,47,52'];
        $query = self::whereIn("role", $role)->select('id', 'user_name');
        return $query->get();
    }

    public static function SelectVmData()
    {
        $role = ['11','32','59'];
        $query = self::whereIn("role", $role)->where('status', 1)->select('id', 'user_name');
        return $query->get();
    }

    public function getBrand()
    {
        return  $this->belongsTo(Brand::class, 'brand');
    }
   
}
