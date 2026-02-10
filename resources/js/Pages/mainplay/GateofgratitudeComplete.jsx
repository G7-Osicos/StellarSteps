import { Head, router, usePage } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

export default function GateofgratitudeComplete() {
    const { auth } = usePage();
    const user = auth?.user ?? null;
    const { playSFX, stopBGM } = useAudio() ?? {};
    // 0: all grey, 1: first yellow, 2: first rotate, 3: second yellow, 4: second rotate, 5: third yellow, 6: third rotate, 7: text, 8: button
    const [phase, setPhase] = useState(0);

    // Track when the hero finishes Chapter 3.
    useEffect(() => {
        if (!user || user.role !== 'hero') return;
        router.post(route('chapter-progress.finish'), { chapter: 3 }, { preserveScroll: true, preserveState: true });
    }, [user]);

    useEffect(() => {
        stopBGM?.();
    }, [stopBGM]);

    useEffect(() => {
        if ([2, 4, 6].includes(phase)) playSFX?.(AUDIO.sfx.starClick);
    }, [phase, playSFX]);

    useEffect(() => {
        if (phase === 0) {
            const t = setTimeout(() => setPhase(1), 200);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 1) {
            const t = setTimeout(() => setPhase(2), 900);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 2) {
            const t = setTimeout(() => setPhase(3), 250);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 3) {
            const t = setTimeout(() => setPhase(4), 900);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 4) {
            const t = setTimeout(() => setPhase(5), 250);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 5) {
            const t = setTimeout(() => setPhase(6), 900);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 6) {
            const t = setTimeout(() => setPhase(7), 250);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 7) {
            const t = setTimeout(() => setPhase(8), 250);
            return () => clearTimeout(t);
        }
    }, [phase]);

    const starSize = 'w-[min(35vw,380px)] h-auto object-contain select-none';

    return (
        <>
            <Head title="The Gate of Gratitude: Stars Collected" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* White overlay that fades out for zap transition from Cloud6End */}
                <div className="absolute inset-0 bg-white fade-out-black pointer-events-none z-[105]" aria-hidden />
                {/* Background */}
                <img
                    src="/assets/img/LP_BG.webp"
                    srcSet="/assets/img/LP_BG-960w.webp 960w, /assets/img/LP_BG-1920w.webp 1920w"
                    sizes="100vw"
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none fade-in-soft"
                />

                {/* Stars container – 3 stars (all yellow, Leo got the 3rd) */}
                <div className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 flex flex-row items-center justify-center gap-4 sm:gap-6">
                    {/* Star 1 – Kingdom (Order) */}
                    <div className={`relative w-[min(35vw,380px)] flex-shrink-0 cursor-pointer ${phase === 2 ? 'star-spin' : ''} ${phase >= 1 ? 'star-hover-pop-rotate' : 'star-hover-pop'}`}>
                        <img
                            src="/assets/img/Graystar.webp"
                            alt=""
                            loading="eager"
                            decoding="async"
                            className={`${starSize} w-full pointer-events-none`}
                        />
                        {phase >= 1 && (
                            <img
                                src="/assets/img/Star.webp"
                                alt="Star of Order"
                                loading="eager"
                                decoding="async"
                                className={`${starSize} w-full absolute inset-0 star-grey-to-yellow-with-glow pointer-events-none`}
                            />
                        )}
                    </div>
                    {/* Star 2 – Whispering Woods (Empathy) */}
                    <div className={`relative w-[min(35vw,380px)] flex-shrink-0 cursor-pointer ${phase === 4 ? 'star-spin' : ''} ${phase >= 3 ? 'star-hover-pop-rotate' : 'star-hover-pop'}`}>
                        <img
                            src="/assets/img/Graystar.webp"
                            alt=""
                            loading="eager"
                            decoding="async"
                            className={`${starSize} w-full pointer-events-none`}
                        />
                        {phase >= 3 && (
                            <img
                                src="/assets/img/Star.webp"
                                alt="Star of Empathy"
                                loading="eager"
                                decoding="async"
                                className={`${starSize} w-full absolute inset-0 star-grey-to-yellow-with-glow pointer-events-none`}
                            />
                        )}
                    </div>
                    {/* Star 3 – Gate of Gratitude (Leo got it) */}
                    <div className={`relative w-[min(35vw,380px)] flex-shrink-0 cursor-pointer ${phase === 6 ? 'star-spin' : ''} ${phase >= 5 ? 'star-hover-pop-rotate' : 'star-hover-pop'}`}>
                        <img
                            src="/assets/img/Graystar.webp"
                            alt=""
                            loading="eager"
                            decoding="async"
                            className={`${starSize} w-full pointer-events-none`}
                        />
                        {phase >= 5 && (
                            <img
                                src="/assets/img/Star.webp"
                                alt="Star of Gratitude"
                                loading="eager"
                                decoding="async"
                                className={`${starSize} w-full absolute inset-0 star-grey-to-yellow-with-glow pointer-events-none`}
                            />
                        )}
                    </div>
                </div>

                {/* Stars collected text */}
                {phase >= 7 && (
                    <p className="absolute left-1/2 top-[55%] -translate-x-1/2 cartoon-thin narration-text text-white text-3xl sm:text-4xl font-semibold text-center" style={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.6), -1px -1px 2px rgba(0,0,0,0.6), 1px -1px 2px rgba(0,0,0,0.6), -1px 1px 2px rgba(0,0,0,0.6), 0px 1px 2px rgba(0,0,0,0.6), 0px -1px 2px rgba(0,0,0,0.6), 1px 0px 2px rgba(0,0,0,0.6), -1px 0px 2px rgba(0,0,0,0.6)'
                    }}>
                        3/3 Stars Collected.
                    </p>
                )}

                {/* Back to the Map (left) + Proceed to Next (right) */}
                {phase === 8 && (
                    <div className="absolute left-4 right-4 sm:left-8 sm:right-8 bottom-12 sm:bottom-16 flex items-center justify-between gap-4">
                        <button
                            onClick={() => router.visit(route('mainplay', { chapter3_complete: 1 }))}
                            className="outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-xl cursor-pointer bg-transparent border-none p-0"
                        >
                            <span
                                className="inline-block rounded-sans tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-yellow-300 animate-pulse transform transition-transform duration-200 hover:scale-110 fade-in-soft"
                                style={{
                                    textShadow: '0 0 8px rgba(250,250,150,0.9), 0 0 18px rgba(250,250,150,0.7)',
                                    WebkitTextStroke: '1px rgba(253, 224, 71, 0.8)',
                                    paintOrder: 'stroke fill'
                                }}
                            >
                                Back to the Map
                            </span>
                        </button>
                        <button
                            onClick={() => router.visit(route('mainplay.epilogue-intro'))}
                            className="outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-xl cursor-pointer bg-transparent border-none p-0"
                        >
                            <span
                                className="inline-block rounded-sans tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-yellow-300 animate-pulse transform transition-transform duration-200 hover:scale-110 fade-in-soft"
                                style={{
                                    textShadow: '0 0 8px rgba(250,250,150,0.9), 0 0 18px rgba(250,250,150,0.7)',
                                    WebkitTextStroke: '1px rgba(253, 224, 71, 0.8)',
                                    paintOrder: 'stroke fill'
                                }}
                            >
                                Proceed to Next
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
