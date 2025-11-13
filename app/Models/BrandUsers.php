<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class BrandUsers extends Model
{
    protected $table = 'users';
    public function aliases()
    {
        return $this->belongsToMany(AliasMail::class, 'mailer', 'user_id', 'alias_id')
         ->withPivot('status'); 
    }
    // public static function SelectPMSalesData()
    // {
    //     $role = ['2,3,12,16,20,29,42,43,45,47,49'];
    //     $query = self::whereIn("role", $role)->select('id', 'user_name');
    //     return $query->get();
    // }
    
    public static function SelectData($searchTerm = null)
    {

        if ($searchTerm) {
            $query = self::where('user_name', 'like', '%' . $searchTerm . '%')->where('status', 1);
        } else {
            $query = self::select('id', 'user_name')->where('status', 1)->limit(5);
        }
        return $query->get();
    }
    // public static function SelectPmData()
    // {
    //     $role = ['2,29,16,42,43,45,47,52'];
    //     $query = self::whereIn("role", $role)->select('id', 'user_name');
    //     return $query->get();
    // }
    public static function SelectPMSalesData($search = null, $perPage = 5)
    {
        $query = DB::table('users')
            ->select('users.id', 'users.user_name')
            ->join('vm_ticket', function ($join) {
                $join->on('users.id', '=', 'vm_ticket.created_by')
                    ->where('vm_ticket.from_id', '=', 0)
                    ->where('vm_ticket.ticket_from', '=', 3);
            })
            ->distinct()
            ->orderBy('users.user_name', 'ASC');

        if (!empty($search)) {
            $query->where('users.user_name', 'LIKE', '%' . $search . '%');
        }

        return $query->paginate($perPage);
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
