<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Format extends Model
{
    protected $table = 'formatstable';
   protected $fillable = [
        'user_id',
        'name',
        "table",
        'format',
        'status',
    ];
    
    //
}
