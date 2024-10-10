<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskLog extends Model
{
    use HasFactory;
    protected $table = 'job_task_log';
    public $timestamps = false;
    protected $fillable = [
        'from','task','status','created_by','created_at'
        
    ];
    public function getTaskLogStatus()
    {
        $taskLoggerArray = array(
            "Send New Offer & Waiting Vendor Acceptance",
            "Accept Offer",
            "Reject Offer",
            "Task Finished & Waiting PM Confirmation",
            "Task Accepted",
            "Task Rejected & Re-opened",
            "Task Cancelled",
            "Task Updated",
            "Heads-Up ( Waiting Vendor Response )",
            "Heads-Up ( Marked as Available )",
            "Heads-Up ( Marked as Not Available )"
        );
        return $taskLoggerArray[$this->status];
    }
}
