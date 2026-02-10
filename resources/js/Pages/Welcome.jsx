import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

/** Sequence: 'book' → 'leo' (slide in) → 'narration' (show) → 'gone' (both disappear) */
const PHASE_BOOK = 'book';
const PHASE_LEO = 'leo';
const PHASE_NARRATION = 'narration';
const PHASE_GONE = 'gone';

const DELAY_BEFORE_LEO_MS = 800;
const DELAY_BEFORE_NARRATION_MS = 500;

export default function Welcome() {
    const [bookLoaded, setBookLoaded] = useState(false);
    const [titleLoaded, setTitleLoaded] = useState(false);
    const [phase, setPhase] = useState(PHASE_BOOK);
    const [leoInPosition, setLeoInPosition] = useState(false);
    const { playVoice, stopVoice } = useAudio() ?? {};
    const [voiceReady, setVoiceReady] = useState(false);
    const voiceStartedRef = useRef(false);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(PHASE_LEO), DELAY_BEFORE_LEO_MS);
        const t2 = setTimeout(
            () => setPhase(PHASE_NARRATION),
            DELAY_BEFORE_LEO_MS + DELAY_BEFORE_NARRATION_MS
        );
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    // Unlock narration playback after the first user interaction
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const unlock = () => {
            setVoiceReady(true);
            window.removeEventListener('pointerdown', unlock);
        };
        window.addEventListener('pointerdown', unlock);
        return () => window.removeEventListener('pointerdown', unlock);
    }, []);

    // Play Leo's welcome line when narration bubble appears,
    // and only hide Leo + bubble after the voice line finishes.
    useEffect(() => {
        if (
            phase === PHASE_NARRATION &&
            voiceReady &&
            !voiceStartedRef.current &&
            AUDIO.welcome?.leoIntro &&
            playVoice
        ) {
            voiceStartedRef.current = true;
            playVoice(AUDIO.welcome.leoIntro, 1, () => {
                setPhase(PHASE_GONE);
            });
        }
        if (phase === PHASE_GONE && stopVoice) {
            stopVoice();
        }
    }, [phase, voiceReady, playVoice, stopVoice]);

    // Ensure voice stops when this page unmounts
    useEffect(
        () => () => {
            stopVoice?.();
        },
        [stopVoice]
    );

    // Trigger Leo slide-in after phase becomes LEO so CSS transition runs
    useEffect(() => {
        if (phase !== PHASE_LEO) return;
        const id = setTimeout(() => setLeoInPosition(true), 50);
        return () => clearTimeout(id);
    }, [phase]);

    const handleTap = () => {
        router.visit('/signup');
    };

    const showLeo = phase === PHASE_LEO || phase === PHASE_NARRATION || phase === PHASE_GONE;
    const leoSlideIn = (phase === PHASE_LEO && leoInPosition) || phase === PHASE_NARRATION || phase === PHASE_GONE;
    const showNarration = phase === PHASE_NARRATION;

    return (
        <>
            <Head title="Stellar Steps">
                <link rel="preload" href="/assets/img/LP_BG-960w.webp" as="image" />
                <link rel="preload" href="/assets/img/Leointro.png.webp" as="image" />
            </Head>
            <div className="min-h-screen w-full flex items-center justify-center relative" style={{ backgroundColor: '#5c4a3d' }}>
                <img
                    src="/assets/img/LP_BG.webp"
                    srcSet="/assets/img/LP_BG-960w.webp 960w, /assets/img/LP_BG-1920w.webp 1920w"
                    sizes="100vw"
                    alt=""
                    fetchpriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    aria-hidden
                />

                {/* Leo + narration: appear from side → narration → then both disappear */}
                <div
                    className={`absolute inset-0 z-[15] pointer-events-none transition-opacity duration-500 ${
                        phase === PHASE_BOOK || phase === PHASE_GONE ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    <img
                        src="/assets/img/Leointro.png.webp"
                        alt=""
                        loading="eager"
                        decoding="async"
                        className={`absolute left-0 bottom-[18%] w-[min(40vw,340px)] h-auto object-contain object-bottom drop-shadow-lg transition-transform duration-700 ease-out ${
                            leoSlideIn ? '-translate-x-[5%]' : '-translate-x-[120%]'
                        }`}
                        aria-hidden
                    />
                    <div
                        className={`absolute left-[min(28vw,220px)] bottom-[55%] max-w-[min(48vw,300px)] rounded-2xl bg-orange-400 border-2 border-white px-4 py-3 shadow-lg transition-opacity duration-400 ${
                            showNarration ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}
                    >
                        <p className="text-white text-base sm:text-lg font-medium leading-snug text-center cartoon-thin">
                            Hello There! I am Leo, welcome to Stellar Steps! To start, please tap the book to open.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleTap}
                    className="relative z-10 outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-xl"
                >
                    <div className="relative transform transition-transform duration-200 hover:scale-110">
                        <img
                            src="/assets/img/Book.webp"
                            srcSet="/assets/img/Book-800w.webp 800w, /assets/img/Book-1600w.webp 1600w"
                            sizes="(max-width: 768px) 384px, (max-width: 1024px) 512px, 672px"
                            alt="Story book"
                            fetchpriority="high"
                            decoding="async"
                            onLoad={() => setBookLoaded(true)}
                            className={`max-w-sm md:max-w-lg lg:max-w-2xl drop-shadow-2xl pointer-events-none select-none transition-opacity duration-500 ${bookLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        <img
                            src="/assets/img/title.webp"
                            srcSet="/assets/img/title-800w.webp 800w, /assets/img/title-1600w.webp 1600w"
                            sizes="(max-width: 768px) 75vw, (max-width: 1024px) 66vw, 50vw"
                            alt="Stellar Steps title"
                            fetchpriority="high"
                            decoding="async"
                            onLoad={() => setTitleLoaded(true)}
                            className={`pointer-events-none select-none absolute top-[18%] left-1/2 -translate-x-[40%] w-3/4 md:w-2/3 title-logo-glow transition-opacity duration-500 ${titleLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Visible immediately so user sees something while images load */}
                        <div className="absolute inset-x-0 bottom-[28%] flex justify-center">
                            <span
                                className="inline-block rounded-sans tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-yellow-300 animate-pulse ml-8 transform transition-transform duration-200 hover:scale-110"
                                style={{
                                    textShadow:
                                        '0 0 8px rgba(250,250,150,0.9), 0 0 18px rgba(250,250,150,0.7)',
                                    WebkitTextStroke: '1px rgba(253, 224, 71, 0.8)',
                                    paintOrder: 'stroke fill',
                                }}
                            >
                                TAP TO OPEN
                            </span>
                        </div>
                    </div>
                </button>
            </div>
        </>
    );
}
