import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

export default function Whisper4EndStar() {
    const { playSFX, playVoice, stopVoice } = useAudio() ?? {};
    const [showStar, setShowStar] = useState(false);
    const [starClicked, setStarClicked] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShowStar(true), 1000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!showStar) return;
        const src = AUDIO.whisper4EndStar?.voice?.[0];
        if (src && playVoice) playVoice(src);
        return () => stopVoice?.();
    }, [showStar, playVoice, stopVoice]);

    useEffect(() => {
        if (!starClicked) return;
        const t = setTimeout(() => router.visit(route('mainplay.whisperingwoods-complete')), 800); // after star-spin
        return () => clearTimeout(t);
    }, [starClicked]);

    return (
        <>
            <Head title="Second Star - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background – same as Whisper4End step 5 */}
                <img
                    src="/assets/img/whisperingwoods/bg-%232invert.webp"
                    alt="Whispering Woods"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                    aria-hidden
                />

                {/* Leo – left */}
                <img
                    src="/assets/img/whisperingwoods/Leo%20thankful-right.webp"
                    alt="Leo"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-[18%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[30] fade-in-soft"
                    aria-hidden
                />

                {/* Marky – right */}
                <img
                    src="/assets/img/Marky2-left.webp"
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] right-[18%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[30] fade-in-soft"
                    aria-hidden
                />

                {/* Star in the middle – appears after 1s, user clicks it */}
                {showStar && (
                    <div
                        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[min(40vw,400px)] flex justify-center items-center"
                        role="button"
                        tabIndex={0}
                        onClick={() => { if (!starClicked) { playSFX?.(AUDIO.sfx.starClick); setStarClicked(true); } }}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !starClicked) { playSFX?.(AUDIO.sfx.starClick); setStarClicked(true); } }}
                    >
                        <div className={starClicked ? 'star-spin' : ''}>
                            <img
                                src="/assets/img/Star.webp"
                                alt="Star"
                                loading="eager"
                                decoding="async"
                                className="w-full h-auto object-contain star-fade-in cursor-pointer transition-transform duration-300 hover:scale-110 hover:brightness-110"
                            />
                        </div>
                    </div>
                )}

                {/* Narration bar – no Next button */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                MARKY
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {starClicked ? "Yes! We got the Star of Empathy! One step closer to going home." : "Look! It's the Second Star!"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
