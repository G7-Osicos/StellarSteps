import { useState, useRef, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAudio } from '@/contexts/AudioContext';

/**
 * Hamburger menu below the fullscreen button. Provides quick access to:
 * Screen Brightness, Volume, and Mute — so users can adjust settings from any page.
 */
export default function MainplaySettingsMenu({ className = '' }) {
    const [currentUrl, setCurrentUrl] = useState(
        typeof window !== 'undefined' ? window.location.pathname : ''
    );
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    const { screenBrightness, updateSettings } = useSettings() ?? { screenBrightness: 100, updateSettings: () => {} };
    const { volume, muted, updateVolume, updateMuted } = useAudio() ?? { volume: 80, muted: false, updateVolume: () => {}, updateMuted: () => {} };

    // Keep the menu in sync with Inertia navigation (this component is mounted
    // outside the Inertia tree, so it won't automatically re-render on route changes).
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const update = () => setCurrentUrl(window.location.pathname);
        window.addEventListener('popstate', update);
        document.addEventListener('inertia:navigate', update);
        document.addEventListener('inertia:finish', update);
        return () => {
            window.removeEventListener('popstate', update);
            document.removeEventListener('inertia:navigate', update);
            document.removeEventListener('inertia:finish', update);
        };
    }, []);

    // Close when clicking outside
    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    // Hide burger menu on Welcome, Signup, and Mainplay map;
    // show it on story pages (prologue, chapters, epilogue, etc.).
    const HIDE_PATHS = ['/', '/mainplay', '/signup', '/login'];
    if (HIDE_PATHS.includes(currentUrl)) {
        return null;
    }

    return (
        <div ref={panelRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white/90 hover:text-white transition-colors"
                aria-label={open ? 'Close settings menu' : 'Open settings menu'}
                aria-expanded={open}
                aria-haspopup="true"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {open && (
                <div
                    className="absolute left-0 top-full mt-2 min-w-[280px] max-w-[90vw] rounded-xl bg-black/85 backdrop-blur-md border border-white/20 shadow-xl p-4 z-[9998] fade-in-soft"
                    role="menu"
                >
                    <div className="flex flex-col gap-4">
                        {/* Screen Brightness */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-semibold">Screen Brightness</label>
                            <div className="settings-slider-wrap mt-1 w-full" style={{ ['--slider-complete']: (screenBrightness - 50) / 50 }}>
                                <div className="settings-slider-track">
                                    <div className="settings-slider-progress" />
                                </div>
                                <span className="settings-slider-percent text-gray-800 text-sm font-bold">{screenBrightness}%</span>
                                <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    value={screenBrightness}
                                    onChange={(e) => updateSettings({ screenBrightness: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Volume */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-semibold">Volume</label>
                            <div className="settings-slider-wrap mt-1 w-full" style={{ ['--slider-complete']: volume / 100 }}>
                                <div className="settings-slider-track">
                                    <div className="settings-slider-progress" />
                                </div>
                                <span className="settings-slider-percent text-gray-800 text-sm font-bold">{volume}%</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => updateVolume(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Mute */}
                        <div className="flex items-center justify-between">
                            <label className="text-white text-sm font-semibold">Mute</label>
                            <button
                                type="button"
                                onClick={() => updateMuted(!muted)}
                                className={`w-12 h-6 rounded-full transition-colors ${muted ? 'bg-amber-600' : 'bg-amber-200'}`}
                                aria-pressed={muted}
                            >
                                <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${muted ? 'translate-x-7' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
