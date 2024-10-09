<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $table = 'job_task';
    protected $fillable = [
        'status',
        
    ];

    public function jobPrice()
    {
        return  $this->belongsTo(Job::class, 'job_id')->with('priceList')->select(['price_list']);
    }

    public function taskTypeName()
    {
        return  $this->belongsTo(TaskType::class, 'task_type')->select(['name']);
    }

    public function currencyName()
    {
        return  $this->belongsTo(Currency::class, 'currency')->select(['name']);
    }

    public function unitName()
    {
        return  $this->belongsTo(Unit::class, 'unit')->select(['name']);
    }

    public function conversation()
    {
        return  $this->hasMany(TaskConversation::class, 'task');
    }

    public function log()
    {
        return  $this->hasMany(TaskLog::class, 'task');
    }

    public function jobFile()
    {
        return  $this->belongsTo(Job::class, 'job_id')->select(['job_file']);
    }
    public function getTaskStatus()
    {
        $taskArray = array("In Progress", "Delivered", "Cancelled", "Rejected", "Waiting Your Confirmation", "Waiting PM Confirmation", " ", "Heads-Up ", "Heads-Up ( Marked as Available )", "Heads-Up ( Marked as Not Available )");
        return $taskArray[$this->status];
    }
}
