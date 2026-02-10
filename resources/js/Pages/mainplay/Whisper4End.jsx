import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

export default function Whisper4End() {
    const { playVoice, stopVoice } = useAudio() ?? {};
    const [step, setStep] = useState(0);
    const [showStar, setShowStar] = useState(false);

    useEffect(() => {
        if (step !== 5) return;
        const t1 = setTimeout(() => setShowStar(true), 1000);
        const t2 = setTimeout(() => router.visit(route('mainplay.whisper4-endstar')), 6000); // 1s star appear + 5s fade-in
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [step]);

    useEffect(() => {
        const src = AUDIO.whisper4End?.voice?.[step];
        if (src && playVoice) playVoice(src);
        return () => stopVoice?.();
    }, [step, playVoice, stopVoice]);

    return (
        <>
            <Head title="Whisper 4 End - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background – forest bg-#2 (step 0) or bg-#2invert (step 1+) */}
                <img
                    src={step === 0 ? '/assets/img/whisperingwoods/bg-%232.webp' : '/assets/img/whisperingwoods/bg-%232invert.webp'}
                    alt="Whispering Woods"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                    aria-hidden
                />

                {/* Marky – step 0–1,3 (Marky1), step 2,4,5 (Marky4-right) */}
                {(step === 0 || step === 1 || step === 2 || step === 3 || step === 4 || step === 5) && (
                    <img
                        src={step === 2 || step === 4 || step === 5 ? '/assets/img/whisperingwoods/Marky4-right.webp' : '/assets/img/Marky1.webp'}
                        alt="Marky"
                        loading="eager"
                        decoding="async"
                        className="absolute bottom-[4%] left-[22%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[30] fade-in-soft"
                        aria-hidden
                    />
                )}

                {/* Leo – step 0 (LeoOH!), step 1,3 (Leo happy), step 2,4 (Leo thankful-right), step 5 (Leo Shivering-right) */}
                {(step === 0 || step === 1 || step === 2 || step === 3 || step === 4 || step === 5) && (
                    <img
                        src={step === 0 ? '/assets/img/LeoOH!.webp' : step === 1 || step === 3 ? '/assets/img/whisperingwoods/Leo%20happy.webp' : step === 2 || step === 4 ? '/assets/img/whisperingwoods/Leo%20thankful-right.webp' : '/assets/img/whisperingwoods/Leo%20Shivering-right.webp'}
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute bottom-[4%] left-[32%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[35] fade-in-soft"
                        aria-hidden
                    />
                )}

                {/* Wolf – step 0 (Scared), step 1-4 (happy), step 5 (wolf_emotions-#5) */}
                {(step === 0 || step === 1 || step === 2 || step === 3 || step === 4 || step === 5) && (
                    <img
                        src={step === 0 ? '/assets/img/whisperingwoods/wolf_emotions-%234-Scared.webp' : step === 5 ? '/assets/img/whisperingwoods/wolf_emotions-%235.webp' : '/assets/img/whisperingwoods/wolf_emotions-%233-happy.webp'}
                        alt="Wolf"
                        loading="eager"
                        decoding="async"
                        className={`absolute right-[8%] h-auto object-contain object-bottom pointer-events-none z-[40] ${step === 5 ? 'w-[min(75vmin,85vw,980px)]' : 'w-[min(85vmin,95vw,1100px)]'} fade-in-soft ${step === 5 ? 'bottom-[-8%]' : step >= 1 ? 'bottom-[-14%]' : 'bottom-[-2%]'}`}
                        aria-hidden
                    />
                )}

                {/* Star – appears at top 1 second after step 5, then auto-transitions to whisper4-endstar */}
                {showStar && step === 5 && (
                    <img
                        src="/assets/img/Star.webp"
                        alt=""
                        loading="eager"
                        decoding="async"
                        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[min(32vmin,260px)] h-auto object-contain pointer-events-none z-[60] star-fade-in"
                        aria-hidden
                    />
                )}

                {/* Narration bar – step 0 (Narrator), step 1,3,5 (Wolf), step 2 (Leo), step 4 (Marky) - no Next in step 5 */}
                {(step === 0 || step === 1 || step === 2 || step === 3 || step === 4 || step === 5) && (
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {step === 0 ? 'NARRATOR' : step === 1 || step === 3 || step === 5 ? 'WOLF' : step === 2 ? 'LEO' : 'MARKY'}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {step === 0
                                    ? "The Wolf stands up. He doesn't look scary anymore. He is shaking his tail like a doggy pup."
                                    : step === 1
                                      ? "Thank you! Thank you, kind boy! The pain is gone!"
                                      : step === 2
                                        ? "You're welcome! You aren't scary at all. You know, you are pretty fluffy."
                                        : step === 3
                                          ? "I only growled, as I was sore. Only you cared to come and ask me how I was doing. You have a very kind heart."
                                          : step === 4
                                            ? "Leo showed Empathy. That means understanding how others feel!"
                                            : "Please, take this. I had it stuck in my fur, but I believe it is yours."}
                            </div>
                        </div>
                        {(step === 0 || step === 1 || step === 2 || step === 3 || step === 4) && (
                            <button
                                type="button"
                                onClick={() => { stopVoice?.(); setStep(step + 1); }}
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors cursor-pointer"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                )}
            </div>
        </>
    );
}
