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
    // Remember last multiplier used for voice so volume/mute changes
    // can preserve relative loudness (e.g. Leo boost).
    const voiceMultRef = useRef(1);

    const getGain = useCallback(() => {
        if (muted) return 0;
        const v = Number(volume);
        const gain = (Number.isFinite(v) ? v : 80) / 100;
        return Math.min(1, Math.max(0, gain));
    }, [muted, volume]);

    // Ref updated every render so play callbacks can read current gain without
    // depending on getGain (keeps playBGM/playVoice stable and prevents
    // volume/mute changes from retriggering page useEffects that restart audio).
    const gainRef = useRef(getGain());
    gainRef.current = getGain();

    const playBGM = useCallback((src, loop = true) => {
        if (!src) return;
        if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current = null;
        }
        const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
        const audio = new Audio(resolvedSrc);
        audio.volume = gainRef.current;
        audio.loop = loop;
        audio.play().catch(() => {});
        bgmRef.current = audio;
    }, []);

    const stopBGM = useCallback(() => {
        if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
            bgmRef.current = null;
        }
    }, []);

    const playAmbient = useCallback((src, loop = true) => {
        if (!src) return;
        if (ambientRef.current) {
            ambientRef.current.pause();
            ambientRef.current = null;
        }
        const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
        const audio = new Audio(resolvedSrc);
        audio.volume = gainRef.current * 0.6;
        audio.loop = loop;
        audio.play().catch(() => {});
        ambientRef.current = audio;
    }, []);

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
            const fullGain = gainRef.current;
            if (bgmRef.current && Number.isFinite(fullGain)) {
                bgmRef.current.volume = fullGain;
            }
        }
    }, []);

    const playVoice = useCallback((src, volumeMultiplier = 1, onEnded) => {
        if (!src) return;
        if (voiceRef.current) {
            voiceRef.current.pause();
            voiceRef.current = null;
        }
        const fullGain = gainRef.current;
        // Duck BGM while voice is playing (reduce to ~25% of normal)
        if (bgmRef.current && Number.isFinite(fullGain)) {
            bgmRef.current.volume = Math.max(0, fullGain * 0.25);
        }
        const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
        const audio = new Audio(resolvedSrc);

        // Boost Leo's narration VOs slightly so they are clearer over BGM.
        let mult = Number(volumeMultiplier);
        if (!Number.isFinite(mult) || mult <= 0) mult = 1;
        if (resolvedSrc.includes('/Leo/')) {
            mult *= 1.35; // ~ +2.6 dB
        }
        voiceMultRef.current = mult;

        audio.volume = Math.min(1, Math.max(0, fullGain * mult));
        audio.play().catch(() => {});
        voiceRef.current = audio;
        audio.onended = () => {
            voiceRef.current = null;
            // Restore BGM volume when voice ends (use current gain in case user changed volume)
            const currentGain = gainRef.current;
            if (bgmRef.current && Number.isFinite(currentGain)) {
                bgmRef.current.volume = currentGain;
            }
            if (typeof onEnded === 'function') onEnded();
        };
    }, []);

    const stopSFX = useCallback(() => {
        if (sfxRef.current) {
            sfxRef.current.pause();
            sfxRef.current.currentTime = 0;
            sfxRef.current = null;
        }
    }, []);

    const playSFX = useCallback((src, onEnded) => {
        if (!src) return;
        if (sfxRef.current) {
            sfxRef.current.pause();
            sfxRef.current = null;
        }
        const resolvedSrc = src.includes(' ') ? encodeURI(src) : src;
        const audio = new Audio(resolvedSrc);
        audio.volume = gainRef.current;
        audio.play().catch(() => {});
        sfxRef.current = audio;
        audio.onended = () => {
            sfxRef.current = null;
            if (typeof onEnded === 'function') onEnded();
        };
    }, []);

    const updateVolume = useCallback(
        (v) => {
            const next = Math.min(100, Math.max(0, Number(v) || 0));
            updateSettings({ volume: next });

            // Immediate effect: scale all active audio by new volume, honoring mute.
            const baseGain = next / 100;
            const gain = muted ? 0 : baseGain;
            if (bgmRef.current && Number.isFinite(gain)) bgmRef.current.volume = gain;
            if (ambientRef.current && Number.isFinite(gain)) ambientRef.current.volume = gain * 0.6;
            if (voiceRef.current && Number.isFinite(gain)) {
                voiceRef.current.volume = Math.min(
                    1,
                    Math.max(0, gain * (voiceMultRef.current || 1)),
                );
            }
            if (sfxRef.current && Number.isFinite(gain)) {
                sfxRef.current.volume = gain;
            }
        },
        [muted, updateSettings]
    );

    const updateMuted = useCallback(
        (m) => {
            updateSettings({ muted: m });

            // Apply new gain immediately (use new muted state m, not previous render's getGain).
            const baseGain = m ? 0 : Math.min(1, Math.max(0, (Number(volume) || 80) / 100));
            if (bgmRef.current && Number.isFinite(baseGain)) bgmRef.current.volume = baseGain;
            if (ambientRef.current && Number.isFinite(baseGain)) ambientRef.current.volume = baseGain * 0.6;
            if (voiceRef.current && Number.isFinite(baseGain)) {
                voiceRef.current.volume = Math.min(1, Math.max(0, baseGain * (voiceMultRef.current || 1)));
            }
            if (sfxRef.current && Number.isFinite(baseGain)) {
                sfxRef.current.volume = baseGain;
            }
        },
        [volume, updateSettings]
    );

    useEffect(() => {
        const gain = getGain();
        if (bgmRef.current && Number.isFinite(gain)) bgmRef.current.volume = gain;
        if (ambientRef.current && Number.isFinite(gain)) ambientRef.current.volume = gain * 0.6;
        if (voiceRef.current && Number.isFinite(gain)) {
            voiceRef.current.volume = Math.min(1, Math.max(0, gain * (voiceMultRef.current || 1)));
        }
        if (sfxRef.current && Number.isFinite(gain)) {
            sfxRef.current.volume = gain;
        }
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
