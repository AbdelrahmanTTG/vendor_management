<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InHousePriceList extends Model
{
    protected $table = 'in_house_price_list';
    
    protected $fillable = [
        'vendor_id',
        'currency',
        'quota_hours',
        'salary'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function currencyRelation()
    {
        return $this->belongsTo(Currency::class, 'currency');
    }
}