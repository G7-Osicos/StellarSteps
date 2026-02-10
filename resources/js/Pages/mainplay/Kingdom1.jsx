import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

const FALL_DURATION_MS = 2500;
const SFX_FALLING = '/assets/audio/bgm/sfx 1 - Falling.mp3';

const VOICE_NARRATOR = '/assets/audio/ins/Narrator7.m4a';

export default function Kingdom1() {
    const { playSFX, playVoice, stopVoice } = useAudio() ?? {};
    const [showNarration, setShowNarration] = useState(false);
    const [showMarky, setShowMarky] = useState(false);

    useEffect(() => {
        if (showNarration && VOICE_NARRATOR && playVoice) playVoice(VOICE_NARRATOR);
        return () => stopVoice?.();
    }, [showNarration, playVoice, stopVoice]);

    useEffect(() => {
        playSFX?.(SFX_FALLING);
        // Only play once on mount (Leo falling)
    }, []);

    useEffect(() => {
        // Show narration and Marky only after Leo has stopped falling
        const t = setTimeout(() => {
            setShowNarration(true);
            setShowMarky(true);
        }, FALL_DURATION_MS);
        return () => clearTimeout(t);
    }, []);

    const narration =
        "Leo falls off the sky and lands in... a stack of socks? Yuck! He looks around. He is in a huge rocky castle, yet it does not appear like a royal palace. It looks like a disaster zone.";

    return (
        <>
            <Head title="Chapter 1: The Kingdom of Clutter" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                <img
                    src="/assets/img/C1F2-BG.webp"
                    alt="Kingdom of Clutter"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                />

                {/* Falling Leo from top left to lower left - remains visible after landing */}
                <img
                    src="/assets/img/C1F2-Leo.webp"
                    alt="Leo"
                    loading="eager"
                    decoding="async"
                    className="absolute top-0 left-[2%] w-[min(70vw,700px)] h-auto object-contain pointer-events-none fall-down-left"
                    style={{ willChange: 'transform' }}
                    aria-hidden
                />

                {/* Marky fades in at upper right after Leo stops falling */}
                {showMarky && (
                    <img
                        src="/assets/img/Marky3.webp"
                        alt="Marky"
                        loading="eager"
                        decoding="async"
                        className="absolute top-6 right-16 sm:top-8 sm:right-20 w-[min(32vw,280px)] h-auto object-contain pointer-events-none fade-in-soft"
                        aria-hidden
                    />
                )}

                {/* Narration bar – Narrator format with speaker label and Next arrow */}
                {showNarration && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                    Narrator
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    {narration}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); router.visit(route('mainplay.kingdom2')); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
