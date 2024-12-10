<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $table = 'job_task';
    public $timestamps = false;
    protected $fillable = [
        'status',
        'vendor_attachment',
        'vendor_notes',
        'plan_comment',
        'verified',
        'vpo_file',
        'invoice_created_at',
        'invoice_id'

    ];

    public function jobPrice()
    {
        return  $this->belongsTo(Job::class, 'job_id')->with('priceList')->select(['price_list']);
    }

    public function taskTypeName()
    {
        return  $this->belongsTo(TaskType::class, 'task_type');
    }

    public function currencyName()
    {
        return  $this->belongsTo(Currency::class, 'currency');
    }

    public function unitName()
    {
        return  $this->belongsTo(Unit::class, 'unit');
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

    public function job()
    {
        return  $this->belongsTo(Job::class, 'job_id');
    }

    public function getTaskStatus()
    {
        $taskArray = array("In Progress", "Delivered", "Cancelled", "Rejected", "Waiting Your Confirmation", "Waiting PM Confirmation", " ", "Heads-Up ", "Heads-Up ( Marked as Available )", "Heads-Up ( Marked as Not Available )");
        return $taskArray[$this->status];
    }

    public function getTaskBrandId()
    {
        $job =  $this->belongsTo(Job::class, 'job_id')->with(['project'])->first();
        $data = $job->project->getcustomerBrand->brand;
        return $data;
    }

    public function user()
    {
        return  $this->belongsTo(BrandUsers::class, 'created_by');
    }

    public function getVendor()
    {
        return  $this->belongsTo(Vendor::class, 'vendor');
    }
   
}
