<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InHouseUnitConversion extends Model
{
    protected $table = 'in_house_unit_conversions';

    protected $fillable = [
        'vendor_id',
        'task_type_id',
        'unit_from',
        'unit_to',
        'value_from',
        'value_to'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function taskType()
    {
        return $this->belongsTo(TaskType::class, 'task_type_id');
    }

    public function unitFromRelation()
    {
        return $this->belongsTo(Unit::class, 'unit_from');
    }

    public function unitToRelation()
    {
        return $this->belongsTo(Unit::class, 'unit_to');
    }
}
