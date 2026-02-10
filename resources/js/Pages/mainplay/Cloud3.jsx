import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const MOUNTAINS_BG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Mountains only.PNG';
const LEO_STEP1 = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Frame 18-Leo-right.webp';
   const MARKY_STEP1 = '/assets/img/Marky4.webp';
const LEO_STEP2 = '/assets/img/Leo2.webp';
const MARKY_STEP2 = '/assets/img/Marky2.webp';

export default function Cloud3() {
    const { playVoice, stopVoice, playBGM } = useAudio() ?? {};
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (AUDIO.bgm.chapter3StrongWind && playBGM) playBGM(AUDIO.bgm.chapter3StrongWind, true);
    }, [playBGM]);

    useEffect(() => {
        const src = AUDIO.cloud3?.voice?.[step - 1];
        const vol = AUDIO.cloud3?.voiceVolume?.[step - 1];
        if (src && playVoice) playVoice(src, vol);
        else stopVoice?.();
    }, [step, playVoice, stopVoice]);

    const isStep1 = step === 1;

    return (
        <>
            <Head title="Cloud 3 - The Crystal Door" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 fade-in-soft">
                <BackToMapButton />
                {/* Mountains background */}
                <img
                    src={encodeURI(MOUNTAINS_BG)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Leo - step 1 */}
                <img
                    src={encodeURI(LEO_STEP1)}
                    alt="Leo"
                    className={`absolute left-[28%] bottom-[4%] w-[min(36vw,300px)] h-auto object-contain object-bottom pointer-events-none ${isStep1 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Leo - step 2 (separate element preloads on mount, avoids flash of step 1 at wrong size) */}
                <img
                    src={encodeURI(LEO_STEP2)}
                    alt=""
                    className={`absolute left-[28%] bottom-[4%] w-[min(64vw,540px)] h-auto object-contain object-bottom pointer-events-none ${isStep1 ? 'hidden' : ''}`}
                    loading="eager"
                />

                {/* Marky - step 1 */}
                <img
                    src={encodeURI(MARKY_STEP1)}
                    alt="Marky"
                    className={`absolute right-[28%] bottom-[10%] w-[min(44vw,380px)] h-auto object-contain object-bottom pointer-events-none ${isStep1 ? '' : 'hidden'}`}
                    loading="eager"
                />

                {/* Marky - step 2 */}
                <img
                    src={encodeURI(MARKY_STEP2)}
                    alt=""
                    className={`absolute right-[28%] bottom-[10%] w-[min(44vw,380px)] h-auto object-contain object-bottom pointer-events-none ${isStep1 ? 'hidden' : ''}`}
                    loading="eager"
                />

                {/* Narration */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {isStep1 ? 'Leo' : 'Marky'}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {isStep1
                                    ? 'The Crystal Door! We made it, Marky! We have 2 Stars. All we want is to open the last one.'
                                    : 'Look! And there he is the last Star, and merged with the door!'}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                            onClick={() => { if (isStep1) { stopVoice?.(); setStep(2); } else { stopVoice?.(); router.visit(route('mainplay.cloud4')); } }}
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
