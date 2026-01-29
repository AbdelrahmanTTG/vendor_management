<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InHouseLanguage extends Model
{
    protected $table = 'in_house_language';

    protected $fillable = [
        'vendor_id',
        'source_language',
        'source_dialect',
        'target_language',
        'target_dialect'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function sourceLanguageRelation()
    {
        return $this->belongsTo(Language::class, 'source_language');
    }

    public function targetLanguageRelation()
    {
        return $this->belongsTo(Language::class, 'target_language');
    }

    public function sourceDialectRelation()
    {
        return $this->belongsTo(Dialect::class, 'source_dialect');
    }

    public function targetDialectRelation()
    {
        return $this->belongsTo(Dialect::class, 'target_dialect');
    }
}
