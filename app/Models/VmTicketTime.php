<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VmTicketTime extends Model
{
    protected $table = 'vm_ticket_time';
    protected $guarded = ['id'];
    public $timestamps = false;

    public function user()
    {
        return  $this->belongsTo(BrandUsers::class, 'created_by');
    }
    public function assigned_to()
    {
        return  $this->belongsTo(BrandUsers::class, 'assign_to')->select('user_name');
    }
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'assign_to')->select('name');
    }
    public function getStatus()
    {
        $statusArray = array("Rejected", "New", "Opened", "Partly Closed", "Closed", "Closed Waiting Requester Acceptance","Assigned" ,'Add resource' , 'Delete resource');
        return $statusArray[$this->status];
    }
    public function getAssignedName()
    {
        if (in_array($this->status, [7, 8])) {
       
            return $this->vendor?->name;
        }

        return $this->assigned_to?->user_name;
    }
    
}
