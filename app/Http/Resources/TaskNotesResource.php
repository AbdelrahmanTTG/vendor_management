<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TaskNotesResource extends JsonResource
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
                                  
            'created_at' => $this->created_at,            
            'created_by' => $this->user?$this->user->user_name:$this->created_by,            
            'from' => $this->from,            
            'message' => strip_tags($this->message),            
                                                                                                            
        ];
  }
}
