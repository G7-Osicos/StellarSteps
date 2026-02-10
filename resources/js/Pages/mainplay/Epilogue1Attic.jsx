import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const ATTIC1_BG = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic1.webp';
const ATTIC2_BG = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic2.webp';
const LEO3 = '/assets/img/Leo3.webp';
const LEO2 = '/assets/img/Leo2.webp';
const LEO2_LEFT = '/assets/img/Leo2-left.webp';
const FRAME18_LEO = '/assets/img/Frame 18-Leo.webp';

export default function Epilogue1Attic() {
    const { playBGM, stopBGM, playVoice, stopVoice } = useAudio() ?? {};
    const [step, setStep] = useState(1);
    const [showNarration, setShowNarration] = useState(false);
    const [step2Phase, setStep2Phase] = useState('leo2'); // 'leo2' | 'leo2left'

    useEffect(() => {
        if (AUDIO.epilogue1Attic?.bgm && playBGM) playBGM(AUDIO.epilogue1Attic.bgm);
        return () => stopBGM?.();
    }, [playBGM, stopBGM]);

    useEffect(() => {
        // Step 1: play Lola immediately (browsers block audio if delayed too long after user gesture)
        const idx = step === 1 ? 0 : step === 2 && step2Phase === 'leo2left' ? 1 : step === 3 ? 2 : null;
        const src = idx != null && AUDIO.epilogue1Attic?.voice ? AUDIO.epilogue1Attic.voice[idx] : null;
        if (src && playVoice) playVoice(src);
        else stopVoice?.();
    }, [step, step2Phase, playVoice, stopVoice]);

    useEffect(() => {
        if (step !== 1) return;
        const t = setTimeout(() => setShowNarration(true), 2000);
        return () => clearTimeout(t);
    }, [step]);

    useEffect(() => {
        if (step !== 2) return;
        const t = setTimeout(() => setStep2Phase('leo2left'), 1000);
        return () => clearTimeout(t);
    }, [step]);

    const leoSize = 'w-[min(42vw,450px)] h-auto object-contain object-bottom pointer-events-none';
    const leoPosition = 'absolute left-[6%] bottom-0 fade-in-soft';

    return (
        <>
            <Head title="Epilogue: Back in the Attic" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                <img
                    src={encodeURI(step === 3 ? ATTIC1_BG : ATTIC2_BG)}
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center fade-in-soft"
                />

                {/* Leo — step 1: Leo3, step 2: Leo2.webp then Leo2-left.webp */}
                {step === 1 && (
                    <img
                        src={LEO3}
                        alt=""
                        loading="eager"
                        decoding="async"
                        className={`${leoPosition} ${leoSize}`}
                    />
                )}
                {step === 2 && (
                    <img
                        src={step2Phase === 'leo2' ? LEO2 : LEO2_LEFT}
                        alt=""
                        loading="eager"
                        decoding="async"
                        className={`${leoPosition} ${leoSize}`}
                    />
                )}
                {step === 3 && (
                    <img
                        src={encodeURI(FRAME18_LEO)}
                        alt=""
                        loading="eager"
                        decoding="async"
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(35vw,360px)] h-auto object-contain object-bottom pointer-events-none fade-in-soft"
                    />
                )}

                {/* Step 1: Lola's narration — appears after 2 seconds, with Next */}
                {step === 1 && showNarration && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Lola
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    Leo! Dinner time! Did you wash your hands?
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); setStep(2); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Leo's narration — appears after Leo2 → Leo2-left transition, with Next */}
                {step === 2 && step2Phase === 'leo2left' && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Leo
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    Opo, Lola! I'm coming!
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); setStep(3); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Narrator's narration, with Next → stellarsteps-complete */}
                {step === 3 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Narrator
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    Leo climbs down the ladder. He is First Grader, though he is taller, a little, a little bolder... and a great deal more polite.
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); router.visit(route('mainplay.stellarsteps-complete')); }}
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
