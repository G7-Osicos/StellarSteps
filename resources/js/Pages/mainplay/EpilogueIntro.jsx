import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useEffect, useState } from 'react';

const WOOD_BG = '/assets/img/LP_BG.webp';

// Epilogue intro flow:
// 1) Wooden background with Stellar Steps title and epilogue subtitle
// 2) Black screen → transition to epilogue1-attic

export default function EpilogueIntro() {
    const [phase, setPhase] = useState('title'); // 'title' | 'black'

    useEffect(() => {
        if (phase !== 'title') return;
        const t = setTimeout(() => setPhase('black'), 2600);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'black') return;
        const t = setTimeout(() => router.visit(route('mainplay.epilogue1-attic')), 800);
        return () => clearTimeout(t);
    }, [phase]);

    return (
        <>
            <Head title="Epilogue: Back in the Attic" />
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
                                Epilogue: Back in the Attic
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'black' && <div className="absolute inset-0 bg-black" aria-hidden />}
            </div>
        </>
    );
}
