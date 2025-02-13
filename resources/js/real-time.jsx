// src/echo.js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
const createEcho = () => {
    return new Echo({
        broadcaster: 'reverb',
        key: "qm42aq7xixjvpowejavl",
        wsHost: "portal.lingotalents.com",
        wsPort: window.location.protocol === "https:" ? 443 : 6001,  
        wssPort: 443,  
        forceTLS: true,  
        enabledTransports: ['wss'],  
        auth: {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("ACCESS_TOKEN"),
            },
        },
    });

};

export const echo = createEcho();

