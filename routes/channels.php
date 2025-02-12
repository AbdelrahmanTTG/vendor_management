<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Crypt;

Broadcast::channel('newMessage-private-channel.User.{email}', function ($user, $email) {
    $decEmail = app('decrypt')(base64_decode($email));
    return  $user->email === $decEmail ;
}, ['guards' => ['api', 'vendor']]);
Broadcast::channel('test', function () {
 
});

