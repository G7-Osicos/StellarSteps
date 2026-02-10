import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';

const LP_BG = '/assets/img/LP_BG-1920w.webp';
const TITLE = '/assets/img/title.webp';

export default function StellarstepsComplete() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShowButton(true), 3000);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <Head title="Stellar Steps - The End" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                <img
                    src={LP_BG}
                    srcSet="/assets/img/LP_BG-960w.webp 960w, /assets/img/LP_BG-1920w.webp 1920w"
                    sizes="100vw"
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center fade-in-soft"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <p className="cartoon-thin narration-text text-white text-3xl sm:text-4xl md:text-5xl text-center drop-shadow-lg font-black -mt-24 sm:-mt-32">
                        THE END. Congratulations, you have finished
                    </p>
                    <img
                        src={TITLE}
                        srcSet="/assets/img/title-800w.webp 800w, /assets/img/title-1600w.webp 1600w"
                        sizes="(max-width: 768px) 78vw, 880px"
                        alt="Stellar Steps"
                        loading="eager"
                        decoding="async"
                        className="w-[78vw] max-w-[880px] drop-shadow-2xl fade-in-soft"
                    />
                    {showButton && (
                    <button
                        onClick={() => router.visit(route('mainplay', { all_complete: 1 }))}
                        className="absolute left-1/2 bottom-12 sm:bottom-16 -translate-x-1/2 outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-xl cursor-pointer bg-transparent border-none p-0"
                    >
                        <span
                            className="inline-block rounded-sans tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-300 animate-glow-blink transform transition-transform duration-200 hover:scale-110 hover:animate-none hover:opacity-100 fade-in-soft"
                            style={{
                                textShadow: '0 0 8px rgba(250,250,150,0.9), 0 0 18px rgba(250,250,150,0.7)',
                                WebkitTextStroke: '1px rgba(253, 224, 71, 0.8)',
                                paintOrder: 'stroke fill'
                            }}
                        >
                            Back to Homepage
                        </span>
                    </button>
                )}
                </div>
            </div>
        </>
    );
}
