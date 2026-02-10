import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const SFX_WOOD_CREAK = '/assets/audio/whisper/wood creak(1).mp3';
const SFX_WOLF_HOWL = '/assets/audio/whisper/dragon-studio-wolf-howl-359873.mp3';
const SFX_GROWL = '/assets/audio/whisper/Growling.mp3';
const SFX_CRYING_DOG = '/assets/audio/whisper/Crying dog.mp3';

export default function Whisper3() {
    const [step, setStep] = useState(0); // 0–6 = prior steps, 7 = Wolf speaks
    const [step0CreakDone, setStep0CreakDone] = useState(false); // for step 0: show Leo line only after wood creak
    const [step3CryingDone, setStep3CryingDone] = useState(false); // for step 3: show MARKY line only after crying dog
    const howlRef = useRef(null);
    const growlRef = useRef(null);
    const { playVoice, stopVoice } = useAudio() ?? {};
    const SPEAKERS = ['LEO', 'NARRATOR', 'LEO', 'MARKY', 'NARRATOR', 'LEO', 'NARRATOR', 'WOLF'];
    const LINES = [
        'What was that?!',
        '(Eyewitness: Two bright yellow eyes are visible in a dark bush. A low sound comes out: Grrrr...)',
        "It's a monster! Run!",
        'Wait! Listen closely, Leo. It does not look like a nasty growl. That sounds like a...',
        '(Sound Effect: Grr... Huhu... Huhu...)',
        'A cry? It sounds sad.',
        'Leo goes closer to the bush. A giant BLUE WOLF steps out. It is really frightening with large teeth though it is holding back its paw. A large red thorn in its foot has stuck.',
        'Owoooo! It hurts! Please go away, little boy. I am big and scary. Everyone runs away from me.',
    ];

    // Step 0: wood creak → wolf howl → then show Leo narration and play his voice
    useEffect(() => {
        if (step !== 0 || !SFX_WOOD_CREAK) return;
        setStep0CreakDone(false);
        const creak = new Audio(SFX_WOOD_CREAK.includes(' ') ? encodeURI(SFX_WOOD_CREAK) : SFX_WOOD_CREAK);
        creak.play().catch(() => {});
        creak.onended = () => {
            if (!SFX_WOLF_HOWL) {
                setStep0CreakDone(true);
                const src = AUDIO.whisper3?.voice?.[0];
                const vol = AUDIO.whisper3?.voiceVolume?.[0];
                if (src && playVoice) playVoice(src, vol);
                return;
            }
            const howl = new Audio(SFX_WOLF_HOWL);
            howlRef.current = howl;
            howl.play().catch(() => {});
            howl.onended = () => {
                howlRef.current = null;
                setStep0CreakDone(true);
                const src = AUDIO.whisper3?.voice?.[0];
                const vol = AUDIO.whisper3?.voiceVolume?.[0];
                if (src && playVoice) playVoice(src, vol);
            };
        };
        return () => {
            creak.pause();
            creak.src = '';
            if (howlRef.current) {
                howlRef.current.pause();
                howlRef.current.src = '';
                howlRef.current = null;
            }
        };
    }, [step, playVoice]);

    // Stop growl when leaving step 1 (e.g. when MARKY step 3 appears)
    useEffect(() => {
        if (step !== 1 && growlRef.current) {
            growlRef.current.pause();
            growlRef.current.src = '';
            growlRef.current = null;
        }
    }, [step]);

    // Step 3: play crying dog first, then show MARKY narration and play his voice; play crying dog again while narration is ongoing
    useEffect(() => {
        if (step !== 3 || !SFX_CRYING_DOG) return;
        setStep3CryingDone(false);
        const crying = new Audio(SFX_CRYING_DOG.includes(' ') ? encodeURI(SFX_CRYING_DOG) : SFX_CRYING_DOG);
        crying.play().catch(() => {});
        crying.onended = () => {
            setStep3CryingDone(true);
            const src = AUDIO.whisper3?.voice?.[3];
            const vol = AUDIO.whisper3?.voiceVolume?.[3];
            if (src && playVoice) playVoice(src, vol);
            // Play crying dog again while MARKY narration is ongoing
            const cryingAgain = new Audio(SFX_CRYING_DOG.includes(' ') ? encodeURI(SFX_CRYING_DOG) : SFX_CRYING_DOG);
            cryingAgain.play().catch(() => {});
        };
        return () => {
            crying.pause();
            crying.src = '';
        };
    }, [step, playVoice]);

    // Step 4 (NARRATOR "Grr... Huhu... Huhu..."): play crying dog again
    useEffect(() => {
        if (step !== 4 || !SFX_CRYING_DOG) return;
        const crying = new Audio(SFX_CRYING_DOG.includes(' ') ? encodeURI(SFX_CRYING_DOG) : SFX_CRYING_DOG);
        crying.play().catch(() => {});
        return () => {
            crying.pause();
            crying.src = '';
        };
    }, [step]);

    // Steps 1–7: play voice; step 3 handled by crying-dog effect above; step 1 narrator: after audio ends, play growling
    useEffect(() => {
        if (step === 0 || step === 3 || !playVoice) return;
        const src = AUDIO.whisper3?.voice?.[step];
        const vol = AUDIO.whisper3?.voiceVolume?.[step];
        if (!src) return;
        const onEnded =
            step === 1 && SFX_GROWL
                ? () => {
                      const growl = new Audio(SFX_GROWL);
                      growl.loop = true;
                      growlRef.current = growl;
                      growl.play().catch(() => {});
                  }
                : undefined;
        playVoice(src, vol, onEnded);
    }, [step, playVoice]);

    return (
        <>
            <Head title="Whisper 3 - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background image – base wolf silhouette */}
                <img
                    src="/assets/img/whisperingwoods/bg wolf.webp"
                    alt="Whispering Woods with distant wolf"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Closer woods shot that fades in on steps 3 & 4 */}
                {step >= 3 && (
                    <img
                        src="/assets/img/whisperingwoods/bg-%232.webp"
                        alt="Whispering Woods close-up"
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                    />
                )}

                {/* Leo in the woods – shivering first, then turning to run, then curious, magnifying glass in step 6, shivering in step 7 */}
                <img
                    src={
                        step === 6
                            ? '/assets/img/Leo1.webp'
                            : step === 7
                              ? '/assets/img/whisperingwoods/Leo Shivering-right.webp'
                              : step === 5
                                ? '/assets/img/LeoCurious-right.webp'
                                : step >= 2
                                  ? '/assets/img/whisperingwoods/Leo Shivering-right.webp'
                                  : '/assets/img/whisperingwoods/Leo Shivering.webp'
                    }
                    alt={
                        step === 6
                            ? 'Leo with magnifying glass'
                            : step === 7
                              ? 'Leo shivering'
                              : step === 5
                                ? 'Leo curious and listening'
                                : step >= 2
                                  ? 'Leo shivering and ready to run'
                                  : 'Leo shivering'
                    }
                    loading="eager"
                    decoding="async"
                    className={`absolute bottom-[4%] h-auto object-contain object-bottom pointer-events-none ${
                        step === 6 || step === 7
                            ? 'left-[44%] w-[min(54vmin,62vw,680px)]'
                            : 'left-[12%] w-[min(54vmin,62vw,680px)]'
                    }`}
                    aria-hidden
                />

                {/* Marky beside Leo – steps 6 & 7 use Marky3-right, centered with Leo */}
                <img
                    src={step === 6 || step === 7 ? '/assets/img/whisperingwoods/Marky3-right.webp' : '/assets/img/Marky3.webp'}
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className={`absolute bottom-[4%] h-auto object-contain object-bottom pointer-events-none ${
                        step === 6 || step === 7
                            ? 'left-[24%] w-[min(54vmin,62vw,680px)]'
                            : 'left-[32%] w-[min(54vmin,62vw,680px)]'
                    }`}
                    aria-hidden
                />

                {/* Branch pile on the far right – foreground, subtle shake burst every 3 seconds, lowered slightly more */}
                <img
                    src="/assets/img/whisperingwoods/treee branch.webp"
                    alt="Broken tree branches"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[-7%] right-[4%] w-[min(50vmin,56vw,620px)] h-auto object-contain object-bottom pointer-events-none z-[60] shake-twice-soft-loop"
                    aria-hidden
                />

                {/* Wolf appearing at the same spot as the branch pile – background; changes size and emotion by step */}
                <img
                    src={
                        step >= 3
                            ? '/assets/img/whisperingwoods/wolf_emotions-%232.webp'
                            : '/assets/img/whisperingwoods/wolf_emotions-%235.webp'
                    }
                    alt="Scared wolf"
                    loading="eager"
                    decoding="async"
                    className={`absolute h-auto object-contain object-bottom pointer-events-none z-[40] bottom-[0%] ${step >= 3 ? 'right-[1%] w-[min(78vmin,82vw,980px)]' : 'right-[4%] w-[min(42vmin,46vw,550px)]'}`}
                />

                {/* Narration bar – step 0 after wood creak; step 3 after crying dog; else show */}
                {(step !== 0 || step0CreakDone) && (step !== 3 || step3CryingDone) && (
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {SPEAKERS[step]}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {LINES[step]}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 cursor-pointer transition-colors"
                            onClick={() => {
                                stopVoice?.();
                                if (step < LINES.length - 1) {
                                    setStep(step + 1);
                                } else {
                                    router.visit(route('mainplay.whisper4'));
                                }
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

