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
        'bank_details_id',
        'method',
        'account',
    ];
}
