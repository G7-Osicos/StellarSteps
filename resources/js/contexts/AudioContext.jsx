import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
    const settings = useSettings();
    const volume = settings?.volume ?? 80;
    const muted = settings?.muted ?? false;
    const updateSettings = settings?.updateSettings ?? (() => {});
    const bgmRef = useRef(null);
    const ambientRef = useRef(null);
    const voiceRef = useRef(null);
    const sfxRef = useRef(null);

    const getGain = useCallback(() => {
        if (muted) return 0;
        const v = Number(volume);
        const gain = (Number.isFinite(v) ? v : 80) / 100;
        return Math.min(1, Math.max(0, gain));
    }, [muted, volume]);

    const playBGM = useCallback(
        (src, loop = true) => {
            if (!src) return;
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current = null;
            }
            const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
            const audio = new Audio(resolvedSrc);
            audio.volume = getGain();
            audio.loop = loop;
            audio.play().catch(() => {});
            bgmRef.current = audio;
        },
        [getGain]
    );

    const stopBGM = useCallback(() => {
        if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
            bgmRef.current = null;
        }
    }, []);

    const playAmbient = useCallback(
        (src, loop = true) => {
            if (!src) return;
            if (ambientRef.current) {
                ambientRef.current.pause();
                ambientRef.current = null;
            }
            const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
            const audio = new Audio(resolvedSrc);
            audio.volume = getGain() * 0.6;
            audio.loop = loop;
            audio.play().catch(() => {});
            ambientRef.current = audio;
        },
        [getGain]
    );

    const stopAmbient = useCallback(() => {
        if (ambientRef.current) {
            ambientRef.current.pause();
            ambientRef.current.currentTime = 0;
            ambientRef.current = null;
        }
    }, []);

    const stopVoice = useCallback(() => {
        if (voiceRef.current) {
            voiceRef.current.pause();
            voiceRef.current.currentTime = 0;
            voiceRef.current = null;
            // Restore BGM volume when voice is stopped
            const fullGain = getGain();
            if (bgmRef.current && Number.isFinite(fullGain)) {
                bgmRef.current.volume = fullGain;
            }
        }
    }, [getGain]);

    const playVoice = useCallback(
        (src, volumeMultiplier = 1, onEnded) => {
            if (!src) return;
            if (voiceRef.current) {
                voiceRef.current.pause();
                voiceRef.current = null;
            }
            // Duck BGM while voice is playing (reduce to ~25% of normal)
            const fullGain = getGain();
            if (bgmRef.current && Number.isFinite(fullGain)) {
                bgmRef.current.volume = Math.max(0, fullGain * 0.25);
            }
            const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
            const audio = new Audio(resolvedSrc);
            const mult = Number(volumeMultiplier);
            audio.volume = Math.min(1, Math.max(0, fullGain * (Number.isFinite(mult) ? mult : 1)));
            audio.play().catch(() => {});
            voiceRef.current = audio;
            audio.onended = () => {
                voiceRef.current = null;
                // Restore BGM volume when voice ends
                if (bgmRef.current && Number.isFinite(fullGain)) {
                    bgmRef.current.volume = fullGain;
                }
                if (typeof onEnded === 'function') onEnded();
            };
        },
        [getGain]
    );

    const stopSFX = useCallback(() => {
        if (sfxRef.current) {
            sfxRef.current.pause();
            sfxRef.current.currentTime = 0;
            sfxRef.current = null;
        }
    }, []);

    const playSFX = useCallback(
        (src, onEnded) => {
            if (!src) return;
            if (sfxRef.current) {
                sfxRef.current.pause();
                sfxRef.current = null;
            }
            const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
            const audio = new Audio(resolvedSrc);
            audio.volume = getGain();
            audio.play().catch(() => {});
            sfxRef.current = audio;
            audio.onended = () => {
                sfxRef.current = null;
                if (typeof onEnded === 'function') onEnded();
            };
        },
        [getGain]
    );

    const updateVolume = useCallback(
        (v) => {
            const next = Math.min(100, Math.max(0, Number(v) || 0));
            const gain = muted ? 0 : next / 100;
            if (bgmRef.current && Number.isFinite(gain)) bgmRef.current.volume = gain;
            if (ambientRef.current && Number.isFinite(gain)) ambientRef.current.volume = gain * 0.6;
            updateSettings({ volume: next });
        },
        [muted, updateSettings]
    );

    const updateMuted = useCallback(
        (m) => {
            const gain = m ? 0 : Math.min(1, Math.max(0, (Number(volume) || 80) / 100));
            if (bgmRef.current && Number.isFinite(gain)) bgmRef.current.volume = gain;
            if (ambientRef.current && Number.isFinite(gain)) ambientRef.current.volume = gain * 0.6;
            updateSettings({ muted: m });
        },
        [volume, updateSettings]
    );

    useEffect(() => {
        const gain = getGain();
        if (bgmRef.current && Number.isFinite(gain)) bgmRef.current.volume = gain;
        if (ambientRef.current && Number.isFinite(gain)) ambientRef.current.volume = gain * 0.6;
    }, [getGain]);

    return (
        <AudioContext.Provider
            value={{
                playBGM,
                stopBGM,
                playAmbient,
                stopAmbient,
                playVoice,
                stopVoice,
                playSFX,
                stopSFX,
                volume,
                muted,
                updateVolume,
                updateMuted,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const ctx = useContext(AudioContext);
    return ctx;
}
