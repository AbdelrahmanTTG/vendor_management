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

    'default' => env('BROADCAST_CONNECTION', 'reverb'),
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
            'key' => env('REVERB_APP_KEY', "qm42aq7xixjvpowejavl"),
            'secret' => env('REVERB_APP_SECRET', "pbcycd8psvfrxkv2qkuf"),
            'app_id' => env('REVERB_APP_ID', '897670'),
            'options' => [
                'host' => env('REVERB_HOST', "portal.lingotalents.com"),
                'port' => env('REVERB_PORT', 6001),
                'scheme' => env('REVERB_SCHEME', 'https'),
                'useTLS' => env('REVERB_USE_TLS', true),
                // 'useTLS' => false,

            ],
            'client_options' => [],
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
