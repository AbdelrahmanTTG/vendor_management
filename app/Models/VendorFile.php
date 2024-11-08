<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorFile extends Model
{
    protected $table = 'vendor_files';

    protected $fillable = ['vendor_id', 'file_path', 'file_title', 'file_content'];
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
    public function vendorFiles()
    {
        return $this->hasMany(VendorFile::class, 'vendor_id');
    }
    // public function vendor()
    // {
    //     return $this->belongsTo(Vendor::class, 'vendor_id');
    // }
    //
}
