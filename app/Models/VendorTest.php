<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorTest extends Model
{
    //
    protected $table = 'vendorTest';
    protected $fillable = ['vendor_id', 'test_type', 'test_result', 'test_upload','source_lang','target_lang',	'main_subject',	'sub_subject',	'service','created_at', 'updated_at'];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
    public function source_lang()
    {
        return $this->belongsTo(Language::class, 'source_lang');
    }

    public function target_lang()
    {
        return $this->belongsTo(Language::class, 'target_lang');
    }

    public function main_subject()
    {
        return $this->belongsTo(MainSubjectMatter::class, 'main_subject');
    }

    public function sub_subject()
    {
        return $this->belongsTo(SubSubjectMatter::class, 'sub_subject');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service');
    }
}
