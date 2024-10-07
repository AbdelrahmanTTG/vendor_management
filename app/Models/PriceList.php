<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceList extends Model
{
    use HasFactory;
    protected $table = 'job_price_list';

    public function SourceName()
    {
        return  $this->belongsTo(Language::class, 'source')->select(['name']);
    }  

    public function TargetName()
    {
        return  $this->belongsTo(Language::class, 'target')->select(['name']);
    }               

}
