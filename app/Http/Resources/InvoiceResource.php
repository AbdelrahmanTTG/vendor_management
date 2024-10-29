<?php

namespace App\Http\Resources;

use App\Models\Job;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\Empty_;

class InvoiceResource extends JsonResource
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
            'total' => $this->total,
            'invoice_date' => $this->invoice_date,
            'billing_legal_name' => $this->billing_legal_name,
            'statusData' => $this->getVerifiedStatus(),        
                        
            'payment_method'=>($this->payment_method == 0)?'Bank': 'Wallet',
           
           
           
           
           
           
           
                        
        ];
  }
}
