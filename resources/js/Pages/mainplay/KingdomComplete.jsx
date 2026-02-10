import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

export default function KingdomComplete() {
    const { stopBGM, playVoice, stopVoice, playSFX } = useAudio() ?? {};
    const [step, setStep] = useState(0);
    const [starSpinning, setStarSpinning] = useState(false);

    useEffect(() => {
        stopBGM?.();
    }, [stopBGM]);

    useEffect(() => {
        const src = AUDIO.kingdomComplete?.voice?.[step];
        if (src && playVoice) playVoice(src);
        return () => stopVoice?.();
    }, [step, playVoice, stopVoice]);

    useEffect(() => {
        if (step !== 1) return;
        const t = setTimeout(() => setStep(2), 5500); // After star fade (5s) + small delay
        return () => clearTimeout(t);
    }, [step]);

    return (
        <>
            <Head title="Chapter 1: Kingdom Complete" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-white">
                <BackToMapButton />
                {/* Leo on the left */}
                <img
                    src="/assets/img/Leo0.webp"
                    alt="Leo"
                    loading="eager"
                    decoding="async"
                    className="absolute left-[2%] bottom-[2%] w-[640px] h-auto object-contain select-none pointer-events-none"
                />
                {/* Marky on the right - Marky2-left when step 2 or 4 */}
                <img
                    src={(step === 2 || step === 4) ? '/assets/img/Marky2-left.webp' : '/assets/img/Marky1.webp'}
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className={`absolute bottom-[18%] h-auto object-contain select-none pointer-events-none fade-in-soft ${(step === 2 || step === 4) ? 'w-[420px] right-[10%]' : 'w-[520px] right-[2%]'}`}
                />

                {/* Shining star in the middle (step 1, 2, 3) - clickable on step 2 */}
                {step >= 1 && (
                    <div
                        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[min(40vw,400px)] flex justify-center items-center"
                        role={step === 2 ? 'button' : undefined}
                        tabIndex={step === 2 ? 0 : undefined}
                        onClick={step === 2 ? () => { playSFX?.(AUDIO.sfx.starClick); setStarSpinning(true); setStep(3); } : undefined}
                        onKeyDown={step === 2 ? (e) => { if (e.key === 'Enter') { playSFX?.(AUDIO.sfx.starClick); setStarSpinning(true); setStep(3); } } : undefined}
                    >
                        <div className={starSpinning ? 'star-spin' : ''}>
                            <img
                                src="/assets/img/Star.webp"
                                alt="Star"
                                loading="eager"
                                decoding="async"
                                className={`w-full h-auto object-contain star-fade-in ${step === 2 ? 'cursor-pointer transition-transform duration-300 hover:scale-110 hover:brightness-110' : 'pointer-events-none'}`}
                            />
                        </div>
                    </div>
                )}

                {/* Narration bar (step 0, 2, 3, 4) */}
                {(step === 0 || step === 2 || step === 3 || step === 4) && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                    {step === 3 ? 'LEO' : 'MARKY'}
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    {step === 0 && 'You did it, Leo! You fixed the story! And look!'}
                                    {step === 2 && 'Tap that Star to get it!'}
                                    {step === 3 && 'Yes! We got the Star of Order! One step closer to going home.'}
                                    {step === 4 && 'Great job! But rejoice not, yet... the book comes round again! Hold on tight!'}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => {
                                    stopVoice?.();
                                    if (step === 0) setStep(1);
                                    else if (step === 3) setStep(4);
                                    else if (step === 4) router.visit(route('mainplay.kingdom-complete-star'));
                                    else setStep(step);
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
