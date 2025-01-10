<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OfferList extends Model
{
    use HasFactory;
    protected $table = 'job_offer_list';

    public function generateTaskCode()
    {
        $taskCode = Job::findOrFail($this->job_id)->code;
        $id = DB::select(" show table status where name='job_task' ");
        $jobCode = $taskCode . '-' . $id[0]->Auto_increment;

        return $jobCode;
    }

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
    public function getTaskStatus()
    {
        $taskArray = array("In Progress", "Delivered", "Cancelled", "Rejected", "Waiting Your Confirmation", "Waiting PM Confirmation", " ", "Heads-Up ", "Heads-Up ( Marked as Available )", "Heads-Up ( Marked as Not Available )");
        return $taskArray[$this->status];
    }

    public function getVendorList()
    {
        $vendorNames = '';
        if (!empty($this->vendor_list)) {
            $this->vendor_list = rtrim($this->vendor_list, ', ');
            $vendor_list = explode("," ,  $this->vendor_list );
            $vendorList = Vendor::whereIn('id', $vendor_list)->pluck('name')->all();
            if (!empty($vendorList))
                $vendorNames = implode(' , ', $vendorList);
        }
        return  $vendorNames;
    }
}
