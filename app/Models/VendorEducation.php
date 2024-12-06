<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorEducation extends Model
{
    protected $table = 'vendor_education';
    protected $fillable = [
        'vendor_id',
        'university_name',
        'latest_degree',
        'year_of_graduation',
        'major',
    ];
    //
    public function major()
    {
        return $this->belongsTo(Major::class, 'major');
    }
}
