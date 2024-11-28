<?php

namespace App\Http\Resources;

use App\Models\Job;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\Empty_;

class TicketResponseResource extends JsonResource
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
            'response' => $this->response,          
            'created_by' => $this->user?$this->user->user_name:$this->created_by,         
            'created_at' => $this->created_at,
            'fileLink'=> $this->file?"https://aixnexus.com/erp/assets/uploads/tickets/$this->file":null,                     
               
                    
                        
        ];
  }
}
