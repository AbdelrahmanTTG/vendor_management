<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InHouseLanguage extends Model
{
    protected $table = 'in_house_languages';

    protected $fillable = [
        'price_list_id',
        'vendor_id',
        'source_language',
        'source_dialect',
        'target_language',
        'target_dialect'
    ];

    public function priceList()
    {
        return $this->belongsTo(InHousePriceList::class, 'price_list_id');
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
