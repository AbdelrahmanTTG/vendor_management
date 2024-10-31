<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messg;
    public $userId; 

    public function __construct($messg, $userId)
    {
        $this->messg = $messg;
        $this->userId = $userId; 
    }

    public function broadcastOn()
    {
        return new PrivateChannel('newMessage-private-channel.User.' . $this->userId);
    }
    
    public function broadcastAs()
    {
        return "newMessage";
    }

    public function broadcastWith()
    {
        return ["data" => $this->messg];
    }
}

