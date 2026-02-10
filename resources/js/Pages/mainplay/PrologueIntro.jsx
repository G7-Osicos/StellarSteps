import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useEffect, useState } from 'react';

const WOOD_BG = '/assets/img/LP_BG.webp';

// Simple two-step prologue intro:
// 1) Attic background with Stellar Steps title and prologue subtitle
// 2) Black screen with big Leo and first narration line, then Next → prologue1-attic

export default function PrologueIntro() {
    const [phase, setPhase] = useState('title'); // 'title' | 'leo';

    useEffect(() => {
        if (phase !== 'title') return;
        const t = setTimeout(() => setPhase('leo'), 2600);
        return () => clearTimeout(t);
    }, [phase]);

    const firstLine =
        'This is Leo. Leo loves adventures. He likes tree climbing, collecting shiny rocks, and puzzles. Still, Leo has never had a bigger adventure than he has today: The Attic.';

    return (
        <>
            <Head title="Prologue: The Secret in the Attic" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat fade-in-soft"
                    style={{ backgroundImage: `url('${encodeURI(WOOD_BG)}')` }}
                    aria-hidden
                />
                {phase === 'title' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex flex-col items-center gap-6">
                            <img
                                src="/assets/img/title.webp"
                                    srcSet="/assets/img/title-800w.webp 800w, /assets/img/title-1600w.webp 1600w"
                                    sizes="(max-width: 768px) 75vw, 50vw"
                                alt="Stellar Steps"
                                loading="eager"
                                decoding="async"
                                className="w-[78vw] max-w-[880px] drop-shadow-2xl"
                            />
                            <div className="cartoon-thin narration-text text-white text-2xl sm:text-3xl md:text-4xl text-center drop-shadow-lg">
                                Prologue: The Secret in the Attic
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'leo' && (
                    <>
                        <div className="absolute inset-0 bg-black" aria-hidden />
                        <img
                            src="/assets/img/Leo0.webp"
                            alt="Leo waving hello"
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 m-auto w-[min(85vw,800px)] h-auto object-contain pointer-events-none"
                            aria-hidden
                        />
                        <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                            <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                        Narrator
                                    </div>
                                    <div className="h-px bg-white/30 mb-2" aria-hidden />
                                    <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                        {firstLine}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                    onClick={() => router.visit(route('mainplay.prologue1-attic'))}
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
            </div>
        </>
    );
}

