<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorSheet extends Model
{
    //
    protected $table = 'vendor_sheet';
    public $timestamps = false;

    protected $fillable = [
        'vendor',
        'subject',
        'SubSubject',
        'service',
        'task_type',
        'source_lang',
        'target_lang',
        'dialect',
        'unit',
        'rate',
        'special_rate',
        'Status',
        'currency',
        'dialect_target'
    ];
    public function sourceLanguage()
    {
        return $this->belongsTo(Language::class, 'source_lang');
    }

    public function targetLanguage()
    {
        return $this->belongsTo(Language::class, 'target_lang');
    }

    public function dialect()
    {
        return $this->belongsTo(Dialect::class, 'dialect');
    }
    public function dialect_target()
    {
        return $this->belongsTo(Dialect::class, 'dialect_target');
    }
    public function service()
    {
        return $this->belongsTo(Service::class, 'service');
    }

    public function taskType()
    {
        return $this->belongsTo(TaskType::class, 'task_type');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency');
    }

    public function subject()
    {
        return $this->belongsTo(MainSubjectMatter::class, 'subject');
    }

    public function subSubject()
    {
        return $this->belongsTo(MainSubjectMatter::class, 'SubSubject');
    }
}
