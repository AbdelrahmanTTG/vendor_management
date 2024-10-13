<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Messaging extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'Active'];
    public $timestamps = false;
    protected $table = 'messaging_types';

    public static function insert($data)
    {
        return self::create($data);
    }
}
