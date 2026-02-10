import { Head, router, usePage } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const WOOD_BG = '/assets/img/LP_BG.webp';

// Two-step chapter 3 intro:
// 1) Wooden background with Stellar Steps title and chapter 3 subtitle
// 2) Full white zap → navigate to clouds1 (Gate of Gratitude)

export default function Chapter3Intro() {
    const { playBGM } = useAudio() ?? {};
    const [phase, setPhase] = useState('title'); // 'title' | 'white'
    const { auth } = usePage();
    const user = auth?.user ?? null;

    // Track when the hero starts Chapter 3 (latest run wins).
    useEffect(() => {
        if (!user || user.role !== 'hero') return;
        router.post(route('chapter-progress.start'), { chapter: 3 }, { preserveScroll: true, preserveState: true });
    }, [user]);

    useEffect(() => {
        if (AUDIO.bgm.chapter3 && playBGM) playBGM(AUDIO.bgm.chapter3, true);
    }, [playBGM]);

    useEffect(() => {
        if (phase !== 'title') return;
        const t = setTimeout(() => setPhase('white'), 2600);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'white') return;
        // Full white zap, then navigate to clouds1
        const t = setTimeout(() => {
            router.visit(route('mainplay.clouds1'));
        }, 400);
        return () => clearTimeout(t);
    }, [phase]);

    return (
        <>
            <Head title="Chapter 3: The Gate of Gratitude" />
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
                                Chapter 3: The Gate of Gratitude
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'white' && (
                    <div className="absolute inset-0 bg-white" aria-hidden />
                )}
            </div>
        </>
    );
}
