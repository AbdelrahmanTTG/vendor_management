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
            'task_type' => $this->taskTypeName,
            'rate' => $this->rate,
            'count' => $this->count,
            'total_cost' => $this->rate * $this->count,
            'currency' => $this->currencyName,
            'unit' => $this->unitName,
            'start_date' => $this->start_date,
            'delivery_date' => $this->delivery_date,
            'status' => $this->status,          
            'statusData' => $this->getTaskStatus(),          
            'jobPrice'=> $this->jobPrice?new JobPriceResource($this->jobPrice->priceList):'',             
            'type'=>($this->status == 4)?'job_offer': 'job',
            'offer_type'=>(!empty($this->task_id) && $this->status == 4)?'offer_list': 'task',
            'file'=> $this->file,
            'fileLink'=> "https://aixnexus.com/erp/assets/uploads/taskFile/$this->file",
            'job_file'=> $this->jobFile?$this->jobFile->job_file:null,
            'job_fileLink'=> "https://aixnexus.com/erp/assets/uploads/jobFile/$this->job_file",
            'insrtuctions'=>$this->insrtuctions,
            
                        
        ];
  }
}
