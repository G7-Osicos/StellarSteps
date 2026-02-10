import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const WOOD_BG = '/assets/img/LP_BG.webp';

// Two-step chapter 2 intro:
// 1) Wooden background with Stellar Steps title and chapter 2 subtitle
// 2) Brief dark screen transition → navigate to Whisper 1 in the woods

export default function Chapter2Intro() {
    const [phase, setPhase] = useState('title'); // 'title' | 'leo'
    const { playBGM } = useAudio() ?? {};

    // On reload of Chapter2Intro, start Chapter 2 BGM and let it continue through the woods
    useEffect(() => {
        const nav = performance.getEntriesByType?.('navigation')?.[0];
        const isReload = nav?.type === 'reload';
        if (!isReload) return;
        if (AUDIO.bgm?.chapter2 && playBGM) playBGM(AUDIO.bgm.chapter2, true);
    }, [playBGM]);

    useEffect(() => {
        if (phase !== 'title') return;
        const t = setTimeout(() => setPhase('leo'), 2600);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'leo') return;
        // After a short dark transition (1s), go right away to Whisper 1 in the woods
        const t = setTimeout(() => {
            router.visit(route('mainplay.whisper1'));
        }, 1000);
        return () => clearTimeout(t);
    }, [phase]);

    return (
        <>
            <Head title="Chapter 2: The Whispering Woods" />
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
                                Chapter 2: The Whispering Woods.
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'leo' && (
                    // Keep only a dark screen here as a quick transition
                    <div className="absolute inset-0 bg-black" aria-hidden />
                )}
            </div>
        </>
    );
}

