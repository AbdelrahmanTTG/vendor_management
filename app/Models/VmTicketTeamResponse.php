<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VmTicketTeamResponse extends Model
{
    protected $table = 'vm_ticket_team_response';
    protected $guarded = ['id'];
    public $timestamps = false;

    public function user()
    {
        return  $this->belongsTo(BrandUsers::class, 'created_by');
    }
}
