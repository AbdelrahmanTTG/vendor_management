<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VmTicket extends Model
{   
    protected $table = 'vm_ticket';
    protected $guarded = ['id'];
    public $timestamps = false;

    public function getTicketType()
    {
        $typeArray = array("","New Resource", "Price Inquiry", "General", "Resources Availability", "CV Request");
        return $typeArray[$this->request_type];
    }

    public function serviceData()
    {
        return  $this->belongsTo(Service::class, 'service');
    }

    public function taskType()
    {
        return  $this->belongsTo(TaskType::class, 'task_type');
    }
    public function currencyData()
    {
        return  $this->belongsTo(Currency::class, 'currency');
    }

    public function unitData()
    {
        return  $this->belongsTo(Unit::class, 'unit');
    }

    public function SourceName()
    {
        return  $this->belongsTo(Language::class, 'source_lang');
    }  

    public function TargetName()
    {
        return  $this->belongsTo(Language::class, 'target_lang');
    }  

    public function SubjectName()
    {
        return  $this->belongsTo(MainSubjectMatter::class, 'subject');
    }  

    public function SoftwareName()
    {
        return  $this->belongsTo(Tools::class, 'software');
    } 

    public function user()
    {
        return  $this->belongsTo(BrandUsers::class, 'created_by');
    }       
       
    public function getTicketStatus()
    {
        $statusArray = array("Rejected","New", "Opened", "Partly Closed", "Closed", "Closed Waiting Requester Acceptance");
        return $statusArray[$this->status];
    }
}
