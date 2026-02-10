import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const BG_BY_STEP = [
    '/assets/img/Chapter 1- Frame 15.webp',
    '/assets/img/C1F16-BG.webp',
    '/assets/img/Chapter 1- Frame 17.webp',
    '/assets/img/C1F18-BG.webp',
    '/assets/img/C1F18-BG.webp',
];

const NARRATIONS = [
    'My Crown! You found it!',
    null,
    'Oh, thank you, brave Leo! And thank you, invisible friend! My castle is beautiful again. I vow I will get my toys away next time.',
    'Yea, King Crumble... you see, when the room is clean, it is easier to play. And it smells way better.',
    'Indeed! You have taught me a good lesson to-day. A clean kingdom is a happy kingdom!',
];

const SPEAKERS = ['KING CRUMBLE', null, 'KING CRUMBLE', 'LEO', 'KING CRUMBLE'];

const KINGDOM_END_BGM = '/assets/audio/bgm/BGM - Frame 15 - 19.wav';

export default function KingdomEnd() {
    const { playBGM, playVoice, stopVoice } = useAudio() ?? {};
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (KINGDOM_END_BGM && playBGM) playBGM(KINGDOM_END_BGM, true);
    }, [playBGM]);

    useEffect(() => {
        const src = AUDIO.kingdomEnd?.voice?.[step];
        if (src && playVoice) playVoice(src);
    }, [step, playVoice]);

    useEffect(() => {
        if (step !== 1) return;
        const t = setTimeout(() => setStep(2), 2000);
        return () => clearTimeout(t);
    }, [step]);

    return (
        <>
            <Head title="Chapter 1: The Kingdom of Clutter - End" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background */}
                <img
                    src={BG_BY_STEP[step]}
                    alt={step === 0 ? 'King Crumble' : step === 1 ? 'Throne room' : step === 2 ? 'King Crumble' : 'Castle room'}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                />

                {/* King Crumble in the middle (step 1 only) */}
                {step === 1 && (
                    <img
                        src="/assets/img/Frame16-King.PNG"
                        alt="King Crumble"
                        loading="eager"
                        decoding="async"
                        className="absolute left-[calc(50%-80px)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(98vw,1600px)] h-auto object-contain object-center fade-in-soft"
                    />
                )}

                {/* Leo on the right (step 3, 4) */}
                {(step === 3 || step === 4) && (
                    <img
                        src="/assets/img/Frame 18-Leo.webp"
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute right-[5%] -bottom-[3%] w-[min(36vw,380px)] h-auto object-contain object-bottom fade-in-soft"
                    />
                )}

                {/* Narration bar (step 0, 2, 3, 4) */}
                {(step === 0 || step === 2 || step === 3 || step === 4) && NARRATIONS[step] && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110] fade-in-soft">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                    {SPEAKERS[step]}
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    {NARRATIONS[step]}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => {
                                    stopVoice?.();
                                    if (step === 4) {
                                        router.visit(route('mainplay.kingdom-complete'));
                                    } else {
                                        setStep((s) => s + 1);
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
                )}

            </div>
        </>
    );
}
