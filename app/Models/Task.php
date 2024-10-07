<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $table = 'job_task';

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

    public function getTaskStatus()
    {
        $taskArray = array("In Progress", "Delivered", "Cancelled", "Rejected", "Waiting Your Confirmation", "Waiting PM Confirmation", " ", "Heads-Up ", "Heads-Up ( Marked as Available )", "Heads-Up ( Marked as Not Available )");
        return $taskArray[$this->status];
    }
}
