<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $table = 'project';

    public function customer()
    {
        return  $this->belongsTo(Customer::class, 'customer');
       
    }
    public function getcustomerBrand()
    {
        return  $this->belongsTo(Customer::class, 'customer')->select(['brand']);
       
    }
   
}
