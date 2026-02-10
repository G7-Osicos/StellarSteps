import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const SFX_WOOD_BREAK = '/assets/audio/whisper/wood break(1).mp3';
const BGM_FOREST_NIGHT = '/assets/audio/whisper/Forest night ambiance.mp3';

export default function Whisper2() {
    const [step, setStep] = useState(0); // 0 = Leo line, 1 = Marky line, 2 = Narrator SFX
    const { playVoice, playSFX, playBGM, stopVoice } = useAudio() ?? {};

    // From Whisper2 onwards: start forest night ambiance as BGM and let it continue
    useEffect(() => {
        if (BGM_FOREST_NIGHT && playBGM) playBGM(BGM_FOREST_NIGHT, true);
    }, [playBGM]);
    useEffect(() => {
        const src = AUDIO.whisper2?.voice?.[step];
        if (src && playVoice) playVoice(src);
    }, [step, playVoice]);
    useEffect(() => {
        if (step === 2 && SFX_WOOD_BREAK && playSFX) playSFX(SFX_WOOD_BREAK);
    }, [step, playSFX]);

    const SPEAKERS = ['LEO', 'MARKY', 'NARRATOR'];
    const LINES = [
        "I don't like this place, Marky. It's dark. And cold.",
        'Don\'t worry, Leo. A hero is not a coward even when he is terrified. We must locate the Second Star.',
        '(Sound Effect: CRACK! SNAP! A twig breaks nearby.)',
    ];

    return (
        <>
            <Head title="Whisper 2 - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background image – new woods view */}
                <img
                    src="/assets/img/whisperingwoods/bg 4.webp"
                    alt="Whispering Woods"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                />

                {/* Leo shivering on the left, facing right – nudged a bit more toward center */}
                <img
                    src="/assets/img/whisperingwoods/Leo%20Shivering-right.webp"
                    alt="Leo shivering"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-[22%] w-[min(40vw,480px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Marky – worried, then reassuring (Marky4 after first Next), slightly bigger than Leo (match Leo's style) – nudged a little further toward center */}
                <img
                    src={step === 0 ? '/assets/img/Marky3.webp' : '/assets/img/Marky4.webp'}
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] right-[20%] w-[min(44vw,540px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Narration bar – advances through Leo → Marky → Narrator SFX */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {SPEAKERS[step]}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {LINES[step]}
                            </div>
                        </div>
                        {/* Next arrow – steps through the three lines, then goes to Whisper3 */}
                        <button
                            type="button"
                            className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center ${
                                step < LINES.length - 1 ? 'hover:bg-yellow-200 cursor-pointer transition-colors' : 'opacity-60 cursor-default'
                            }`}
                            onClick={() => {
                                stopVoice?.();
                                if (step < LINES.length - 1) {
                                    setStep(step + 1);
                                } else {
                                    router.visit(route('mainplay.whisper3'));
                                }
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

