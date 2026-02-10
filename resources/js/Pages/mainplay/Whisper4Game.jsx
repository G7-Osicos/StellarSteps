import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

function useDraggable(initialStyle, { onPointerUp } = {}) {
    const [pos, setPos] = useState(null);
    const [dragging, setDragging] = useState(false);
    const offsetRef = useRef({ x: 0, y: 0 });
    const posRef = useRef(null);
    const ref = useRef(null);
    const onPointerUpRef = useRef(onPointerUp);
    onPointerUpRef.current = onPointerUp;

    useEffect(() => {
        if (!ref.current || pos !== null) return;
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: rect.left, y: rect.top });
    }, [pos]);

    useEffect(() => { posRef.current = pos; }, [pos]);

    const handlePointerDown = useCallback((e) => {
        e.preventDefault();
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setDragging(true);
    }, []);

    useEffect(() => {
        if (!dragging) return;
        const onMove = (e) => {
            const next = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y };
            posRef.current = next;
            setPos((prev) => (prev ? next : prev));
        };
        const onUp = () => {
            setDragging(false);
            const rect = ref.current?.getBoundingClientRect();
            if (rect && onPointerUpRef.current) {
                const p = posRef.current;
                const x = p?.x ?? rect.left;
                const y = p?.y ?? rect.top;
                const centerX = x + rect.width / 2;
                const centerY = y + rect.height / 2;
                const topRightX = x + rect.width;
                const topRightY = y;
                onPointerUpRef.current({ x, y, centerX, centerY, topRightX, topRightY });
            }
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
    }, [dragging]);

    return {
        ref,
        style: pos
            ? { position: 'absolute', left: pos.x, top: pos.y }
            : undefined,
        className: pos ? '' : initialStyle,
        onPointerDown: handlePointerDown,
        isDragging: dragging,
    };
}

/** Thorn hit zone: paw is upper-right, thorn is in center-right area. Uses tweezer's upper-right corner (grip end). */
function isInThornZone(topRightX, topRightY) {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const zoneLeft = w * 0.55;
    const zoneRight = w * 0.92;
    const zoneTop = h * 0.08;
    const zoneBottom = h * 0.42;
    return topRightX >= zoneLeft && topRightX <= zoneRight && topRightY >= zoneTop && topRightY <= zoneBottom;
}

/** Wound zone: where bandage must be dropped to cover the wound on the paw (after thorn removed). */
function isInWoundZone(centerX, centerY) {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const zoneLeft = w * 0.5;
    const zoneRight = w * 0.95;
    const zoneTop = h * 0.32;
    const zoneBottom = h * 0.72;
    return centerX >= zoneLeft && centerX <= zoneRight && centerY >= zoneTop && centerY <= zoneBottom;
}

const WHISPER4_GAME_RELOAD_VOICE = '/assets/audio/Marky/Marky 13.m4a';

