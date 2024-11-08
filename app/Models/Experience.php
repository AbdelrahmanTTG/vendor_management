<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'vendor_id',
        'started_working',
        'experience_year',
        'summary',
    ];
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
    public function vendorSkills()
    {
        return $this->hasMany(VendorSkill::class, 'vendor_id', 'vendor_id');
    }
}
