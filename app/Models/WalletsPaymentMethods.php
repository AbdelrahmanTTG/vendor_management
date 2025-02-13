<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletsPaymentMethods extends Model
{
    use HasFactory;
    protected $table = 'wallets_payment_methods';
    public $timestamps = false;
    protected $fillable = [
        'billing_data_id',
        'method',
        'account',
        'defaults',
    ];
    public function remove()
    {
        return $this->delete();
    }
    public function method()
    {
        return $this->belongsTo(VendorPaymentMethod::class, 'method')->select('id', 'name'); // assuming 'method' هو المفتاح الذي يرتبط بـ PaymentMethods
    }
    public function methodName()
    {
        return $this->belongsTo(VendorPaymentMethod::class, 'method')->select('name'); 
    }
}
