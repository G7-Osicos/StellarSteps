import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'stellar-steps-settings';
const DEFAULT_BRIGHTNESS = 100;
const DEFAULT_TEXT_SIZE = 130;
const DEFAULT_VOLUME = 80;
const DEFAULT_MUTED = false;

function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                screenBrightness: Math.min(100, Math.max(50, Number(parsed.screenBrightness) || DEFAULT_BRIGHTNESS)),
                textSize: Math.min(200, Math.max(80, Number(parsed.textSize) || DEFAULT_TEXT_SIZE)),
                volume: Math.min(100, Math.max(0, Number(parsed.volume) || DEFAULT_VOLUME)),
                muted: Boolean(parsed.muted ?? DEFAULT_MUTED),
            };
        }
    } catch (_) {}
    return { screenBrightness: DEFAULT_BRIGHTNESS, textSize: DEFAULT_TEXT_SIZE, volume: DEFAULT_VOLUME, muted: DEFAULT_MUTED };
}

function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {}
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(loadSettings);

    useEffect(() => {
        document.documentElement.style.setProperty('--narration-text-size', `${settings.textSize}%`);
    }, [settings]);

    function updateSettings(updates) {
        setSettings((prev) => {
            const next = { ...prev, ...updates };
            saveSettings(next);
            return next;
        });
    }

    return (
        <SettingsContext.Provider value={{ ...settings, updateSettings }}>
            <div
                className="fixed inset-0 overflow-hidden"
                style={{ filter: `brightness(${settings.screenBrightness}%)` }}
            >
                {children}
            </div>
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    return ctx;
}
