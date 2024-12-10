<?php

namespace App\Http\Resources;

use App\Models\Job;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\Empty_;

class TaskResource extends JsonResource
{

    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'subject' => $this->subject,
            'task_type' => $this->taskTypeName?$this->taskTypeName->name:'',
            'rate' => $this->rate,
            'count' => round($this->count,3),
            'total_cost' => round($this->rate * $this->count,3),
            'currency' => $this->currencyName?$this->currencyName->name:'',
            'unit' => $this->unitName?$this->unitName->name:'',
            'start_date' => $this->start_date,
            'delivery_date' => $this->delivery_date,
            'status' => $this->status,          
            'statusData' => $this->getTaskStatus(),          
            'jobPrice'=> $this->jobPrice?new JobPriceResource($this->jobPrice->priceList):'',             
            'type'=>($this->status == 4)?'job_offer': 'job',
            'offer_type'=>(isset($this->task_id))?'offer_list': 'task',
            'file'=> $this->file,
            'fileLink'=> "https://aixnexus.com/erp/assets/uploads/taskFile/$this->file",
            'job_file'=> $this->jobFile?$this->jobFile->job_file:null,
            'job_fileLink'=> "https://aixnexus.com/erp/assets/uploads/jobFile/$this->job_file",
            'insrtuctions'=>$this->insrtuctions,

            'brandName'=> $this->whenAppended('created_by',$this->user->getBrand?$this->user->getBrand->name:null),
            'created_by'=> $this->user?$this->user->user_name:null, 
            'created_at'=> $this->whenAppended('created_at', $this->created_at), 
            'closed_date'=> $this->whenAppended('closed_date', $this->closed_date), 
            'vendor'=> $this->getVendor?$this->getVendor->name:null, 
            
                        
        ];
  }
}
