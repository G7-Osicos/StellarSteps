import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const FULL_BG_ZOOMED = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Full BG-zoomed.webp';
const DOOR_OPEN = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Stone opens.webp';
const LEO_IMG = '/assets/img/Leo0.webp';
const MARKY_IMG = '/assets/img/Marky4.webp';
const STAR_IMG = '/assets/img/Star.webp';

export default function Cloud6() {
    const { playSFX } = useAudio() ?? {};
    const [showStars, setShowStars] = useState(false);
    const [starClicked, setStarClicked] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShowStars(true), 1000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!showStars) return;
        const t = setTimeout(() => router.visit(route('mainplay.cloud6-end')), 3000);
        return () => clearTimeout(t);
    }, [showStars]);

    const handleStarClick = () => {
        if (!starClicked) {
            playSFX?.(AUDIO.sfx.starClick);
            setStarClicked(true);
        }
    };

    return (
        <>
            <Head title="Cloud 6 - Final Stars" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 fade-in-soft">
                <BackToMapButton />
                {/* Background */}
                <img
                    src={encodeURI(FULL_BG_ZOOMED)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Door - Stone Guardian open */}
                <img
                    src={encodeURI(DOOR_OPEN)}
                    alt="Stone Guardian"
                    className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(85vw,800px)] h-auto object-contain object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Leo */}
                <img
                    src={encodeURI(LEO_IMG)}
                    alt="Leo"
                    className="absolute left-[8%] bottom-[2%] w-[min(54vw,460px)] h-auto object-contain object-bottom pointer-events-none"
                    loading="eager"
                />

                {/* Marky */}
                <img
                    src={encodeURI(MARKY_IMG)}
                    alt="Marky"
                    className="absolute right-[6%] top-[12%] w-[min(46vw,380px)] h-auto object-contain pointer-events-none"
                    loading="eager"
                />

                {/* 3 Stars — appears at top 1 second after load */}
                {showStars && (
                    <div className="absolute left-1/2 bottom-[35%] -translate-x-1/2 flex items-center justify-center gap-4 sm:gap-6 z-[60]">
                        <div
                            className={`w-[min(28vw,180px)] flex justify-center items-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:brightness-110 ${starClicked ? 'pointer-events-none' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={handleStarClick}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleStarClick(); }}
                        >
                            <div className={starClicked ? 'star-spin' : ''}>
                                <img
                                    src={STAR_IMG}
                                    alt="Star"
                                    loading="eager"
                                    className="w-full h-auto object-contain star-fade-in"
                                />
                            </div>
                        </div>
                        <div
                            className={`w-[min(32vw,220px)] flex justify-center items-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:brightness-110 ${starClicked ? 'pointer-events-none' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={handleStarClick}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleStarClick(); }}
                        >
                            <div className={starClicked ? 'star-spin' : ''}>
                                <img
                                    src={STAR_IMG}
                                    alt="Final Star"
                                    loading="eager"
                                    className="w-full h-auto object-contain star-fade-in"
                                />
                            </div>
                        </div>
                        <div
                            className={`w-[min(28vw,180px)] flex justify-center items-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:brightness-110 ${starClicked ? 'pointer-events-none' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={handleStarClick}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleStarClick(); }}
                        >
                            <div className={starClicked ? 'star-spin' : ''}>
                                <img
                                    src={STAR_IMG}
                                    alt="Star"
                                    loading="eager"
                                    className="w-full h-auto object-contain star-fade-in"
                                />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
