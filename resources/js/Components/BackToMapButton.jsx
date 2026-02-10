import { router } from '@inertiajs/react';

export default function BackToMapButton() {
    return (
        <button
            type="button"
            onClick={() => router.visit(route('mainplay'))}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[120] px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-sm sm:text-base font-semibold cartoon-thin border border-white/30 backdrop-blur-sm transition-colors"
            aria-label="Back to the Map"
        >
            Back to the Map
        </button>
    );
}
