<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillingData extends Model
{
    use HasFactory;
    protected $table = 'billing_data';
    public $timestamps = false;

    protected $fillable = [
        'vendor_id',
        'billing_legal_name',
        'billing_currency',
        'city',
        'street',
        'billing_address',
        'billing_status'
    ];
    public function bankDetail()
    {
        return $this->hasOne(BankDetails::class, 'billing_data_id');
    }
    public function walletPaymentMethod()
    {
        return $this->hasMany(WalletsPaymentMethods::class, 'billing_data_id');

    }
    public function currency()
    {
        return $this->belongsTo(Currency::class, 'billing_currency', 'id');
    }
  
}
