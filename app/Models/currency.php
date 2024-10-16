<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;
    protected $table = 'currency';
    protected $fillable = [ 'name', 'Active'];
    public $timestamps = false;
    public static function insert($data)
    {
        return self::create($data);
    }

}
