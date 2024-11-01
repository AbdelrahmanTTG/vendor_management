<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class LoggerMaster extends Model
{
    use HasFactory;
    protected $table = 'logger_master';   
    protected $guarded = ['id'];

     
}
