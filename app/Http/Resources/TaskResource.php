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
            'start_date' => $this->start_date,
            'delivery_date' => $this->delivery_date,
            'status' => $this->status,          
            'statusData' => $this->getTaskStatus(),          
           // 'jobPrice'=> new JobPriceResource($this->jobPrice->priceList), 
            'jobPrice'=> '', 
            'type'=>($this->status == 4)?'job_offer': 'job',
            'offer_type'=>(!empty($this->task_id) && $this->status == 4)?'offer_list': 'task',
                        
        ];
  }
}
