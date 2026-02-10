import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';

const STAGE_1_BG_2 = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic2.webp';

function BookHandHint({ visible }) {
    return (
        <div
            className="absolute select-none pointer-events-none"
            style={{
                left: '50%',
                top: '56%',
                transform: 'translateX(-50%) rotate(-20deg)',
                opacity: visible ? 1 : 0,
                transition: 'opacity 400ms ease-out',
                filter:
                    'drop-shadow(0 0 6px rgba(254,240,138,0.95)) drop-shadow(0 0 14px rgba(250,204,21,0.75)) drop-shadow(0 0 26px rgba(234,179,8,0.55))',
            }}
            aria-hidden
        >
            <div className="animate-bounce" style={{ animationDuration: '1.1s' }}>
                <img
                    src="/assets/img/pointt.webp"
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="w-[90px] h-[90px] object-contain"
                />
            </div>
        </div>
    );
}

export default function Stage2Attic() {
    const [narrationStep, setNarrationStep] = useState(0);
    const [showDirtyBook, setShowDirtyBook] = useState(false);
    const [showPostClickNarration, setShowPostClickNarration] = useState(false);
    const [postClickStep, setPostClickStep] = useState(0); // 0: dirty cover text, 1: wipe direction
    const [heroCongratsVisible, setHeroCongratsVisible] = useState(false);
    const [heroCongratsStep, setHeroCongratsStep] = useState(0); // 0: Well done, 1: book shakes text
    const [shakePhase, setShakePhase] = useState('none'); // 'none' | 'gentle' | 'strong'
    const [fadeToWhite, setFadeToWhite] = useState(false);
    const dirtCanvasRef = useRef(null);
    const isWipingRef = useRef(false);
    const [wipeProgress, setWipeProgress] = useState(0);
    const [wipeComplete, setWipeComplete] = useState(false);

    const narrationLinesBeforeClick = [
        'The old paper and cinnamon smell of the attic. It is silent... until the humming begins to come back. Hmmmmmmm. It is coming out of the middle of the room.',
        '"Oh... over... there."',
        "Leo creeps by a pile of antique paintings. He creeps closer to the light. It isn't a lamp. It isn't a flashlight. It is a book. A very, very old book.",
    ];
    const narrationLabelsBeforeClick = ['Narrator', 'LEO', 'Narrator'];
    const voiceByStep = ['/assets/audio/ins/Narrator2.m4a', '/assets/audio/Leo/oh over there.m4a', '/assets/audio/ins/Narrator3.m4a'];

    const preClickDone = narrationStep >= narrationLinesBeforeClick.length;

    const postClickVoiceByStep = ['/assets/audio/ins/Narrator4.m4a', '/assets/audio/ins/Instructions2.m4a']; // step 1: "Wipe the screen..."
    const postClickLabels = ['Narrator', 'Instruction'];
    const heroCongratsVoiceByStep = ['/assets/audio/ins/Narrator5.m4a', '/assets/audio/ins/Narrator5 2.m4a']; // step 0: "Well done, Hero!" step 1: "The Book suddenly shakes!..."
    const { playVoice, stopVoice } = useAudio() ?? {};
    useEffect(() => {
        if (!showDirtyBook && voiceByStep[narrationStep] && playVoice) {
            playVoice(voiceByStep[narrationStep]);
        }
    }, [narrationStep, showDirtyBook, playVoice]);
    useEffect(() => {
        if (showDirtyBook && showPostClickNarration && postClickVoiceByStep[postClickStep] && playVoice) {
            playVoice(postClickVoiceByStep[postClickStep]);
        }
    }, [showDirtyBook, showPostClickNarration, postClickStep, playVoice]);
    useEffect(() => {
        if (!heroCongratsVisible || !heroCongratsVoiceByStep[heroCongratsStep] || !playVoice) return;
        const src = heroCongratsVoiceByStep[heroCongratsStep];
        const onEnded =
            heroCongratsStep === 0
                // After "Well done, Hero!" automatically move to second line and start gentle shake
                ? () => {
                      setHeroCongratsStep(1);
                      setShakePhase('gentle');
                  }
                // After "The Book suddenly shakes!" immediately transition to prologue-end
                : () => {
                      setHeroCongratsVisible(false);
                      setShakePhase('strong');
                      setFadeToWhite(true);
                      setTimeout(() => {
                          router.visit(route('mainplay.prologue-end'));
                      }, 1200); // short white flash before navigating
                  };
        playVoice(src, 1, onEnded);
    }, [heroCongratsVisible, heroCongratsStep, playVoice, setFadeToWhite]);

    // When the dirty book is shown, draw the dirt texture onto the canvas.
    useEffect(() => {
        if (!showDirtyBook) return;
        const canvas = dirtCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = new Image();
        img.src = '/assets/img/dirt.webp';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(img, 0, 0);
        };
    }, [showDirtyBook]);

    function updateWipeProgress() {
        const canvas = dirtCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        const { width, height } = canvas;
        if (!width || !height) return;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const totalPixels = width * height;
        let clearedPixels = 0;

        // Alpha channel is every 4th byte starting at index 3.
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) {
                clearedPixels++;
            }
        }

        const progress = Math.min(100, Math.round((clearedPixels / totalPixels) * 100));
        setWipeProgress(progress);
        if (progress >= 90 && !heroCongratsVisible && shakePhase === 'none') {
            setHeroCongratsVisible(true);
            setHeroCongratsStep(0);
        }
        if (progress >= 100) {
            setWipeComplete(true);
        }
    }

    // Strong shake is triggered from the hero congrats onEnded callback; no extra timing here.

    return (
        <>
            <Head title="Stage 1: The Attic – The Book" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat fade-in-soft"
                    style={{ backgroundImage: `url('${encodeURI(STAGE_1_BG_2)}')` }}
                    aria-hidden
                />
                {/* Dark overlay over background only – starts dark, lightens after "Oh... over... there." */}
                <div
                    className="absolute inset-0 bg-black transition-opacity duration-700 ease-out pointer-events-none"
                    style={{
                        // narrationStep 0 = first line (very dark); once we advance to step 1 ("Oh... over... there."),
                        // fade the background back to normal.
                        opacity: narrationStep === 0 ? 0.7 : 0,
                    }}
                    aria-hidden
                />
                {/* Extra darkening during hero congrats, shaking, and fade-out */}
                {(heroCongratsVisible || shakePhase !== 'none' || fadeToWhite) && (
                    <div className="absolute inset-0 bg-black/70 pointer-events-none" aria-hidden />
                )}
                {/* Fade-to-white overlay at the very end before transitioning */}
                {fadeToWhite && (
                    <div className="absolute inset-0 bg-white white-fade-in z-[130]" aria-hidden />
                )}

                {/* Hero congrats overlay after most of the dirt is wiped – uses the same narration style */}
                {heroCongratsVisible && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[120]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                Narrator
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {heroCongratsStep === 0
                                    ? 'Well done, Hero!'
                                    : 'The Book suddenly shakes! Rumble... Rumble... The Book suddenly opens.'}
                            </div>
                        </div>
                    </div>
                )}
                {/* Leo – appears on the right for first narration, then on the left (Leo1-left) for "Oh... over... there." */}
                {!showDirtyBook && (
                    <img
                        src={narrationStep === 0 ? '/assets/img/Leo1-left.webp' : '/assets/img/Leo1.webp'}
                        alt=""
                        loading="eager"
                        decoding="async"
                        className="absolute w-[480px] h-auto select-none pointer-events-none"
                        style={
                            narrationStep === 0
                                ? {
                                      // To the right of the narration box
                                      right: '6%',
                                      bottom: '10%',
                                  }
                                : {
                                      // To the left of the narration box
                                      left: '6%',
                                      bottom: '10%',
                                  }
                        }
                        aria-hidden
                    />
                )}

                {/* Dirty book covers the center after click: original title book art with erasable dirt overlay */}
                {showDirtyBook && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={shakePhase !== 'none' ? 'scale-up-slow' : ''}>
                            <div
                                className={`relative w-[min(80vw,520px)] ${
                                    shakePhase === 'gentle'
                                        ? 'gentle-tilt-move-shake'
                                        : shakePhase === 'strong'
                                            ? 'strong-tilt-move-shake'
                                            : ''
                                }`}
                            >
                            {/* Base book from the opening scene */}
                            <img
                                src="/assets/img/Book.webp"
                                srcSet="/assets/img/Book-800w.webp 800w, /assets/img/Book-1600w.webp 1600w"
                                sizes="(max-width: 768px) 85vw, 600px"
                                alt="A magical story book"
                                loading="eager"
                                decoding="async"
                                className="w-full h-auto drop-shadow-2xl"
                            />
                            {/* Stellar Steps title, nudged a bit further to the right.
                                When the dirt is 90% wiped or more, add the same glowing
                                shine effect used on the landing screen title. */}
                            <img
                                src="/assets/img/title.webp"
                                srcSet="/assets/img/title-800w.webp 800w, /assets/img/title-1600w.webp 1600w"
                                sizes="(max-width: 768px) 60vw, 450px"
                                alt="Stellar Steps"
                                loading="eager"
                                decoding="async"
                                className={`absolute top-[22%] left-[54%] -translate-x-1/2 w-4/5 opacity-90 pointer-events-none ${
                                    wipeProgress >= 90 ? 'title-logo-glow' : ''
                                }`}
                            />
                            {/* Dirt overlay on a canvas the user can wipe away */}
                            <canvas
                                ref={dirtCanvasRef}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-auto max-h-[80vh] cursor-pointer"
                                onPointerDown={(e) => {
                                    isWipingRef.current = true;
                                    setShowPostClickNarration(false);
                                    const canvas = dirtCanvasRef.current;
                                    if (!canvas) return;
                                    const rect = canvas.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                                    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                                    const ctx = canvas.getContext('2d');
                                    if (!ctx) return;
                                    ctx.globalCompositeOperation = 'destination-out';
                                    ctx.beginPath();
                                    ctx.arc(x, y, 130, 0, Math.PI * 2);
                                    ctx.fill();
                                }}
                                onPointerMove={(e) => {
                                    if (!isWipingRef.current) return;
                                    const canvas = dirtCanvasRef.current;
                                    if (!canvas) return;
                                    const rect = canvas.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                                    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                                    const ctx = canvas.getContext('2d');
                                    if (!ctx) return;
                                    ctx.globalCompositeOperation = 'destination-out';
                                    ctx.beginPath();
                                    ctx.arc(x, y, 130, 0, Math.PI * 2);
                                    ctx.fill();
                                }}
                                onPointerUp={() => {
                                    isWipingRef.current = false;
                                    updateWipeProgress();
                                }}
                                onPointerLeave={() => {
                                    isWipingRef.current = false;
                                    updateWipeProgress();
                                }}
                            />
                            </div>
                        </div>
                    </div>
                )}

                {/* Post-click narration over dirty book – Leo curious + two-step narration before wiping */}
                {showDirtyBook && showPostClickNarration && (
                    <>
                        <img
                            src="/assets/img/LeoCurious.webp"
                            alt=""
                            loading="eager"
                            decoding="async"
                            className="absolute w-[420px] h-auto select-none pointer-events-none"
                            style={{
                                right: '6%',
                                bottom: '8%',
                            }}
                            aria-hidden
                        />
                        <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                            <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                        {postClickLabels[postClickStep]}
                                    </div>
                                    <div className="h-px bg-white/30 mb-2" aria-hidden />
                                    <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                        {postClickStep === 0 ? (
                                            <>
                                                Leo reaches his hand out. He would like to open it, then the cover is so dirty! Years
                                                and years of dust like gray cover it. You can&apos;t even read the title.
                                            </>
                                        ) : (
                                            <>Wipe the screen to remove the dust on the book!</>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                    onClick={() => {
                                        stopVoice?.();
                                        if (postClickStep === 0) {
                                            setPostClickStep(1);
                                        } else {
                                            setShowPostClickNarration(false);
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
                    </>
                )}

                {/* Narration before click */}
                {!showDirtyBook && !preClickDone && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                    {narrationLabelsBeforeClick[narrationStep]}
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    {narrationLinesBeforeClick[narrationStep]}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                onClick={() => {
                                    stopVoice?.();
                                    setNarrationStep((s) => s + 1);
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

                {/* Clickable area over the bright blue book.
                    Enabled only after the pre-click narration is done. */}
                <button
                    type="button"
                    className="absolute bg-transparent border-0 p-0 m-0"
                    style={{
                        left: '50%',
                        top: '52%',
                        width: '30%',
                        height: '40%',
                        transform: 'translateX(-50%)',
                        cursor: preClickDone && !showDirtyBook ? 'pointer' : 'default',
                        pointerEvents: preClickDone && !showDirtyBook ? 'auto' : 'none',
                    }}
                    aria-label="Glowing book"
                    onClick={() => {
                        if (!preClickDone) return;
                        setShowDirtyBook(true);
                        setShowPostClickNarration(true);
                        setPostClickStep(0);
                    }}
                />

                {/* Pointing hand hint to tap the book – only after narration, before click */}
                <BookHandHint visible={preClickDone && !showDirtyBook} />

            </div>
        </>
    );
}

