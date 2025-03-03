<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiUser extends Model
{
    protected $table = 'apiuser';
    protected $fillable = ['name', 'api_key', 'expires_at'];
    protected $casts = [
        'expires_at' => 'datetime',
    ];
    public $timestamps = false;

    public function isValid()
    {
        return !$this->expires_at || $this->expires_at->isFuture();
    }
}
