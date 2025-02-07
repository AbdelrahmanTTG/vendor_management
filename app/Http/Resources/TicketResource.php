<?php

namespace App\Http\Resources;

use App\Models\Job;
use App\Models\VmSetup;
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
        if($this->requester_function == 1){
            $requester_function = 'SAM';
        }else if($this->requester_function == 2){
            $requester_function = 'PM';    
        }else{
            $requester_function = '';   
        }
        return [
            'id' => $this->id,
            'request_type' => $this->getTicketType(),
            'request_type_val' => $this->request_type,
            'service' => $this->serviceData-> name ?? null,
            'task_type' => $this->taskType-> name ?? null,
            'rate' => $this-> rate ?? null,
            'count' => $this-> count ?? null,
            'unit' => $this->unitData-> name ?? null,
            'currency' => $this->currencyData-> name ?? null,
            'source_lang' => $this->SourceName-> name ?? null,
            'target_lang' => $this->TargetName-> name ?? null,          
            'start_date' => $this-> start_date ?? null,
            'delivery_date' => $this-> delivery_date ?? null,
            'subject' => $this->SubjectName-> name ?? null,
            'software' => $this->SoftwareName->name ?? null,
            'status' => $this->getTicketStatus(),          
            'statusVal' => $this-> status ?? null,          
            'created_by' => $this->user?$this->user->user_name:$this-> created_by ?? null,         
            'created_at' => $this-> created_at ?? null,                     
            'number_of_resource' => $this-> number_of_resource ?? null,                     
            'comment' => $this-> comment ?? null,                             
            'fileLink'=> $this->file?VmSetup::getUploadsFullLink()."/tickets/$this->file":null,                     
            'Time'=> TicketTimeResource::collection($this->whenLoaded('Time')),
            'TeamResponse'=>TicketTeamResponseResource::collection($this->whenLoaded('TeamResponse')),
            'Response'=> TicketResponseResource::collection($this->whenLoaded('Response')), 
            'TimeTaken'=> $this->ticketTime().' H:M',
            'brand' => @$this->brand ? (@$this->BrandName ? (object) ['id' => $this->BrandName->id, 'name' => $this->BrandName->name] : '') : '',
            'time_of_opening'=> $this->open_time??null, 
            'opened_by'=> $this->opened_by?$this->getUser($this->opened_by):null, 
            'time_of_closing'=> $this->closed_time??null, 
            'closed_by'=> $this->closed_by?$this->getUser($this->closed_by):null, 

            'new'=> $this->open_time?$this->getResourcesCount(1):null,
            'existing'=> $this->open_time?$this->getResourcesCount(2):null, 
            'existing_pair'=> $this->open_time?$this->getResourcesCount(3):null,
            'TicketResource'=> $this->whenLoaded('TicketResource')?$this->TicketResource:null,
            'rejection_reason'=> $this->rejection_reason,
            'assignedUser'=> $this->assigned_to?$this->assigned_to_user->user_name:0,
            'requester_function'=> $requester_function,

                    
                        
        ];
  }
}