export default function Whisper4Game() {
    const { playSFX, playVoice, stopVoice } = useAudio() ?? {};
    const [showDirection, setShowDirection] = useState(true);
    const [thornRemoved, setThornRemoved] = useState(false);
    const [bandageApplied, setBandageApplied] = useState(false);
    const [wolfDismissed, setWolfDismissed] = useState(false);

    const handleTweezerRelease = useCallback(({ topRightX, topRightY }) => {
        if (isInThornZone(topRightX, topRightY)) setThornRemoved(true);
    }, []);

    const handleBandageRelease = useCallback(({ centerX, centerY }) => {
        if (thornRemoved && !bandageApplied && isInWoundZone(centerX, centerY)) setBandageApplied(true);
    }, [thornRemoved, bandageApplied]);

    const tweezers = useDraggable('absolute top-[28%] left-[12%]', { onPointerUp: handleTweezerRelease });
    const bandage = useDraggable('absolute bottom-[22%] left-[26%]', { onPointerUp: handleBandageRelease });

    useEffect(() => {
        const t = setTimeout(() => setShowDirection(false), 1000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!thornRemoved) return;
        const t = setTimeout(() => setWolfDismissed(true), 3000);
        return () => clearTimeout(t);
    }, [thornRemoved]);

    useEffect(() => {
        if (thornRemoved && !wolfDismissed && AUDIO.whisper4Game?.wolfOuch && playVoice) {
            playVoice(AUDIO.whisper4Game.wolfOuch);
            return () => stopVoice?.();
        }
    }, [thornRemoved, wolfDismissed, playVoice, stopVoice]);

    useEffect(() => {
        if (bandageApplied) playSFX?.(AUDIO.whisper4Game?.sparkle);
    }, [bandageApplied, playSFX]);

    useEffect(() => {
        const nav = performance.getEntriesByType?.('navigation')?.[0];
        if (nav?.type === 'reload' && playVoice) playVoice(WHISPER4_GAME_RELOAD_VOICE);
    }, [playVoice]);

    // Narration state: step1 | wolf | step2 | sparkle
    const narration =
        showDirection
            ? null
            : bandageApplied
              ? { speaker: 'INSTRUCTION', text: 'Sound: Sparkle! Sparkle!', showNext: true }
              : wolfDismissed
                ? { speaker: 'INSTRUCTION', text: 'Step 2: Drag the bandage all over the boo-boo!', showNext: false }
                : thornRemoved
                  ? { speaker: 'WOLF', text: "Ouch! ... Oh, that feels better already.", showNext: false }
                  : { speaker: 'INSTRUCTION', text: 'Step 1: Drag the tweezer to the thorn.', showNext: false };

    return (
        <>
            <Head title="Fix the Wolf - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background – dark forest / cave */}
                <img
                    src="/assets/img/whisperingwoods/bg-%232zoom.webp"
                    alt="Whispering Woods"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 blur-sm"
                />
                <div className="absolute inset-0 bg-black/40" aria-hidden />

                {/* Injured paw with thorn – upper right corner (or healed after removal, or bandaged) */}
                <img
                    src={bandageApplied ? '/assets/img/whisperingwoods/paw%20tthorn%20removal%20bandage.webp' : thornRemoved ? '/assets/img/whisperingwoods/paw%20tthorn%20removal%202new.webp' : '/assets/img/whisperingwoods/paw%20tthorn%20removal%202.webp'}
                    alt="Wolf paw with thorn"
                    loading="eager"
                    decoding="async"
                    className="absolute top-0 right-0 w-[min(120vmin,115vw,1500px)] h-auto object-contain object-top object-right pointer-events-none z-[40]"
                    aria-hidden
                />

                {/* Sparkle effect over bandage when applied */}
                {bandageApplied && (
                    <img
                        src="/assets/img/whisperingwoods/Sparkle.webp"
                        alt=""
                        loading="eager"
                        decoding="async"
                        className="absolute right-[34%] top-[44%] w-[min(45vmin,420px)] h-auto object-contain pointer-events-none z-[45] mix-blend-screen white-blink-glow"
                        aria-hidden
                    />
                )}

                {/* Tweezers – draggable */}
                <img
                    ref={tweezers.ref}
                    src={thornRemoved ? '/assets/img/whisperingwoods/thornremoved.webp' : '/assets/img/whisperingwoods/Tool%20Tweezer.webp'}
                    alt="Tweezers"
                    loading="eager"
                    decoding="async"
                    style={tweezers.style}
                    className={`absolute ${thornRemoved ? 'w-[min(55vmin,60vw,650px)]' : 'w-[min(40vmin,48vw,500px)]'} h-auto object-contain pointer-events-auto z-[50] select-none ${tweezers.className} ${tweezers.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onPointerDown={(e) => {
                        if (!thornRemoved) playSFX?.(AUDIO.whisper4Game?.tweezer);
                        tweezers.onPointerDown(e);
                    }}
                    aria-hidden
                    draggable={false}
                />

                {/* Bandage – draggable (vanishes when applied to wound) */}
                {!bandageApplied && (
                    <img
                        ref={bandage.ref}
                        src="/assets/img/whisperingwoods/Tool%20Bandage-hor.webp"
                        alt="Bandage"
                        loading="eager"
                        decoding="async"
                        style={bandage.style}
                        className={`absolute w-[min(44vmin,52vw,560px)] h-auto object-contain pointer-events-auto z-[50] select-none ${bandage.className} ${bandage.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        onPointerDown={bandage.onPointerDown}
                        aria-hidden
                        draggable={false}
                    />
                )}

                {/* Direction bar – disappears after 1 sec, then narration */}
                {showDirection ? (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110] fade-in-soft">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-orange-300 text-white px-5 py-4 sm:px-6 sm:py-5 border-2 border-white">
                            <div className="text-center text-base sm:text-lg font-bold uppercase tracking-wider text-white mb-2">
                                DIRECTION
                            </div>
                            <div className="h-px bg-white/50 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-xl sm:text-2xl font-bold leading-relaxed drop-shadow text-left text-white">
                                Move the tools in order to fix the Wolf!
                            </div>
                        </div>
                    </div>
                ) : narration ? (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110] fade-in-soft">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                    {narration.speaker}
                                </div>
                                <div className="h-px bg-white/30 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                    {narration.text}
                                </div>
                            </div>
                            {narration.showNext && (
                                <button
                                    type="button"
                                    onClick={() => (bandageApplied ? router.visit(route('mainplay.whisper4-end')) : setWolfDismissed(true))}
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
                ) : null}
            </div>
        </>
    );
}
