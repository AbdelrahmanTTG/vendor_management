// src/echo.js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
const appKey = "qm42aq7xixjvpowejavl";
console.log("App Key:", appKey);
const createEcho = () => {
    return new Echo({
        broadcaster: 'reverb',
        key:appKey,
        wsHost: "dev.aixnexus.com",
        wsPort:  6001,
        wssPort: 6001,
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
