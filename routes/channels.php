<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Crypt;

Broadcast::channel('newMessage-private-channel.User.{id}', function ($user, $id) {
    $decID = (int) Crypt::decrypt($id); 
    return (int) $user->id === $decID ;
}, ['guards' => ['api', 'vendor']]);


