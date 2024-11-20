<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;
    protected $table = 'job';

    public function priceList()
    {
        return  $this->belongsTo(PriceList::class, 'price_list');
       
    }
    
    public function project()
    {
        return  $this->belongsTo(Project::class, 'project_id');
       
    }
}
