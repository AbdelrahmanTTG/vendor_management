<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster that will be used by the
    | framework when an event needs to be broadcast. You may set this to
    | any of the connections defined in the "connections" array below.
    |
    | Supported: "reverb", "pusher", "ably", "redis", "log", "null"
    |
    */

    /* 'default' => env('BROADCAST_CONNECTION', 'reverb'),*/
    'default' =>  'reverb',
    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the broadcast connections that will be used
    | to broadcast events to other systems or over WebSockets. Samples of
    | each available type of connection are provided inside this array.
    |
    */

    'connections' => [

        'reverb' => [
            'driver' => 'reverb',
            'key' =>  'qm42aq7xixjvpowejavl',
            'secret' => 'pbcycd8psvfrxkv2qkuf',
            'app_id' =>  '897670',
            'options' => [
                'host' =>  'dev.aixnexus.com',
                'port' =>  6001,
                'scheme' =>  'https',
                'useTLS' =>  true,
            ],
            'client_options' => [
                'curl_options' => [
                    'cert' =>  "/etc/letsencrypt/live/dev.aixnexus.com/fullchain.pem",
                    'key' => "/etc/letsencrypt/live/dev.aixnexus.com/privkey.pem"
                ],
            ],
        ],

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],


];
