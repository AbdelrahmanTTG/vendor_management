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
        'sub_subject',
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
    public function source_lang()
    {
        return $this->belongsTo(Language::class, 'source_lang')->select('id', 'name');
    }

    public function target_lang()
    {
        return $this->belongsTo(Language::class, 'target_lang')->select('id', 'name');
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
        return $this->belongsTo(Service::class, 'service')->select('id', 'name');
    }

    public function task_type()
    {
        return $this->belongsTo(TaskType::class, 'task_type')->select('id', 'name');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit')->select('id', 'name');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency')->select('id', 'name');
    }

    public function subject()
    {
        return $this->belongsTo(MainSubjectMatter::class, 'subject')->select('id', 'name');
    }

 public function sub_subject()
{
    return $this->belongsTo(SubSubjectMatter::class, 'sub_subject')->select('id', 'name');
}


}
