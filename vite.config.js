import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/main.jsx', // Ensure this line is present
            ],
            refresh: true,
        }),
    ],
    build: {
        outDir: 'public/build',
        // Ensure the output directory is set correctly
    },
});



