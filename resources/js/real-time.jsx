// src/echo.js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
const createEcho = () => {
    return new Echo({
        broadcaster: 'reverb',
        key: "qm42aq7xixjvpowejavl",
        wsHost: "localhost",
        wsPort:  8080,
        wssPort: 8080,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        auth: {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("ACCESS_TOKEN"),
            },
        },
    });
};

export const echo = createEcho();
