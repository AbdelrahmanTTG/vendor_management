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
        'billing_address'
    ];
}
