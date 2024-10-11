<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorInovice extends Model
{
    use HasFactory;
    protected $table = 'vendor_invoices';
    
    protected $fillable = [
        'vendor_id',
        'vpo_file',
        'invoice_date',
        'verified',
        'payment_method'

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
}
