import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const FULL_BG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Full BG.webp';
const CLIMBING_LEO_BG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Climbing Leo.webp';
const MARKY_LEFT = '/assets/img/Marky2-left.webp';
const MARKY3 = '/assets/img/Marky3.webp';

export default function Clouds1() {
    const [step, setStep] = useState(1);
    const { playVoice, stopVoice, playAmbient, stopAmbient } = useAudio() ?? {};
    useEffect(() => {
        const src = AUDIO.clouds1?.voice?.[step - 1];
        if (src && playVoice) playVoice(src);
        else stopVoice?.();
    }, [step, playVoice, stopVoice]);
    useEffect(() => {
        if (AUDIO.clouds1?.bgm && playAmbient) playAmbient(AUDIO.clouds1.bgm);
        return () => stopAmbient?.();
    }, [playAmbient, stopAmbient]);

    const step1 = (
        <>
            <img
                src={encodeURI(FULL_BG)}
                alt="Clouds - The Gate of Gratitude"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                            Narrator
                        </div>
                        <div className="h-px bg-white/30 mb-2" aria-hidden />
                        <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                            Leo is almost there. He has scaled up and above the birds. But the wind is strong! It wants to push him back down.
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                        onClick={() => setStep(2)}
                        aria-label="Next"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );

    const step2 = (
        <>
            <img
                src={encodeURI(CLIMBING_LEO_BG)}
                alt="Leo climbing the mountain"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                            Leo
                        </div>
                        <div className="h-px bg-white/30 mb-2" aria-hidden />
                        <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                            It&apos;s... too... hard! I can&apos;t reach the top!
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                        onClick={() => setStep(3)}
                        aria-label="Next"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );

    const step3 = (
        <>
            <img
                src={encodeURI(CLIMBING_LEO_BG)}
                alt="Leo climbing the mountain"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <img
                src={MARKY_LEFT}
                alt="Marky"
                loading="eager"
                decoding="async"
                className="absolute left-[55%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-auto object-contain pointer-events-none"
                aria-hidden
            />
            <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                            Marky
                        </div>
                        <div className="h-px bg-white/30 mb-2" aria-hidden />
                        <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                            Don&apos;t give up, Leo! Remember the Star of Order? Do you remember the Star of Kindness? You have come so far. Just one more big push!
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                        onClick={() => { stopVoice?.(); setStep(4); }}
                        aria-label="Next"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );

    const step4 = (
        <>
            <img
                src={encodeURI(CLIMBING_LEO_BG)}
                alt="Leo climbing the mountain"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <img
                src={MARKY3}
                alt="Marky"
                loading="eager"
                decoding="async"
                className="absolute left-[55%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-auto object-contain pointer-events-none"
                aria-hidden
            />
            <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                            Narrator
                        </div>
                        <div className="h-px bg-white/30 mb-2" aria-hidden />
                        <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                            The wind is blowing hard. Leo requires your help in order to climb the mountain
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                        onClick={() => router.visit(route('mainplay.cloud2-game'))}
                        aria-label="Next"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Head title="Clouds 1 - The Gate of Gratitude" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* White overlay that fades out for "zap" transition from chapter3-intro */}
                {step === 1 && (
                    <div
                        className="absolute inset-0 bg-white pointer-events-none z-[105] fade-out-black"
                        style={{ animationDuration: '0.6s' }}
                        aria-hidden
                    />
                )}
                {step === 1 && step1}
                {step === 2 && step2}
                {step === 3 && step3}
                {step === 4 && step4}
            </div>
        </>
    );
}
