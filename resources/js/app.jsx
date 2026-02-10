import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import FullscreenToggle from '@/Components/FullscreenToggle';
import MainplaySettingsMenu from '@/Components/MainplaySettingsMenu';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AudioProvider } from '@/contexts/AudioContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx', { eager: false }),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <SettingsProvider>
                <AudioProvider>
                    <App {...props} />
                <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
                    <FullscreenToggle />
                    <MainplaySettingsMenu />
                </div>
                </AudioProvider>
            </SettingsProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
