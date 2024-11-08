<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstantMessaging extends Model
{
    //
    protected $table = 'instant_messaging';
    protected $fillable = [
        'vendor_id',
        'messaging_type_id',
        'contact'
    ];
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }
    public function messagingType()
    {
        return $this->belongsTo(Messaging::class, 'messaging_type_id');
    }
}
