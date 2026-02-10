import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const FULL_BG_ZOOMED = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Full BG-zoomed.webp';
const DOOR_SLEEPING = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Default_Sleeping.PNG.webp';
const DOOR_STEP3 = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Left side eye.webp';
const DOOR_STEP4 = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Mad.PNG.webp';
const DOOR_STEP5 = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Talking.PNG.webp';
const LEO_STEP1_2 = '/assets/img/Leo2.webp';
const LEO_STEP3 = '/assets/img/LeoOH!.webp';
const LEO_STEP4 = '/assets/img/LeoCurious-right.webp';
const LEO_STEP6 = '/assets/img/LeoSad.webp';
const LEO_STEP8 = '/assets/img/Leo0.webp';
const MARKY_STEP7 = '/assets/img/Marky4.webp';
const MARKY_STEP8 = '/assets/img/Marky1.webp';
const MARKY_STEP9 = '/assets/img/Marky1-right.webp';

export default function Cloud4() {
    const { playVoice, stopVoice, playSFX, playAmbient, stopAmbient, playBGM } = useAudio() ?? {};
    const [step, setStep] = useState(1);

    // Strong wind mountains BGM from Cloud4 onwards
    useEffect(() => {
        if (AUDIO.bgm?.chapter3StrongWind && playBGM) playBGM(AUDIO.bgm.chapter3StrongWind, true);
    }, [playBGM]);

    useEffect(() => {
        if (AUDIO.cloud4?.sleepingStoneGuardian && playAmbient) playAmbient(AUDIO.cloud4.sleepingStoneGuardian);
        return () => stopAmbient?.();
    }, [playAmbient, stopAmbient]);

    // Stop sleeping ambient when "WHO IS SHOUTING?" appears (step 3); resume when "Oh no... I'm trapped forever" appears (step 6)
    useEffect(() => {
        if (step === 3) stopAmbient?.();
        else if (step === 6 && AUDIO.cloud4?.sleepingStoneGuardian && playAmbient) playAmbient(AUDIO.cloud4.sleepingStoneGuardian);
    }, [step, playAmbient, stopAmbient]);

    useEffect(() => {
        const src = AUDIO.cloud4?.voice?.[step - 1];
        if (step === 3 && AUDIO.cloud4?.stoneGuardianSfx && playSFX && playVoice && src) {
            // Step 3: play SFX first (starts earlier), then start voice so they play alongside each other
            playSFX(AUDIO.cloud4.stoneGuardianSfx);
            playVoice(src);
        } else if (step === 5 && src && playVoice && AUDIO.cloud4?.grumpyStoneGuardian) {
            // Step 5: play main voice (GATE2), then grumpy stone guardian at the end
            playVoice(src, 1, () => playVoice(AUDIO.cloud4.grumpyStoneGuardian));
        } else if (src && playVoice) {
            playVoice(src);
        } else {
            stopVoice?.();
        }
    }, [step, playVoice, stopVoice, playSFX]);

    const isStep3 = step === 3;
    const isStep4 = step === 4;
    const isStep5 = step === 5;
    const isStep6 = step === 6;
    const isStep7 = step === 7;
    const isStep8 = step === 8;
    const isStep9 = step === 9;
    const narration = step === 1
        ? 'Hey! Door! Open up! I want to go home now!'
        : step === 2
            ? 'I said OPEN UP!'
            : step === 3
                ? 'WHO IS SHOUTING? You are so noisy, little boy. Go away. I am sleeping.'
                : step === 4
                    ? 'But I have already written the other chapters! I cleaned the castle! I helped the Wolf! You have to let me out!'
                    : step === 5
                        ? 'Have to? I do not even need to do anything with rude children. The Gate of Gratitude remains closed up.'
                        : step === 6
                            ? 'Oh no... I\'m trapped forever. My magic didn\'t work.'
                            : step === 7
                                ? 'Leo, you don\'t need magic power. You need Word Power. You tell Lola something you want, remember?'
                                : step === 8
                                    ? 'Oh! I know what to do!'
                                    : 'The Stone Guardian is waiting. Leo must get him to wake up. What should he say?';
    const speaker = (isStep3 || isStep5) ? 'Stone Guardians' : isStep7 ? 'Marky' : isStep9 ? 'Narrator' : 'Leo';

    return (
        <>
            <Head title="Cloud 4 - The Crystal Door" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 fade-in-soft">
                <BackToMapButton />
                {/* Background */}
                <img
                    src={encodeURI(FULL_BG_ZOOMED)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Door - sleeping (steps 1, 2, 6, 7, 8 & 9) */}
                <img
                    src={encodeURI(DOOR_SLEEPING)}
                    alt=""
                    className={`absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(85vw,800px)] h-auto object-contain object-bottom pointer-events-none ${(step >= 3 && !isStep6 && !isStep7 && !isStep8 && !isStep9) ? 'hidden' : ''}`}
                    loading="eager"
                />

                {/* Door - step 5 (Talking) */}
                <img
                    src={encodeURI(DOOR_STEP5)}
                    alt=""
                    className={`absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(85vw,800px)] h-auto object-contain object-bottom pointer-events-none ${isStep5 && !isStep6 && !isStep7 && !isStep8 && !isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Door - step 3 (Left side eye) */}
                <img
                    src={encodeURI(DOOR_STEP3)}
                    alt=""
                    className={`absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(85vw,800px)] h-auto object-contain object-bottom pointer-events-none ${isStep3 && !isStep6 && !isStep7 && !isStep8 && !isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Door - step 4 (Mad) */}
                <img
                    src={encodeURI(DOOR_STEP4)}
                    alt=""
                    className={`absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(85vw,800px)] h-auto object-contain object-bottom pointer-events-none ${isStep4 && !isStep5 && !isStep6 && !isStep7 && !isStep8 && !isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Leo - steps 1 & 2 */}
                <img
                    src={encodeURI(LEO_STEP1_2)}
                    alt="Leo"
                    className={`absolute left-[8%] bottom-[2%] w-[min(54vw,460px)] h-auto object-contain object-bottom pointer-events-none ${step >= 3 ? 'hidden' : ''}`}
                    loading="eager"
                />

                {/* Leo - step 3 (LeoOH!) */}
                <img
                    src={encodeURI(LEO_STEP3)}
                    alt="Leo"
                    className={`absolute left-[8%] bottom-[2%] w-[min(54vw,460px)] h-auto object-contain object-bottom pointer-events-none ${isStep3 && !isStep6 && !isStep7 && !isStep8 && !isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Leo - steps 4 & 5 (LeoCurious) */}
                <img
                    src={encodeURI(LEO_STEP4)}
                    alt="Leo"
                    className={`absolute left-[8%] bottom-[2%] w-[min(54vw,460px)] h-auto object-contain object-bottom pointer-events-none ${(isStep4 || isStep5) && !isStep6 && !isStep7 && !isStep8 && !isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Leo - steps 6 & 7 (LeoSad) */}
                <img
                    src={encodeURI(LEO_STEP6)}
                    alt="Leo"
                    className={`absolute left-[8%] bottom-[2%] w-[min(54vw,460px)] h-auto object-contain object-bottom pointer-events-none ${(isStep6 || isStep7) && !isStep8 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Leo - steps 8 & 9 (Leo0) */}
                <img
                    src={encodeURI(LEO_STEP8)}
                    alt="Leo"
                    className={`absolute left-[8%] bottom-[2%] w-[min(54vw,460px)] h-auto object-contain object-bottom pointer-events-none ${isStep8 || isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Marky - step 7 (upper right corner) */}
                <img
                    src={encodeURI(MARKY_STEP7)}
                    alt="Marky"
                    className={`absolute right-[6%] top-[12%] w-[min(46vw,380px)] h-auto object-contain pointer-events-none ${isStep7 && !isStep8 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Marky - step 8 (Marky1) */}
                <img
                    src={encodeURI(MARKY_STEP8)}
                    alt="Marky"
                    className={`absolute right-[6%] top-[12%] w-[min(46vw,380px)] h-auto object-contain pointer-events-none ${isStep8 && !isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Marky - step 9 (Marky1-right) */}
                <img
                    src={encodeURI(MARKY_STEP9)}
                    alt="Marky"
                    className={`absolute right-[6%] top-[12%] w-[min(46vw,380px)] h-auto object-contain pointer-events-none ${isStep9 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Narration */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
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
                            onClick={() => { stopVoice?.(); step < 9 ? setStep(step + 1) : router.visit(route('mainplay.cloud5')); }}
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
