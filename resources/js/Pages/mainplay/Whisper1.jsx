import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

export default function Whisper1() {
    const { playVoice, stopVoice } = useAudio() ?? {};
    useEffect(() => {
        const src = AUDIO.whisper1?.voice?.[0];
        if (src && playVoice) playVoice(src);
    }, [playVoice]);
    return (
        <>
            <Head title="Whisper 1 - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background image */}
                <img
                    src="/assets/img/whisperingwoods/bg 4.webp"
                    alt="Whispering Woods"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                />

                {/* Leo in foreground, looking into the woods – nudged a bit closer to Marky */}
                <img
                    src="/assets/img/whisperingwoods/Leo looking-left.webp"
                    alt="Leo"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-[30%] w-[min(42vw,520px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Marky floating on the right – slightly bigger than Leo (match Leo's style) */}
                <img
                    src="/assets/img/Marky2-left.webp"
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] right-[6%] w-[min(44vw,540px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Narration bar – match Kingdom2 style with arrow */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                Narrator
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                Leo has arrived in the Whispering Woods. It is quiet here. Too quiet. The trees appear to be on guard of him.
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                            onClick={() => {
                                stopVoice?.();
                                router.visit(route('mainplay.whisper2'));
                            }}
                            aria-label="Next"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

