<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankDetails extends Model
{
    use HasFactory;
    protected $table = 'bank_details';
    public $timestamps = false;
    protected $fillable = [
        'billing_data_id',
        'bank_name',
        'account_holder',
        'swift_bic',
        'iban',
        'payment_terms',
        'bank_address',
    ];
}
