import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

export default function PrologueEnd() {
    const { playVoice, stopVoice, stopBGM } = useAudio() ?? {};
    // 0: Leo only
    // 1: Leo + Marky (welcome)
    // 2: Leo curious right
    // 3: Marky pose change + stars + long explanation
    // 4: Marky back to Marky1 - "And look! You were able to clean the cover!"
    // 5: Marky1 - "Are you ready to do your first mission Leo? Help on the Kingdom of Clutter is needed!"
    // 6: Leo2.webp - "I'm ready. Let's go!"
    const [step, setStep] = useState(0);
    const narration =
        step === 0
            ? 'Where am I? Is this... inside of the book?'
            : step === 1
                ? 'Welcome, Traveler! We have been waiting for you.'
                : step === 2
                    ? "Waiting for me? But I'm just Leo, I'm in the first grade."
                    : step === 3
                        ? 'Exactly! It is only a First Grader who can correct our tales. The pages are dishevelled and the endings are lost. We must have a hero to assist us to locate the Stars of Goodness.'
                        : step === 4
                            ? 'And look! You were able to clean the cover!'
                            : step === 5
                                ? 'Are you ready to do your first mission Leo? Help on the Kingdom of Clutter is needed!'
                                : "I'm ready. Let's go!";
    
    const speaker = step === 0 || step === 2 || step === 6 ? 'LEO' : 'MARKY';

    useEffect(() => {
        stopBGM?.();
    }, [stopBGM]);

    useEffect(() => {
        const src = AUDIO.prologueEnd?.voice?.[step];
        if (src && playVoice) playVoice(src);
    }, [step, playVoice]);

    return (
        <>
            <Head title="Prologue – End" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-white">
                <BackToMapButton />
                {/* Leo on the left, Marky on the right – narration UI unchanged (handled elsewhere) */}
                {step >= 6 ? (
                    <img
                        src="/assets/img/Leo2.webp"
                        alt="Leo ready"
                        loading="eager"
                        decoding="async"
                        className="absolute left-[2%] bottom-[2%] w-[640px] h-auto object-contain select-none pointer-events-none"
                    />
                ) : step < 2 ? (
                    <img
                        src="/assets/img/Leo1.webp"
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute left-[2%] bottom-[2%] w-[640px] h-auto object-contain select-none pointer-events-none"
                    />
                ) : (
                    <img
                        src="/assets/img/LeoCurious-right.webp"
                        alt="Leo thinking"
                        loading="eager"
                        decoding="async"
                        className="absolute left-[2%] bottom-[2%] w-[640px] h-auto object-contain select-none pointer-events-none"
                    />
                )}
                {step >= 1 && (
                    <img
                        src={step === 3 ? '/assets/img/Marky2-left.webp' : '/assets/img/Marky1.webp'}
                        alt="Marky"
                        loading="eager"
                        decoding="async"
                        className="absolute right-[2%] bottom-[18%] w-[520px] h-auto object-contain select-none pointer-events-none fade-in-soft"
                    />
                )}

                {/* Three gray stars at the very top for the Stars of Goodness moment - only show in steps 3 and 4 */}
                {step >= 3 && step < 5 && (
                    <div className="absolute left-1/2 top-[4%] -translate-x-1/2 flex gap-8">
                        <img
                            src="/assets/img/Graystar.webp"
                            alt="Star of Goodness"
                            className="w-[200px] h-[200px] object-contain select-none pointer-events-none drop-shadow-xl"
                        />
                        <img
                            src="/assets/img/Graystar.webp"
                            alt="Star of Goodness"
                            className="w-[240px] h-[240px] object-contain select-none pointer-events-none drop-shadow-xl"
                        />
                        <img
                            src="/assets/img/Graystar.webp"
                            alt="Star of Goodness"
                            className="w-[200px] h-[200px] object-contain select-none pointer-events-none drop-shadow-xl"
                        />
                    </div>
                )}

                {/* Narration bar – same style as other scenes */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {speaker}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {narration}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
onClick={() => {
                                    if (step < 6) {
                                        stopVoice?.();
                                        setStep((s) => s + 1);
                                    } else {
                                        router.visit(route('mainplay', { prologue_castle_hint: 1 }));
                                    }
                                }}
                            aria-label={step >= 6 ? "Let's go!" : 'Next'}
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

