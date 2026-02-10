import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';

const CLOUD_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/cloud.PNG';
const ROCK_PLATFORM_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/rock platform.webp';
const MARKY_IMG = '/assets/img/whisperingwoods/Marky4-right.webp';

export default function Cloud2GameInstruction() {
    return (
        <>
            <Head title="Cloud 2 Game - Instructions" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 flex flex-col">
                <BackToMapButton />
                {/* Same content as cloud2-game */}
                <div className="absolute inset-0 flex flex-col pointer-events-none select-none">
                    <div className="flex-1 flex items-center justify-around gap-4 px-4">
                        <img src={encodeURI(CLOUD_IMG)} alt="" className="w-[min(24vw,220px)] h-auto object-contain flex-shrink-0" />
                        <img src={encodeURI(ROCK_PLATFORM_IMG)} alt="" className="w-[min(32vw,300px)] h-auto object-contain object-bottom flex-shrink-0" />
                        <img src={encodeURI(ROCK_PLATFORM_IMG)} alt="" className="w-[min(32vw,300px)] h-auto object-contain object-bottom flex-shrink-0" />
                    </div>
                    <div className="flex-1 flex items-center justify-around gap-4 px-4">
                        <img src={encodeURI(CLOUD_IMG)} alt="" className="w-[min(24vw,220px)] h-auto object-contain flex-shrink-0" />
                        <img src={encodeURI(ROCK_PLATFORM_IMG)} alt="" className="w-[min(32vw,300px)] h-auto object-contain object-bottom flex-shrink-0" />
                        <img src={encodeURI(CLOUD_IMG)} alt="" className="w-[min(24vw,220px)] h-auto object-contain flex-shrink-0" />
                        <img src={encodeURI(ROCK_PLATFORM_IMG)} alt="" className="w-[min(32vw,300px)] h-auto object-contain object-bottom flex-shrink-0" />
                    </div>
                    <div className="flex-1 flex items-center justify-around gap-4 px-4">
                        <img src={encodeURI(CLOUD_IMG)} alt="" className="w-[min(24vw,220px)] h-auto object-contain flex-shrink-0" />
                        <img src={encodeURI(ROCK_PLATFORM_IMG)} alt="" className="w-[min(32vw,300px)] h-auto object-contain object-bottom flex-shrink-0" />
                        <img src={encodeURI(ROCK_PLATFORM_IMG)} alt="" className="w-[min(32vw,300px)] h-auto object-contain object-bottom flex-shrink-0" />
                    </div>
                </div>

                {/* White transparency overlay */}
                <div className="absolute inset-0 bg-white/65 pointer-events-none z-[105]" aria-hidden />

                {/* Marky at middle center */}
                <img
                    src={MARKY_IMG}
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(60vw,400px)] h-auto sm:w-[min(70vw,550px)] object-contain pointer-events-none z-[108]"
                    aria-hidden
                />

                {/* Narration box with text and next button */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110] flex justify-center">
                    <div className="w-full max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                Direction: Tap left or right to help Leo hop to the next platform and reach the top of the mountain until you score 10!
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                            onClick={() => router.visit(route('mainplay.cloud2-game'))}
                            aria-label="Next"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
