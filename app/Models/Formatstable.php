<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formatstable extends Model
{
        protected $table = 'formatsTable';
         protected $fillable = [
        'user_id',
        'name',
        "table",
        'format',
        'status',
    ];
    //
}
