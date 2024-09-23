// useScripts.js
import { useEffect } from 'react';
const useScripts = (scripts) => {
    useEffect(() => {
        const addScripts = () => {
            const scriptElements = scripts.map((src) => {
                const script = document.createElement('script');
                script.src = `${src}`;
                script.async = true;
                return script;
            });

            scriptElements.forEach((script) => document.body.appendChild(script));

            return () => {
                scriptElements.forEach((script) => document.body.removeChild(script));
            };
        };

        const cleanup = addScripts();
        return cleanup;
    }, [scripts]);
};

export default useScripts;
