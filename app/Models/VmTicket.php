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
        $typeArray = array("", "New Resource", "Price Inquiry", "General", "Resources Availability", "CV Request");
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
        $statusArray = array("Rejected", "New", "Opened", "Partly Closed", "Closed", "Closed Waiting Requester Acceptance");
        if (isset($statusArray[$this->status])) {
            return $statusArray[$this->status];
        } else {
            return "Unknown Status"; 
        }
    }

    public function Time()
    {   
        return  $this->hasMany(VmTicketTime::class, 'ticket');
    }
    public function Response()
    {
        return  $this->hasMany(VmTicketResponse::class, 'ticket');
    }
    public function TeamResponse()
    {
        return  $this->hasMany(VmTicketTeamResponse::class, 'ticket');
    }
    public function ticketTime()
    {
        $rows =  self::Time()->get();
        $hrs = 0;
        $time = 0;
        foreach ($rows as $row) {
            if ($row->status <= 3) {
                $time = strtotime($row->created_at);
            } else {
                $time = strtotime($row->created_at) - $time;
                $hrs = $hrs + $time / (60 * 60);
            }
        }
        $arr = round($hrs, 2);
        $date = explode(".", $arr);
        if (isset($date[1])) {
            return $date[0] . ':' . round(($date[1] / 100) * 60);
        } else {
            return $date[0] . ':0';
        }
    }

    public function BrandName()
    {
        return  $this->belongsTo(Brand::class, 'brand');
    }

    public function getUser($id)
    {
        $row = BrandUsers::find($id);
        return  $row->user_name;
    }

    public function getResourcesCount($type)
    {
        $row = VmTicketResource::where('ticket',$this->id)->where('type',$type)->count();
        return  $row;
    }
   
}
