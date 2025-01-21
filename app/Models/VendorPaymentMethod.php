<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorPaymentMethod extends Model
{
    protected $table = 'vendor_payment_methods';
    protected $fillable = ['name', 'Active'];
    // public $timestamps = false;
    public static function insert($data)
    {
        $item = self::create($data);
        return $item->makeHidden(['created_at', 'updated_at']);   
     }
    public function updatedata($data)
    {
        $item = self::find($data['id']);
        if (!$item) {
            return null;
        }
        $item->fill($data);
        $item->save();

        return $item->makeHidden(['created_at', 'updated_at']);
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
