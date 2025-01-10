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
            'subject' => $this->whenHas('subject'),
            'task_type' => $this->whenHas('task_type',$this->taskTypeName?$this->taskTypeName->name:''),
            'rate' => $this->whenHas('rate'),
            'count' => $this->whenHas('count',round($this->count,3)),
            'total_cost' => round($this->rate * $this->count,3),
            'currency' => $this->whenHas('currency',$this->currencyName?$this->currencyName->name:''),
            'unit' => $this->whenHas('unit',$this->unitName?$this->unitName->name:''),
            'start_date' => $this->whenHas('start_date'),
            'delivery_date' => $this->whenHas('delivery_date'),
            'status' => $this->whenHas('status'),          
            'statusData' => $this->whenHas('status',$this->getTaskStatus()),          
            'jobPrice'=> $this->jobPrice?new JobPriceResource($this->jobPrice->priceList):'',             
            'source_name'=> $this->jobPrice?($this->jobPrice->priceList?$this->jobPrice->priceList->SourceName->name:''):'',             
            'target_name'=> $this->jobPrice?($this->jobPrice->priceList?$this->jobPrice->priceList->TargetName->name:''):'',             
            'type'=>($this->status == 4)?'job_offer': 'job',
            'offer_type'=>(isset($this->task_id))?'offer_list': 'task',
            'file'=> $this->whenHas('file'),
            'fileLink'=> $this->whenHas('file',"https://aixnexus.com/erp/assets/uploads/taskFile/$this->file"),
            'job_file'=> $this->whenHas('job_file',$this->jobFile?$this->jobFile->job_file:null),
            'job_fileLink'=> $this->whenHas('job_file',"https://aixnexus.com/erp/assets/uploads/jobFile/$this->job_file"),
            'insrtuctions'=>$this->whenHas('insrtuctions'),

            'brand_name'=> $this->whenHas('created_by',$this->user?$this->user->getBrand->name:null),
            'created_by'=> $this->whenHas('created_by',$this->user?$this->user->user_name:null), 
            'created_at'=> $this->whenHas('created_at'), 
            'closed_date'=>  $this->whenHas('closed_date'), 
            //'vendor'=> $this->whenHas('vendor',$this->getVendor?$this->getVendor->name:null), 
            'vendor'=> $this->getVendor?$this->getVendor->name:null, 
            'vendor_list'=> $this->whenHas('vendor_list',$this->vendor_list?$this->getVendorList():null), 
            
            
                        
        ];
  }
}
