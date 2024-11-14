<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorTest extends Model
{
    //
    protected $table = 'vendortest';
    protected $fillable = ['vendor_id', 'test_type', 'test_result', 'test_upload','source_lang','target_lang',	'MainSubject',	'SubSubject',	'service','created_at', 'updated_at'];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
    public function sourceLanguage()
    {
        return $this->belongsTo(Language::class, 'source_lang');
    }

    public function targetLanguage()
    {
        return $this->belongsTo(Language::class, 'target_lang');
    }

    public function mainSubject()
    {
        return $this->belongsTo(MainSubjectMatter::class, 'MainSubject');
    }

    public function subSubject()
    {
        return $this->belongsTo(MainSubjectMatter::class, 'SubSubject');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service');
    }
}
