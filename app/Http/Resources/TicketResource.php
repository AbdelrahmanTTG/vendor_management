<?php

namespace App\Http\Resources;

use App\Models\Job;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\Empty_;

class TicketResource extends JsonResource
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
            'request_type' => $this->getTicketType(),
            'service' => $this->serviceData->name,
            'task_type' => $this->taskType->name,
            'rate' => $this->rate,
            'count' => $this->count,
            'unit' => $this->unitData->name,
            'currency' => $this->currencyData->name,
            'source_lang' => $this->SourceName->name,
            'target_lang' => $this->TargetName->name,          
            'start_date' => $this->start_date,
            'delivery_date' => $this->delivery_date,
            'subject' => $this->SubjectName->name,
            'software' => $this->SoftwareName->name,
            'status' => $this->getTicketStatus(),          
            'statusVal' => $this->status,          
            'created_by' => $this->user?$this->user->user_name:$this->created_by,         
            'created_at' => $this->created_at,                     
            'number_of_resource' => $this->number_of_resource,                     
            'comment' => $this->comment,                             
            'fileLink'=> $this->file?"https://aixnexus.com/erp/assets/uploads/tickets/$this->file":null,                     
            'Time'=> TicketTimeResource::collection($this->whenLoaded('Time')),
            'TeamResponse'=>TicketTeamResponseResource::collection($this->whenLoaded('TeamResponse')),
            'Response'=> TicketResponseResource::collection($this->whenLoaded('Response')), 
            'TimeTaken'=> $this->ticketTime().' H:M', 
            'brand'=> $this->brand?$this->BrandName->name:'', 
                    
                        
        ];
  }
}
