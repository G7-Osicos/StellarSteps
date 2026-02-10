import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';

const WOOD_BG = '/assets/img/LP_BG.webp';
const SFX_FALLING = '/assets/audio/bgm/sfx 1 - Falling.mp3';
const CHAPTER1_BGM = '/assets/audio/bgm/BGM - Frame 1-9.wav';

// Two-step chapter 1 intro:
// 1) Wooden background with Stellar Steps title and chapter 1 subtitle
// 2) Black screen with falling Leo → navigate to kingdom1 right away after fall

export default function Chapter1Intro() {
    const { playSFX, playBGM } = useAudio() ?? {};
    const [phase, setPhase] = useState('title'); // 'title' | 'leo'

    useEffect(() => {
        if (CHAPTER1_BGM && playBGM) playBGM(CHAPTER1_BGM, true);
        // Don't stop BGM on unmount – continues to kingdom1 and kingdom2
    }, [playBGM]);

    useEffect(() => {
        if (phase !== 'title') return;
        const t = setTimeout(() => setPhase('leo'), 2600);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'leo') return;
        playSFX?.(SFX_FALLING);
        // After fall animation completes (2s), go right away to kingdom1
        const t = setTimeout(() => {
            router.visit(route('mainplay.kingdom1'));
        }, 2000);
        return () => clearTimeout(t);
    }, [phase, playSFX]);

    return (
        <>
            <Head title="Chapter 1: The Kingdom of Clutter" />
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
                                Chapter 1: The Kingdom of Clutter
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'leo' && (
                    <>
                        <div className="absolute inset-0 bg-black" aria-hidden />
                        <img
                            src="/assets/img/C1F2-Leo.webp"
                            alt="Leo falling"
                            loading="eager"
                            decoding="async"
                            className="absolute top-0 left-1/2 w-[min(85vw,1000px)] h-auto object-contain pointer-events-none fall-down"
                            aria-hidden
                        />
                    </>
                )}
            </div>
        </>
    );
}
