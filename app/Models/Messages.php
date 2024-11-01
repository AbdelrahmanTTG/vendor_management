<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Messages extends Model
{
    protected $fillable = [
        'sender_email',
        'receiver_email',
        'content',
    ];
    public static function createMessage($senderId, $receiverId, $content)
    {
        return self::create([
            'sender_email' => $senderId,
            'receiver_email' => $receiverId,
            'content' => $content,
        ]);
    }
}
