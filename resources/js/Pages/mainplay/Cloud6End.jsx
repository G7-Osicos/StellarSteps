import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const FULL_BG_ZOOMED = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Full BG-zoomed.webp';
const LEO_LOOKING_RIGHT = '/assets/img/Leo looking-right.webp';
const LEO_C1F10 = '/assets/img/C1F10-LEO.webp';
const LEO_FRAME18 = '/assets/img/Frame 18-Leo.webp';
const MARKY_1 = '/assets/img/Marky1.webp';
const MARKY_4_RIGHT = '/assets/img/whisperingwoods/Marky4-right.webp';

export default function Cloud6End() {
    const { playVoice, stopVoice } = useAudio() ?? {};
    const [step, setStep] = useState(0);
    const [zapping, setZapping] = useState(false);

    useEffect(() => {
        const src = AUDIO.cloud6End?.voice?.[step];
        if (src && playVoice) playVoice(src);
        else stopVoice?.();
    }, [step, playVoice, stopVoice]);

    useEffect(() => {
        if (step !== 0) return;
        const t = setTimeout(() => setStep(1), 2000);
        return () => clearTimeout(t);
    }, [step]);

    useEffect(() => {
        if (!zapping) return;
        const t = setTimeout(() => router.visit(route('mainplay.gateofgratitude-complete')), 400);
        return () => clearTimeout(t);
    }, [zapping]);

    return (
        <>
            <Head title="Cloud 6 End - One Last Thing" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 fade-in-soft">
                <BackToMapButton />
                {zapping && <div className="absolute inset-0 bg-white z-[200]" aria-hidden />}
                {/* Background — same as Cloud6 */}
                <img
                    src={encodeURI(FULL_BG_ZOOMED)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Leo — right side. Step 0: looking-right, Step 1: C1F10, Step 2–3: Frame 18 */}
                <img
                    src={encodeURI(step === 0 ? LEO_LOOKING_RIGHT : step === 1 ? LEO_C1F10 : LEO_FRAME18)}
                    alt="Leo"
                    className={`absolute ${step === 2 || step === 3 ? 'right-[10%]' : 'right-[6%]'} bottom-[2%] h-auto object-contain object-bottom pointer-events-none`}
                    style={{ width: step === 0 ? 'min(56vw, 480px)' : step === 1 ? 'min(54vw, 460px)' : 'min(30vw, 260px)' }}
                    loading="eager"
                />

                {/* Marky — step 2–3 only */}
                {(step === 2 || step === 3) && (
                    <img
                        src={encodeURI(step === 2 ? MARKY_1 : MARKY_4_RIGHT)}
                        alt="Marky"
                        className="absolute left-[6%] top-[12%] h-auto object-contain pointer-events-none"
                        style={{ width: 'min(58vw, 480px)' }}
                        loading="eager"
                    />
                )}

                {/* Narration — step 1: Leo "Wait...", step 2: Leo "Thank you...", step 3: Marky "You are welcome..." */}
                {(step === 1 || step === 2 || step === 3) && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-yellow-400 mb-2">
                                    {step === 3 ? 'Marky' : 'Leo'}
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    {step === 1
                                        ? 'Wait. I have to say one last thing.'
                                        : step === 2
                                            ? 'Thank you. Thank you for helping me.'
                                            : 'You are welcome, Hero. Goodbye, Leo!'}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => { stopVoice?.(); step === 3 ? setZapping(true) : setStep(step + 1); }}
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
