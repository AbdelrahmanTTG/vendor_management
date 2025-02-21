<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AliasMail extends Model
{
    protected $table = 'aliasmails';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'email',
        'brand_id',
        'status',
    ];
    public function users()
    {
        return $this->belongsToMany(BrandUsers::class, 'mailer', 'alias_id', 'user_id')
            ->withPivot('status'); 
    }

    //
}
