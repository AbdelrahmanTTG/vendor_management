<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Messages extends Model
{
    protected $fillable = [
        'sender_email',
        'receiver_email',
        'content',
        'is_read',
    ];
    public static function createMessage($senderId, $receiverId, $content)
    {
        return self::create([
            'sender_email' => $senderId,
            'receiver_email' => $receiverId,
            'content' => $content,
        ]);
    }
    public static function getLastMessageBetween($sender_email, $receiver_email)
    {
        return self::where(function ($query) use ($sender_email, $receiver_email) {
            $query->where('sender_email', $sender_email)
                ->where('receiver_email', $receiver_email);
        })
            ->latest('created_at')
            ->select('id', 'content', 'is_read', 'created_at') 
            ->first();

    }
    public static function getUnReadMessages($receiver_email,$limit)
    {
        return self::where(function ($query) use ($receiver_email) {
            $query->where('is_read', 0)
                ->where('receiver_email', $receiver_email);
        })
            ->latest('created_at')
            ->select('content') 
            ->limit($limit)->get();

    }
}