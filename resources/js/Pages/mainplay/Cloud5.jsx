import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const FULL_BG_ZOOMED = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Full BG-zoomed.webp';
const DOOR_SLEEPING = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Default_Sleeping.PNG.webp';
const DOOR_STEP4 = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/IMG_9241.PNG.webp';
const DOOR_STEP9 = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/IMG_9243.PNG.webp';
const DOOR_STEP10 = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Stone opens.webp';
const LEO_STEP1 = '/assets/img/Leo0.webp';
   const LEO_STEP2 = '/assets/img/LeoCurious-right.webp';
   const LEO_STEP3 = '/assets/img/LeoOH!.webp';
   const LEO_STEP4 = '/assets/img/Leo0.webp';
   const MARKY_STEP1 = '/assets/img/Marky1-right.webp';
   const MARKY_STEP2 = '/assets/img/Marky3.webp';
   const MARKY_STEP4 = '/assets/img/Marky1-right.webp';
   const MARKY_STEP10 = '/assets/img/Marky2-left.webp';
   const MARKY_STEP11 = '/assets/img/Marky4.webp';
   const MARKY_STEP12 = '/assets/img/Marky2-left.webp';
const PO_OVERLAY = '/assets/img/po-overlay.webp';
const STAR_IMG = '/assets/img/Star.webp';

const CHOICE_A = 'Hey! Wake up!';
const CHOICE_B = 'Excuse me, po, Mr. Guardian? May I speak with you?';
const CHOICE_A_STEP6 = 'Open this right now!';
const CHOICE_B_STEP6 = 'I ask you to open the door, po.';

function shuffleChoices(incorrect, correct) {
    return Math.random() < 0.5 ? [incorrect, correct] : [correct, incorrect];
}

