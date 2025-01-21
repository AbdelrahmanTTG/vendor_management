<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorInvoice extends Model
{
    use HasFactory;
    protected $table = 'vendor_invoices';

    protected $fillable = [
        'vendor_id',
        'vpo_file',
        'invoice_date',
        'verified',
        'payment_method',
        'total',
        'billing_legal_name',
        'billing_legal_name',
        'billing_address',
        'billing_currency',
        'billing_due_date',
        'bank_name',
        'bank_account_holder',
        'bank_swift',
        'bank_IBAN',
        'bank_address',
        'wallet_method',
        'wallet_account',
        'brand_id'
    ];

    public function tasks()
    {
        return  $this->hasMany(Task::class, 'invoice_id');
    }

    public function getVerifiedStatus()
    {
        $verifiedArray = array("", "Verified", "Rejected", "Waiting Accounting Confirmation");
        return $verifiedArray[$this->verified];
    }
    
    public function brand()
    {
        return  $this->belongsTo(Brand::class, 'brand_id');
    }

    public function getVendor()
    {
        return  $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function currencyName()
    {
        return  $this->belongsTo(Currency::class, 'billing_currency');
    }
}
