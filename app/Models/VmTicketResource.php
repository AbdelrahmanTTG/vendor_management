<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VmTicketResource extends Model
{

    protected $table = 'vm_ticket_resource';
    protected $guarded = ['id'];
    public $timestamps = false;

    public function vendor()
    {
        return  $this->belongsTo(Vendor::class, 'vendor');
    }
}
