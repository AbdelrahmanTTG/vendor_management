<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    //
    protected $fillable = [
        'sender_email',
        'receiver_email',
        'content',
        'screen',
        'screen_id',
        'status',
        "creator"
    ];
}