export default function Cloud5() {
    const { playVoice, stopVoice, playSFX } = useAudio() ?? {};
    const [step, setStep] = useState(1);
    const [showStar, setShowStar] = useState(false);
    const [starClicked, setStarClicked] = useState(false);
    const [step11VoiceDone, setStep11VoiceDone] = useState(false);
    const step11PlayedRef = useRef(false);
    const choicesStep2Ref = useRef(null);
    const choicesStep6Ref = useRef(null);

    const handleChoice = (isCorrect) => {
        stopVoice?.();
        if (!isCorrect && AUDIO.sfx?.incorrect && playSFX) playSFX(AUDIO.sfx.incorrect);
        if (isCorrect) {
            if (AUDIO.sfx?.correct && playSFX) playSFX(AUDIO.sfx.correct);
            setStep(3);
        }
    };

    const handleChoiceStep6 = (isCorrect) => {
        stopVoice?.();
        if (!isCorrect && AUDIO.sfx?.incorrect && playSFX) playSFX(AUDIO.sfx.incorrect);
        if (isCorrect) {
            if (AUDIO.sfx?.correct && playSFX) playSFX(AUDIO.sfx.correct);
            setStep(7);
        }
    };

    // Dedicated effect for step 11 (Marky) — isolated so step 10's stopVoice never interferes
    useEffect(() => {
        if (step !== 11) {
            step11PlayedRef.current = false;
            return;
        }
        setStep11VoiceDone(false);
        const src = AUDIO.cloud5?.voice?.[10];
        if (!src || !playVoice) {
            setStep11VoiceDone(true);
            return;
        }
        if (step11PlayedRef.current) return;
        step11PlayedRef.current = true;
        playVoice(src, 1, () => setStep11VoiceDone(true));
        // Fallback: enable Next after 12s if voice fails/errors (onEnded never fires)
        const fallback = setTimeout(() => setStep11VoiceDone(true), 12000);
        return () => clearTimeout(fallback);
    }, [step, playVoice]);

    useEffect(() => {
        const src = AUDIO.cloud5?.voice?.[step - 1];
        if (step === 4 && AUDIO.cloud5?.happyStoneGuardianStep4 && src && playVoice && playSFX) {
            // Step 4: play Happy Stone Guardian and narration (GATE3) together
            playSFX(AUDIO.cloud5.happyStoneGuardianStep4);
            playVoice(src);
        } else if (step === 11) {
            // Step 11 handled by dedicated effect above — do not stopVoice
        } else if (src && playVoice) {
            playVoice(src);
        } else if (step !== 12 && step !== 10) {
            stopVoice?.();
        }
        if (step === 9 && AUDIO.cloud5?.stoneGuardianCracks && playSFX) playSFX(AUDIO.cloud5.stoneGuardianCracks);
    }, [step, playVoice, stopVoice, playSFX]);

    useEffect(() => {
        if (step === 9) {
            const t = setTimeout(() => setStep(10), 1000);
            return () => clearTimeout(t);
        }
        if (step === 10) {
            const t = setTimeout(() => setStep(11), 1000);
            return () => clearTimeout(t);
        }
    }, [step]);

    useEffect(() => {
        if (step !== 2) choicesStep2Ref.current = null;
        if (step !== 6) choicesStep6Ref.current = null;
    }, [step]);

    useEffect(() => {
        if (step !== 12) return;
        const t = setTimeout(() => setShowStar(true), 1000);
        return () => clearTimeout(t);
    }, [step]);

    useEffect(() => {
        if (!starClicked) return;
        const t = setTimeout(() => router.visit(route('mainplay.cloud6')), 800);
        return () => clearTimeout(t);
    }, [starClicked]);

    return (
        <>
            <Head title="Cloud 5 - Select the polite response" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 fade-in-soft">
                <BackToMapButton />
                {/* Background */}
                <img
                    src={encodeURI(FULL_BG_ZOOMED)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Door - Stone Guardian */}
                <img
                    src={encodeURI(step === 9 ? DOOR_STEP9 : step === 10 || step === 11 || step === 12 ? DOOR_STEP10 : step === 4 || step === 5 || step === 8 ? DOOR_STEP4 : DOOR_SLEEPING)}
                    alt="Stone Guardian"
                    className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(85vw,800px)] h-auto object-contain object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Leo */}
                <img
                    src={encodeURI(step === 1 ? LEO_STEP1 : step === 2 ? LEO_STEP2 : step === 3 ? LEO_STEP3 : step === 4 ? LEO_STEP4 : step === 5 ? LEO_STEP1 : step === 6 ? LEO_STEP2 : step === 7 ? LEO_STEP3 : step === 8 ? LEO_STEP4 : step === 12 ? LEO_STEP1 : step === 9 || step === 10 || step === 11 ? LEO_STEP3 : LEO_STEP3)}
                    alt="Leo"
                    className="absolute left-[8%] bottom-[2%] w-[min(54vw,460px)] h-auto object-contain object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Po! speech bubble on top of Leo — step 3 and step 7 */}
                {(step === 3 || step === 7) && (
                    <img
                        src={PO_OVERLAY}
                        alt=""
                        className="absolute left-[10%] bottom-[26%] w-[min(64vw,400px)] h-auto object-contain object-bottom pointer-events-none z-[60]"
                        loading="eager"
                        aria-hidden
                    />
                )}

                {/* Marky */}
                <img
                    src={encodeURI(step === 1 ? MARKY_STEP1 : step === 2 ? MARKY_STEP2 : step === 4 ? MARKY_STEP4 : step === 5 ? MARKY_STEP1 : step === 6 ? MARKY_STEP2 : step === 7 ? MARKY_STEP2 : step === 8 ? MARKY_STEP4 : step === 9 ? MARKY_STEP2 : step === 10 ? MARKY_STEP10 : step === 11 ? MARKY_STEP11 : step === 12 ? MARKY_STEP12 : MARKY_STEP2)}
                    alt="Marky"
                    className="absolute right-[6%] top-[12%] w-[min(46vw,380px)] h-auto object-contain pointer-events-none"
                    loading="eager"
                />

                {/* Black overlay — step 1 and step 5 (not step 6) */}
                {(step === 1 || step === 5) && (
                    <div className="absolute inset-0 z-50 bg-black/60 pointer-events-none" aria-hidden />
                )}

                {/* Step 1: Direction - orange highlighted */}
                {step === 1 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/80 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border-2 border-orange-400 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    <span className="text-orange-400 font-bold">Direction: Select the polite response!</span>
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

                {/* Step 2: Pop-up questions — overlay with darkened background, centered and larger */}
                {step === 2 && (() => {
                    if (!choicesStep2Ref.current) {
                        choicesStep2Ref.current = shuffleChoices(
                            { text: CHOICE_A, isCorrect: false },
                            { text: CHOICE_B, isCorrect: true }
                        );
                    }
                    const choices = choicesStep2Ref.current;
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

                {/* Step 3: Leo's narration */}
                {step === 3 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Leo
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    Excuse me, po, Mr. Guardian? May I speak with you?
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
                )}

                {/* Step 4: Stone Guardians narration */}
                {step === 4 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Stone Guardians
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    Oh? That sounds much better. You used &apos;Po&apos;. You are a respectful child. What do you need?
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); setStep(5); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Direction — same content as step 1 */}
                {step === 5 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/80 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border-2 border-orange-400 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    <span className="text-orange-400 font-bold">Direction: Have the Guardian open the door!</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); setStep(6); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 6: Pop-up questions — overlay with darkened background, centered and larger */}
                {step === 6 && (() => {
                    if (!choicesStep6Ref.current) {
                        choicesStep6Ref.current = shuffleChoices(
                            { text: CHOICE_A_STEP6, isCorrect: false },
                            { text: CHOICE_B_STEP6, isCorrect: true }
                        );
                    }
                    const choices = choicesStep6Ref.current;
                    return (
                        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 sm:p-6">
                            <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-xl">
                                <button
                                    type="button"
                                    className="rounded-2xl bg-gray-800/95 text-white px-6 py-5 sm:px-8 sm:py-6 text-left text-base sm:text-lg border border-white/30 hover:bg-gray-700/95 transition-colors cartoon-thin"
                                    onClick={() => handleChoiceStep6(choices[0].isCorrect)}
                                >
                                    Choice A: {choices[0].text}
                                </button>
                                <button
                                    type="button"
                                    className="rounded-2xl bg-gray-800/95 text-white px-6 py-5 sm:px-8 sm:py-6 text-left text-base sm:text-lg border border-white/30 hover:bg-gray-700/95 transition-colors cartoon-thin"
                                    onClick={() => handleChoiceStep6(choices[1].isCorrect)}
                                >
                                    Choice B: {choices[1].text}
                                </button>
                            </div>
                        </div>
                    );
                })()}

                {/* Step 7: Leo's narration — same content as step 3, different text */}
                {step === 7 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Leo
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    Please open the door, po. I really miss my family.
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); setStep(8); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 8: Stone Guardians narration — same content as step 4, different text */}
                {step === 8 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Stone Guardians
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    Hmm. You are brave and polite. Very well. The Gate of Gratitude does not open to those who do not know how to ask nicely.
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); setStep(9); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 9: Door opening scene — auto-transitions to step 10 after 1s */}

                {/* Step 10: Stone fully open — auto-transitions to step 11 after 1s */}

                {/* Step 11: Marky's narration */}
                {step === 11 && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    Marky
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    You did it, Leo! You used the Magic Words!
                                </div>
                            </div>
                            <button
                                type="button"
                                disabled={!step11VoiceDone}
                                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${step11VoiceDone ? 'border-yellow-400 bg-yellow-300 hover:bg-yellow-200 cursor-pointer' : 'border-yellow-400/50 bg-yellow-300/50 cursor-not-allowed opacity-70'}`}
                                onClick={() => { if (step11VoiceDone) setStep(12); }}
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 12: Final Star — tap to go home */}
                {step === 12 && (
                    <>
                        {/* Star — appears at top 1 second after step 12 */}
                        {showStar && (
                            <div
                                className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[min(40vw,400px)] flex justify-center items-center z-[60]"
                                role="button"
                                tabIndex={0}
                                onClick={() => { if (!starClicked) { playSFX?.(AUDIO.sfx.starClick); setStarClicked(true); } }}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !starClicked) { playSFX?.(AUDIO.sfx.starClick); setStarClicked(true); } }}
                            >
                                <div className={starClicked ? 'star-spin' : ''}>
                                    <img
                                        src={STAR_IMG}
                                        alt="Final Star"
                                        loading="eager"
                                        className="w-full h-auto object-contain star-fade-in cursor-pointer transition-transform duration-300 hover:scale-110 hover:brightness-110"
                                    />
                                </div>
                            </div>
                        )}
                        {/* Narration bar — no Next button */}
                        <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                            <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20">
                                <div className="flex-1 min-w-0">
                                    <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                        Instruction
                                    </div>
                                    <div className="h-px bg-white/30 mb-2" aria-hidden />
                                    <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                        Tap the Final Star to go home!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
