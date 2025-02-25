<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class Notice implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $content;
    public $email;

    public function __construct($content, $email)
    {
        $this->content = $content;
        $this->email = $email;
    }

    public function broadcastOn()
    {

        // return new PrivateChannel('Notice-private-channel.User.' . $this->email);
        return new PrivateChannel('notice-private-channel.User.' . $this->email);

        // return [
        //     new Channel('test'),
        // ];
    }

    public function broadcastAs()
    {
        return "notice";
    }

    public function broadcastWith()
    {
        return ["data" => $this->content];
    }
}
