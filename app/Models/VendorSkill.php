<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorSkill extends Model
{
    protected $table = 'vendor_skill';
    protected $fillable = [
        'vendor_id',
        'skill_id',
    ];
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    //
}
