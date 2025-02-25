<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mailer extends Model
{
    protected $table = 'mailer';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'alias_id',
        'status'
    ];
    
}
