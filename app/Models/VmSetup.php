<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class VmSetup extends Model
{
    use HasFactory;
    protected $table = 'vm_setup';
    protected $guarded = ['id'];
                      
   
    public static function getErpLink()
    {
        return  self::select('erp_link')->limit('l')->first()->erp_link;
    }

    public static function getUploadsFullLink()
    {
        return  self::select(DB::raw("CONCAT(erp_link, '/', erp_uploads_folder_path) AS uploads_link"))->limit('l')->first()->uploads_link;
    }

   
   
   
   
   
}
