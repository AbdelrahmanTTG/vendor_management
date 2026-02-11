<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InHousePriceList extends Model
{
    protected $table = 'in_house_price_lists';

    protected $fillable = [
        'vendor_id',
        'currency',
        'quota_hours',
        'salary',
        'start_date',
        'end_date',
        'is_active'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function currencyRelation()
    {
        return $this->belongsTo(Currency::class, 'currency');
    }

    public function languages()
    {
        return $this->hasMany(InHouseLanguage::class, 'price_list_id');
    }
}
