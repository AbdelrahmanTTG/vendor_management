<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorMotherTongue extends Model
{
    protected $table = 'vendors_mother_tongue';

    protected $fillable = [
        'vendor_id',
        'language_id',
        'created_at',
        'updated_at',
    ];

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }
}
