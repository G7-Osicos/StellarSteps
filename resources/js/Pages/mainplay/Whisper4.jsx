import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const CHOICE_A = 'Go away, scary Wolf!';
const CHOICE_B = 'Are you okay? Can I help you?';

function shuffleChoices(incorrect, correct) {
    return Math.random() < 0.5 ? [incorrect, correct] : [correct, incorrect];
}

export default function Whisper4() {
    const { playVoice, stopVoice, playSFX } = useAudio() ?? {};
    const [step, setStep] = useState(0);
    const choicesRef = useRef(null);

    useEffect(() => {
        const src = AUDIO.whisper4?.voice?.[step];
        if (src && playVoice) playVoice(src);
        return () => stopVoice?.();
    }, [step, playVoice, stopVoice]);

    useEffect(() => {
        if (step !== 1) choicesRef.current = null;
    }, [step]);

    const handleChoice = (isCorrect) => {
        stopVoice?.();
        if (!isCorrect && AUDIO.sfx?.incorrect && playSFX) playSFX(AUDIO.sfx.incorrect);
        if (isCorrect) {
            if (AUDIO.sfx?.correct && playSFX) playSFX(AUDIO.sfx.correct);
            setStep(2);
        }
    };

    return (
        <>
            <Head title="Whisper 4 - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background – misty forest zoomed */}
                <img
                    src="/assets/img/whisperingwoods/bg-%232zoom.webp"
                    alt="Whispering Woods"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                />

                {/* Leo – curious, leftmost (step 1 only) */}
                {step === 1 && (
                <img
                    src="/assets/img/LeoCurious-right.webp"
                    alt="Leo"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-0 w-[min(65vmin,72vw,750px)] h-auto object-contain object-bottom pointer-events-none z-[30]"
                    aria-hidden
                />
                )}

                {/* Marky + Leo Shivering (step 3 – after Choice B) */}
                {step === 2 && (
                <>
                    <img
                        src="/assets/img/whisperingwoods/Marky3-right.webp"
                        alt="Marky"
                        loading="eager"
                        decoding="async"
                        className="absolute bottom-[4%] left-[22%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[30]"
                        aria-hidden
                    />
                    <img
                        src="/assets/img/whisperingwoods/Leo%20Shivering-right.webp"
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute bottom-[4%] left-[32%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[35]"
                        aria-hidden
                    />
                </>
                )}

                {/* Step 5: Marky1, LeoOH!, Wolf emotion suprise after help */}
                {step === 4 && (
                <>
                    <img
                        src="/assets/img/Marky1.webp"
                        alt="Marky"
                        loading="eager"
                        decoding="async"
                        className="absolute bottom-[4%] left-[22%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[30]"
                        aria-hidden
                    />
                    <img
                        src="/assets/img/LeoOH!.webp"
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute bottom-[4%] left-[32%] w-[min(54vmin,62vw,680px)] h-auto object-contain object-bottom pointer-events-none z-[35]"
                        aria-hidden
                    />
                    <img
                        src="/assets/img/whisperingwoods/Wolf%20emotion%20suprise%20after%20help.webp"
                        alt="Wolf surprised after help"
                        loading="eager"
                        decoding="async"
                        className="absolute bottom-[8%] right-[-1%] h-auto object-contain object-bottom pointer-events-none z-[40] w-[min(75vmin,85vw,950px)]"
                        aria-hidden
                    />
                </>
                )}

                {/* Wolf – injured with thorn (center in steps 0–1 and 4, right in step 3; hidden in step 5) */}
                {step !== 4 && (
                <img
                    src="/assets/img/whisperingwoods/wolf%20emotion%20thorn%20orig.webp"
                    alt="Wolf with thorn"
                    loading="eager"
                    decoding="async"
                    className={`absolute bottom-[18%] h-auto object-contain object-bottom pointer-events-none z-[40] w-[min(75vmin,85vw,950px)] ${
                        step === 2 ? 'right-[-1%]' : 'left-1/2 -translate-x-1/2'
                    }`}
                    aria-hidden
                />
                )}

                {/* Narration bar – same as Whisper3 */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {step === 0 ? 'NARRATOR' : step === 1 ? 'MARKY' : step === 2 ? 'LEO' : step === 3 ? 'WOLF' : 'LEO'}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {step === 0
                                    ? 'The Wolf is in pain. Leo wants to escape, yet he recalls that heroes are the ones who save people. What should Leo do?'
                                    : step === 1
                                      ? "He isn't a monster, Leo. He is hurt. But he is a wolf... is that bold enough to approach him?"
                                      : step === 2
                                        ? "I'm not scared. Are you okay, Mr. Wolf? Can I help you?"
                                        : step === 3
                                          ? "You... you will help me? But I have big teeth! Aren't you afraid?"
                                          : "My Lola says even large animals need assistance occasionally."}
                            </div>
                        </div>
                        {step === 0 ? (
                            <button
                                type="button"
                                onClick={() => { stopVoice?.(); setStep(1); }}
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : step === 2 ? (
                            <button
                                type="button"
                                onClick={() => { stopVoice?.(); setStep(3); }}
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : step === 3 ? (
                            <button
                                type="button"
                                onClick={() => { stopVoice?.(); setStep(4); }}
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : step === 4 ? (
                            <button
                                type="button"
                                onClick={() => { stopVoice?.(); router.visit(route('mainplay.whisper4-game')); }}
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Step 1: Choice pop-up — overlay with darkened background, centered (same as Gate of Gratitude) */}
                {step === 1 && (() => {
                    if (!choicesRef.current) {
                        choicesRef.current = shuffleChoices(
                            { text: CHOICE_A, isCorrect: false },
                            { text: CHOICE_B, isCorrect: true }
                        );
                    }
                    const choices = choicesRef.current;
                    return (
                        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 sm:p-6">
                            <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-xl">
                                <button
                                    type="button"
                                    className="rounded-2xl bg-gray-800/95 text-white px-6 py-5 sm:px-8 sm:py-6 text-left text-base sm:text-lg border border-white/30 hover:bg-gray-700/95 transition-colors cartoon-thin"
                                    onClick={() => handleChoice(choices[0].isCorrect)}
                                >
                                    Choice A: {choices[0].text}
                                </button>
                                <button
                                    type="button"
                                    className="rounded-2xl bg-gray-800/95 text-white px-6 py-5 sm:px-8 sm:py-6 text-left text-base sm:text-lg border border-white/30 hover:bg-gray-700/95 transition-colors cartoon-thin"
                                    onClick={() => handleChoice(choices[1].isCorrect)}
                                >
                                    Choice B: {choices[1].text}
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </>
    );
}
