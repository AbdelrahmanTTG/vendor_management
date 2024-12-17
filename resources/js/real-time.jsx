// src/echo.js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
const createEcho = () => {
    return new Echo({
        broadcaster: 'reverb',
        key:"qm42aq7xixjvpowejavl",
        wsHost:"127.0.0.1",
        wsPort:  6001,
        wssPort:  6001,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        cluster: 'mt1',
        auth: {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("ACCESS_TOKEN"),
            },
        },
    });
};

export const echo = createEcho();

