import { Head, router, usePage } from '@inertiajs/react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';
import { useState, useEffect } from 'react';
import { CircleUserRound, Undo2 } from 'lucide-react';

/** Number of gold stars to show (0–3). Future: drive from hero achievement. */
const STARS_UNLOCK_DELAY_MS = 1200;

function StarsTabContent({ goldStarCount: propGoldCount }) {
    // Internal state for "on load" effect; can be overridden by prop for future hero achievement
    const [goldStarCount, setGoldStarCount] = useState(propGoldCount ?? 0);
    const effectiveGoldCount = propGoldCount !== undefined ? propGoldCount : goldStarCount;

    useEffect(() => {
        if (propGoldCount !== undefined) return;
        const t = setTimeout(() => setGoldStarCount(1), STARS_UNLOCK_DELAY_MS);
        return () => clearTimeout(t);
    }, [propGoldCount]);

    const grayStarClass = 'w-16 h-16 sm:w-[4rem] sm:h-[4rem] object-contain [filter:drop-shadow(0_0_2px_#1f2937)_drop-shadow(0_0_6px_#111827)_drop-shadow(0_0_10px_#000)]';
    const goldStarGlow = '[filter:drop-shadow(0_0_1px_#fff)_drop-shadow(0_0_2px_#fff)_drop-shadow(0_0_3px_#fff)_drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]';
    const goldStarBlink = 'animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]';

    return (
        <div className="flex items-center gap-0 -space-x-3 sm:-space-x-4">
            {[0, 1, 2].map((index) => {
                const isGold = index < effectiveGoldCount;
                return (
                    <div key={index} className="relative w-16 h-16 sm:w-[4rem] sm:h-[4rem] flex-shrink-0">
                        {isGold ? (
                            <>
                                <img src="/assets/img/Star.webp" alt="" loading="lazy" decoding="async" className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${goldStarBlink}`} aria-hidden />
                                <img src="/assets/img/Star.webp" alt="" loading="lazy" decoding="async" className={`relative z-10 w-full h-full object-contain ${goldStarGlow} ${index === 0 ? 'animate-star-unlock' : ''}`} aria-hidden />
                            </>
                        ) : (
                            <img src="/assets/img/Graystar.webp" alt="" loading="lazy" decoding="async" className={grayStarClass} aria-hidden />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const tabsStatic = [
    {
        id: 'menu',
        label: 'Menu',
        content: (
            <svg className="w-[5.5rem] h-[5.5rem] sm:w-[6rem] sm:h-[6rem] text-white animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        ),
    },
    {
        id: 'help',
        label: 'Help',
        content: <span className="cartoon-body text-white text-6xl sm:text-7xl font-bold animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">?</span>,
    },
    {
        id: 'stars',
        label: 'Stars',
        content: null, // filled in Mainplay with <StarsTabContent />
    },
    {
        id: 'map',
        label: 'My Adventure Map',
        content: (
            <span className="cartoon-thin text-white text-base sm:text-lg font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                <span>My Adventure</span>
                <span>Map</span>
            </span>
        ),
    },
    {
        id: 'profile',
        label: 'Profile',
        content: <CircleUserRound className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] text-white animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]" aria-hidden />,
    },
];

/** Menu wood left offset (transform) - single source of truth so it doesn't revert */
const MENU_TAB_TRANSLATE_LEFT = ' -translate-x-[15rem] sm:-translate-x-[16rem]';

/** Rightward offset for Help, Stars, Map, Profile tabs */
const OTHER_TABS_TRANSLATE_RIGHT = '9rem';

/** Reference layout size – entire UI is scaled to fit viewport while keeping this layout */
const LAYOUT_REF_WIDTH = 1600;
const LAYOUT_REF_HEIGHT = 900;

function getLayoutScale() {
    if (typeof window === 'undefined') return 1;
    return Math.min(window.innerWidth / LAYOUT_REF_WIDTH, window.innerHeight / LAYOUT_REF_HEIGHT);
}

const PROFILE_BOUNCE_OUT_MS = 250;
const WOODEN_SIGN_SLIDE_DOWN_MS = 400;

/** Stage system: 0 = locked, 1 = play, 2 = replay, 3 = continue (reuse play icon) */
const BUTTON_IMGS = ['/assets/img/locked.webp', '/assets/img/play.webp', '/assets/img/replay.webp'];
/** Stage 1 full-screen background (attic) when Play is clicked */
const STAGE_1_FULLSCREEN_BG = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic1.webp';
/** Stage illustration B (uncleared) and C (cleared) – stages 1–5 */
const STAGE_ILLUSTRATIONS = [
    { B: '/assets/img/prologueB.webp', C: '/assets/img/prologueC.webp' },  // Stage 1 – prologue left
    { B: '/assets/img/castleB.webp', C: '/assets/img/castleC.webp' },       // Stage 2 – castle
    { B: '/assets/img/woodsB.webp', C: '/assets/img/woodsC.webp' },         // Stage 3 – woods
    { B: '/assets/img/gateB.webp', C: '/assets/img/gateC.webp' },           // Stage 4 – gate
    { B: '/assets/img/prologueB.webp', C: '/assets/img/prologueC.webp' },  // Stage 5 – prologue right
];

export default function Mainplay() {
    const page = usePage();
    const { auth, initialProgress, chapterTimes } = page.props || {};
    const user = auth?.user ?? null;
    const [scale, setScale] = useState(getLayoutScale);
    const [showProfileExtension, setShowProfileExtension] = useState(false);
    const [profileClosing, setProfileClosing] = useState(false);
    const [showWoodenSign, setShowWoodenSign] = useState(false);
    const [woodenSignClosing, setWoodenSignClosing] = useState(false);
    const [showSettingsBoard, setShowSettingsBoard] = useState(false);
    const [settingsBoardClosing, setSettingsBoardClosing] = useState(false);
    const [showProgressBoard, setShowProgressBoard] = useState(false);
    const [progressBoardClosing, setProgressBoardClosing] = useState(false);
    const [chapterInfo, setChapterInfo] = useState(null);
    // Main book content mode: 'map' = stage images/buttons, 'help' = empty book (for Help tab)
    const [activeMainTab, setActiveMainTab] = useState('map');
    // Help tab phases: 'hidden' = nothing, 'left' = left page only, 'both' = left + right
    const [helpPhase, setHelpPhase] = useState('hidden');
    const { screenBrightness, textSize, updateSettings } = useSettings() ?? { screenBrightness: 100, textSize: 100, updateSettings: () => {} };
    const { volume, muted, updateVolume, updateMuted, stopBGM, playVoice, stopVoice } =
        useAudio() ?? {
            volume: 80,
            muted: false,
            updateVolume: () => {},
            updateMuted: () => {},
            stopBGM: () => {},
            playVoice: () => {},
            stopVoice: () => {},
        };
    /** Which stages are cleared (1–5). From server (user-specific) or URL params. */
    const [clearedStages, setClearedStages] = useState(() => {
        const p = initialProgress?.clearedStages;
        return Array.isArray(p) && p.length === 5 ? p.map(Boolean) : [false, false, false, false, false];
    });
    const goldStarCount = initialProgress?.goldStars ?? 0;

    /** Chapter in progress = started but not finished (from chapter_times). Lets map show "Continue" when hero returns mid-chapter. */
    const chapterInProgress = {
        1: !!(chapterTimes?.chapter1?.started_at && !chapterTimes?.chapter1?.finished_at),
        2: !!(chapterTimes?.chapter2?.started_at && !chapterTimes?.chapter2?.finished_at),
        3: !!(chapterTimes?.chapter3?.started_at && !chapterTimes?.chapter3?.finished_at),
    };

    /** Button state for stage index (0–4): 0 Locked, 1 Play, 2 Replay, 3 Continue. Stage 1 is always Play or Replay. */
    function getStageButtonState(stageIndex) {
        if (clearedStages[stageIndex]) return 2; // Replay
        if (stageIndex === 0) return 1;          // Stage 1 (prologue) always Play until cleared
        // Stages 1,2,3 (castle, woods, gate): show Continue if that chapter is in progress
        if (stageIndex === 1 && chapterInProgress[1]) return 3;
        if (stageIndex === 2 && chapterInProgress[2]) return 3;
        if (stageIndex === 3 && chapterInProgress[3]) return 3;
        return clearedStages[stageIndex - 1] ? 1 : 0; // Play if previous cleared, else Locked
    }

    function getStageButtonImage(stageIndex) {
        const s = getStageButtonState(stageIndex);
        return BUTTON_IMGS[s === 3 ? 1 : s]; // Continue uses play icon
    }
    function getStageButtonAlt(stageIndex) {
        const s = getStageButtonState(stageIndex);
        return s === 0 ? 'Locked' : s === 1 ? 'Play' : s === 2 ? 'Replay' : 'Continue';
    }

    function onStageButtonClick(stageIndex) {
        const state = getStageButtonState(stageIndex);
        // Continue (3): go to first page of that chapter so hero can resume
        if (state === 3) {
            if (stageIndex === 1) { router.visit(route('mainplay.kingdom1')); return; }
            if (stageIndex === 2) { router.visit(route('mainplay.whisper1')); return; }
            if (stageIndex === 3) { router.visit(route('mainplay.clouds1')); return; }
        }
        // Stage 1 (Prologue): both Play and Replay go to the Prologue intro page
        if (stageIndex === 0 && (state === 1 || state === 2)) {
            router.visit(route('mainplay.prologue-intro'));
            return;
        }
        // Stage 2 (Castle/Chapter 1): Play/Replay → Chapter 1 intro
        if (stageIndex === 1 && (state === 1 || state === 2)) {
            router.visit(route('mainplay.chapter1-intro'));
            return;
        }
        // Stage 3 (Woods/Chapter 2): Play/Replay → Chapter 2 intro
        if (stageIndex === 2 && (state === 1 || state === 2)) {
            router.visit(route('mainplay.chapter2-intro'));
            return;
        }
        // Stage 4 (Clouds/Chapter 3): Play/Replay → Chapter 3 intro
        if (stageIndex === 3 && (state === 1 || state === 2)) {
            router.visit(route('mainplay.chapter3-intro'));
            return;
        }
        // Stage 5 (Epilogue): both Play and Replay go to Epilogue intro
        if (stageIndex === 4 && (state === 1 || state === 2)) {
            router.visit(route('mainplay.epilogue-intro'));
            return;
        }
        if (state !== 1) return; // for other stages, only Play clears
        setClearedStages((prev) => {
            const next = [...prev];
            next[stageIndex] = true;
            return next;
        });
    }

    function openChapterTiming(chapterNumber) {
        if (!user || user.role !== 'guardian') return;
        const map = {
            1: { key: 'chapter1', label: 'Chapter 1 – Orderliness & Cleanliness' },
            2: { key: 'chapter2', label: 'Chapter 2 – Kindness & Empathy' },
            3: { key: 'chapter3', label: 'Chapter 3 – Politeness & Gratitude' },
        };
        const info = map[chapterNumber];
        if (!info) return;
        setChapterInfo(info);
    }

    function startHelpFlow() {
        setActiveMainTab('help');
        setHelpPhase('left');
        // Stop any in-progress voice before starting help narration
        stopVoice?.();
        const page1 = AUDIO.help?.page1;
        const page2 = AUDIO.help?.page2;
        if (page1 && playVoice) {
            playVoice(page1, 1, () => {
                setHelpPhase('both');
                if (page2 && playVoice) {
                    playVoice(page2);
                }
            });
        } else {
            setHelpPhase('both');
        }
    }

    useEffect(() => {
        stopBGM?.();
    }, [stopBGM]);

    useEffect(() => {
        const onResize = () => setScale(getLayoutScale());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Sync clearedStages when initialProgress changes (e.g. after returning from completion screen)
    useEffect(() => {
        const p = initialProgress?.clearedStages;
        if (Array.isArray(p) && p.length === 5) {
            setClearedStages(p.map(Boolean));
        }
    }, [initialProgress?.clearedStages]);

    function toggleProfileExtension() {
        if (showProfileExtension && !profileClosing) {
            setProfileClosing(true);
            return;
        }
        if (!showProfileExtension) {
            setShowProfileExtension(true);
        }
    }

    useEffect(() => {
        if (!profileClosing) return;
        const t = setTimeout(() => {
            setShowProfileExtension(false);
            setProfileClosing(false);
        }, PROFILE_BOUNCE_OUT_MS);
        return () => clearTimeout(t);
    }, [profileClosing]);

    useEffect(() => {
        if (!woodenSignClosing) return;
        const t = setTimeout(() => {
            setShowWoodenSign(false);
            setWoodenSignClosing(false);
        }, WOODEN_SIGN_SLIDE_DOWN_MS);
        return () => clearTimeout(t);
    }, [woodenSignClosing]);

    useEffect(() => {
        if (!settingsBoardClosing) return;
        const t = setTimeout(() => {
            setShowSettingsBoard(false);
            setSettingsBoardClosing(false);
        }, 250);
        return () => clearTimeout(t);
    }, [settingsBoardClosing]);

    useEffect(() => {
        if (!progressBoardClosing) return;
        const t = setTimeout(() => {
            setShowProgressBoard(false);
            setProgressBoardClosing(false);
        }, 250);
        return () => clearTimeout(t);
    }, [progressBoardClosing]);

    return (
        <>
            <Head title="Main Play" />
            {/* Settings board popup – appears when Settings is clicked */}
            {(showSettingsBoard || settingsBoardClosing) && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                    aria-label="Settings"
                >
                    <button
                        type="button"
                        onClick={() => setSettingsBoardClosing(true)}
                        className="absolute inset-0 bg-black/50 cursor-pointer"
                        aria-label="Close settings"
                    />
                    <div className={`relative z-10 max-w-6xl w-full ${settingsBoardClosing ? 'animate-bounce-out' : 'animate-bounce-in'}`}>
                        <img
                            src="/assets/img/settingboard.webp"
                            alt="Settings"
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none select-none"
                        />
                        <button
                            type="button"
                            onClick={() => setSettingsBoardClosing(true)}
                            className="absolute top-8 right-8 sm:top-10 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-700 bg-amber-100/90 flex items-center justify-center hover:bg-amber-200/90 transition-colors cursor-pointer"
                            aria-label="Close settings"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Settings content – overlaid on the board */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 sm:gap-10 pt-[18%] pb-[20%] px-[12%] pointer-events-none">
                            <div className="pointer-events-auto flex flex-col items-center gap-8 w-full max-w-md">
                                {/* Screen Brightness – vertical slider with sun icon */}
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <label className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap leading-tight animate-glow-blink [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                        Screen Brightness
                                    </label>
                                    <div className="settings-slider-wrap mt-2 w-full" style={{ ['--slider-complete']: (screenBrightness - 50) / 50 }}>
                                        <div className="settings-slider-track">
                                            <div className="settings-slider-progress" />
                                        </div>
                                        <span className="settings-slider-percent cartoon-thin text-gray-800 text-xl font-bold drop-shadow">{screenBrightness}%</span>
                                        <input
                                            type="range"
                                            id="brightness"
                                            min="50"
                                            max="100"
                                            value={screenBrightness}
                                            onChange={(e) => updateSettings({ screenBrightness: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                {/* Text Size – vertical slider with font icon */}
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <label className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap leading-tight animate-glow-blink [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                        Text Size
                                    </label>
                                    <div className="settings-slider-wrap mt-2 w-full" style={{ ['--slider-complete']: (textSize - 80) / 120 }}>
                                        <div className="settings-slider-track">
                                            <div className="settings-slider-progress" />
                                        </div>
                                        <span className="settings-slider-percent cartoon-thin text-gray-800 text-xl font-bold drop-shadow">{textSize}%</span>
                                        <input
                                            type="range"
                                            id="text-size"
                                            min="80"
                                            max="200"
                                            value={textSize}
                                            onChange={(e) => updateSettings({ textSize: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                {/* Volume */}
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <label className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap leading-tight animate-glow-blink [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                        Volume
                                    </label>
                                    <div className="settings-slider-wrap mt-2 w-full" style={{ ['--slider-complete']: volume / 100 }}>
                                        <div className="settings-slider-track">
                                            <div className="settings-slider-progress" />
                                        </div>
                                        <span className="settings-slider-percent cartoon-thin text-gray-800 text-xl font-bold drop-shadow">{volume}%</span>
                                        <input
                                            type="range"
                                            id="volume"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={(e) => updateVolume(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                {/* Mute */}
                                <div className="flex items-center gap-3">
                                    <label className="cartoon-thin text-white text-xl sm:text-2xl font-bold">Mute</label>
                                    <button
                                        type="button"
                                        onClick={() => updateMuted(!muted)}
                                        className={`w-14 h-8 rounded-full transition-colors ${muted ? 'bg-amber-600' : 'bg-amber-200'}`}
                                        aria-pressed={muted}
                                    >
                                        <span className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${muted ? 'translate-x-1' : 'translate-x-7'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Progress board popup – appears when Stars tab is clicked */}
            {(showProgressBoard || progressBoardClosing) && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                    aria-label="Progress"
                >
                    <button
                        type="button"
                        onClick={() => setProgressBoardClosing(true)}
                        className="absolute inset-0 bg-black/50 cursor-pointer"
                        aria-label="Close progress"
                    />
                    <div className={`relative z-10 max-w-6xl w-full ${progressBoardClosing ? 'animate-bounce-out' : 'animate-bounce-in'}`}>
                        <img
                            src="/assets/img/settingboard.webp"
                            alt="Progress"
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none select-none"
                        />
                        <button
                            type="button"
                            onClick={() => setProgressBoardClosing(true)}
                            className="absolute top-8 right-8 sm:top-10 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-700 bg-amber-100/90 flex items-center justify-center hover:bg-amber-200/90 transition-colors cursor-pointer"
                            aria-label="Close progress"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Progress content – overlaid on the board */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 pt-[12%] pb-[18%] px-[10%] pointer-events-none">
                            <div className="pointer-events-auto flex flex-col items-stretch gap-4 sm:gap-5 w-full max-w-2xl">
                                {[
                                    { title: 'Orderliness & Cleanliness', desc: 'Help the King sort the trash from the toys to tidy up the castle and make the King smile again.', isGold: goldStarCount >= 1 },
                                    { title: 'Kindness and Empathy', desc: 'Be brave and help the Blue Wolf pull out a painful thorn to make a new friend.', isGold: goldStarCount >= 2 },
                                    { title: 'Politeness and Respect', desc: "The giant Stone Guardian is fast asleep and won't open for just anyone! Use the magic words 'Please' and 'Thank You' to wake him up and unlock the path home.", isGold: goldStarCount >= 3 },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white border border-amber-300 shadow-lg">
                                        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                                            {item.isGold ? (
                                                <img src="/assets/img/Star.webp" alt="" className="w-full h-full object-contain [filter:drop-shadow(0_0_2px_#fef08a)_drop-shadow(0_0_8px_#facc15)_drop-shadow(0_0_16px_#eab308)]" aria-hidden />
                                            ) : (
                                                <img src="/assets/img/Graystar.webp" alt="" className="w-full h-full object-contain [filter:drop-shadow(0_0_2px_#1f2937)]" aria-hidden />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="cartoon-thin text-black text-xl sm:text-2xl font-bold leading-tight mb-1">{item.title}</div>
                                            <div className="cartoon-thin text-black text-base sm:text-lg font-bold leading-relaxed">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Guardian chapter timing popup – appears when guardian clicks a map illustration */}
            {user?.role === 'guardian' && chapterTimes && chapterInfo && (
                <div
                    className="fixed inset-0 z-[65] flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                    aria-label="Chapter timing"
                >
                    <button
                        type="button"
                        onClick={() => setChapterInfo(null)}
                        className="absolute inset-0 bg-black/50 cursor-pointer"
                        aria-label="Close chapter timing"
                    />
                    <div className="relative z-10 max-w-4xl w-full animate-bounce-in">
                        <img
                            src="/assets/img/settingboard.webp"
                            alt="Chapter timing"
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none select-none"
                        />
                        <button
                            type="button"
                            onClick={() => setChapterInfo(null)}
                            className="absolute top-8 right-8 sm:top-10 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-700 bg-amber-100/90 flex items-center justify-center hover:bg-amber-200/90 transition-colors cursor-pointer"
                            aria-label="Close chapter timing"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {(() => {
                            const key = chapterInfo.key;
                            const data = chapterTimes?.[key] || {};
                            const startedAt = data?.started_at ? new Date(data.started_at) : null;
                            const finishedAt = data?.finished_at ? new Date(data.finished_at) : null;
                            const format = (d) =>
                                d
                                    ? d.toLocaleString(undefined, {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                      })
                                    : 'Not recorded yet';
                            let durationText = 'Not available yet';
                            if (startedAt && finishedAt && finishedAt > startedAt) {
                                const ms = finishedAt.getTime() - startedAt.getTime();
                                const totalSeconds = Math.round(ms / 1000);
                                const minutes = Math.floor(totalSeconds / 60);
                                const seconds = totalSeconds % 60;
                                durationText =
                                    minutes > 0
                                        ? `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
                                        : `${seconds} second${seconds !== 1 ? 's' : ''}`;
                            }
                            return (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 pt-[16%] pb-[18%] px-[12%] pointer-events-none">
                                    <div className="pointer-events-auto w-full max-w-2xl flex flex-col items-stretch gap-3 sm:gap-4">
                                        <div className="cartoon-thin text-amber-900 text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-2">
                                            {chapterInfo.label}
                                        </div>
                                        <div className="rounded-2xl bg-white/95 border border-amber-300 shadow-lg p-4 sm:p-5 flex flex-col gap-2">
                                            <div className="cartoon-thin text-gray-900 text-lg sm:text-xl font-bold">
                                                Started:
                                                <span className="ml-2 font-normal">{format(startedAt)}</span>
                                            </div>
                                            <div className="cartoon-thin text-gray-900 text-lg sm:text-xl font-bold">
                                                Finished:
                                                <span className="ml-2 font-normal">{format(finishedAt)}</span>
                                            </div>
                                            <div className="cartoon-thin text-gray-900 text-lg sm:text-xl font-bold">
                                                Total time:
                                                <span className="ml-2 font-normal">{durationText}</span>
                                            </div>
                                        </div>
                                        <p className="cartoon-thin text-gray-800 text-sm sm:text-base text-center">
                                            These times are based on the most recent run of this chapter by your hero.
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
            <div className="relative w-full h-screen overflow-hidden">
                <img
                    src="/assets/img/LP_BG.webp"
                    srcSet="/assets/img/LP_BG-960w.webp 960w, /assets/img/LP_BG-1920w.webp 1920w"
                    sizes="100vw"
                    alt=""
                    fetchpriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    aria-hidden
                />
                {/* Fixed-size layout canvas – scaled to fit viewport */}
                <div
                    className="absolute left-1/2 top-1/2 origin-center flex flex-col"
                    style={{
                        width: LAYOUT_REF_WIDTH,
                        height: LAYOUT_REF_HEIGHT,
                        transform: `translate(-50%, -50%) scale(${scale})`,
                    }}
                >
                    {/* Nav bar – top of layout */}
                    <nav
                        role="navigation"
                        aria-label="Main navigation"
                        className="main-nav relative z-30 flex-shrink-0 flex items-center justify-center gap-3 sm:gap-4 w-full pt-0 pb-2 sm:pb-3 px-2 sm:px-4 min-h-[148px] sm:min-h-[164px] -mt-1 animate-slide-down-in"
                    >
                    {(tabsStatic.map((tab) => {
                        if (tab.id === 'stars') return { ...tab, content: <StarsTabContent goldStarCount={goldStarCount} /> };
                        if (tab.id === 'menu' && (showWoodenSign || woodenSignClosing)) {
                            return { ...tab, content: <Undo2 className="w-[5.5rem] h-[5.5rem] sm:w-[6rem] sm:h-[6rem] text-white animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]" aria-hidden /> };
                        }
                        return tab;
                    })).map((tab) => {
                        const isButtonTab = tab.id === 'menu' || tab.id === 'profile' || tab.id === 'map' || tab.id === 'stars' || tab.id === 'help';
                        const Wrapper = isButtonTab ? 'button' : 'div';
                        const baseClass = 'relative w-[185px] h-[148px] sm:w-[205px] sm:h-[164px] flex-shrink-0 flex items-center justify-center';
                        const menuLeftClass = tab.id === 'menu' ? MENU_TAB_TRANSLATE_LEFT : '';
                        const menuStyle = tab.id === 'menu' ? { transform: 'translateX(-15rem)' } : (tab.id !== 'menu' ? { transform: `translateX(${OTHER_TABS_TRANSLATE_RIGHT})` } : undefined);
                        const wrapperProps = isButtonTab
                            ? {
                                  type: 'button',
                                  'aria-label': tab.label || tab.id,
                                  title: tab.label || tab.id,
                                  style: { ...menuStyle, outline: 'none', boxShadow: 'none', border: 'none', WebkitTapHighlightColor: 'transparent' },
                                  className: baseClass + menuLeftClass + ' wood-tab-btn group transition-all duration-200 rounded',
                                  ...(tab.id === 'profile' ? { onClick: toggleProfileExtension } : {}),
                                  ...(tab.id === 'menu'
                                      ? {
                                            onClick: () => {
                                                if (showWoodenSign && !woodenSignClosing) setWoodenSignClosing(true);
                                                else if (!showWoodenSign) setShowWoodenSign(true);
                                            },
                                        }
                                      : {}),
                                  ...(tab.id === 'stars' ? { onClick: () => setShowProgressBoard(true) } : {}),
                                  ...(tab.id === 'help'
                                      ? {
                                            onClick: () => {
                                                startHelpFlow();
                                            },
                                        }
                                      : {}),
                                  ...(tab.id === 'map'
                                      ? {
                                            onClick: () => {
                                                setActiveMainTab('map');
                                                setHelpPhase('hidden');
                                                stopVoice?.();
                                            },
                                        }
                                      : {}),
                              }
                            : { style: menuStyle, className: baseClass + menuLeftClass + ' group transition-all duration-200' };
                        return (
                            <Wrapper key={tab.id} {...wrapperProps}>
                                <div className="relative w-full h-full transition-transform duration-200 origin-center group-hover:scale-105">
                                    <img
                                        src="/assets/img/tabframe.webp"
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="absolute inset-0 w-full h-full object-contain object-center drop-shadow-md pointer-events-none select-none transition-all duration-200 group-hover:brightness-110 group-hover:drop-shadow-xl"
                                        aria-hidden
                                    />
                                    <div className="relative z-10 flex items-center justify-center w-full h-full p-2 sm:p-3 transition-transform duration-200 origin-center group-hover:scale-[0.952] opacity-0 animate-fade-in-after-slide drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                                        {tab.content}
                                    </div>
                                </div>
                            </Wrapper>
                        );
                    })}
                    </nav>

                    {/* Book area – fills remaining space within layout */}
                    <div className="relative flex-1 min-h-0 w-full flex justify-center items-start -mt-36">
                        <div className="relative w-full h-full flex justify-center items-start">
                            {/* Open book background – full-res so it fills the center at full size */}
                            <img
                                src="/assets/img/openbook.webp"
                                alt="Story book opened"
                                fetchpriority="high"
                                decoding="async"
                                className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-2xl pointer-events-none select-none block"
                            />

                            {activeMainTab === 'map' && (
                                <>
                                    {/* Stage 1 – prologue left (B → C when cleared) */}
                                    <div
                                        className="absolute z-20 box-border cursor-pointer"
                                        style={{
                                            left: 90,
                                            top: 100,
                                            width: 380,
                                            height: 300,
                                            minWidth: 200,
                                            minHeight: 160,
                                        }}
                                    >
                                        <img
                                            src={clearedStages[0] ? STAGE_ILLUSTRATIONS[0].C : STAGE_ILLUSTRATIONS[0].B}
                                            alt="Stage 1 Prologue"
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-contain object-left-top select-none block"
                                        />
                                        <img
                                            src={getStageButtonImage(0)}
                                            loading="lazy"
                                            decoding="async"
                                            alt={getStageButtonAlt(0)}
                                            className="absolute -bottom-[68px] left-[38%] -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStageButtonClick(0);
                                            }}
                                            aria-hidden
                                        />
                                    </div>

                                    {/* Stage 5 – prologue right (B → C when cleared) */}
                                    <div
                                        className="absolute z-20 box-border cursor-pointer"
                                        style={{
                                            right: 90,
                                            top: 100,
                                            width: 380,
                                            height: 300,
                                            minWidth: 200,
                                            minHeight: 160,
                                        }}
                                    >
                                        <img
                                            src={clearedStages[4] ? STAGE_ILLUSTRATIONS[4].C : STAGE_ILLUSTRATIONS[4].B}
                                            alt="Stage 5 Prologue"
                                            loading="lazy"
                                            decoding="async"
                                            className={`w-full h-full object-contain object-right-top select-none block ${!clearedStages[4] ? '[filter:brightness(0.5)_contrast(1.35)]' : ''}`}
                                        />
                                        <img
                                            src={getStageButtonImage(4)}
                                            loading="lazy"
                                            decoding="async"
                                            alt={getStageButtonAlt(4)}
                                            className="absolute -bottom-[68px] left-[62%] -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStageButtonClick(4);
                                            }}
                                            aria-hidden
                                        />
                                    </div>

                                    {/* Stage 2 – castle (B → C when cleared) */}
                                    <div
                                        className="absolute z-20 box-border cursor-pointer"
                                        style={{
                                            left: 170,
                                            bottom: 60,
                                            width: 460,
                                            height: 400,
                                            minWidth: 260,
                                            minHeight: 220,
                                        }}
                                        onClick={user?.role === 'guardian' ? () => openChapterTiming(1) : undefined}
                                    >
                                        <img
                                            src={clearedStages[1] ? STAGE_ILLUSTRATIONS[1].C : STAGE_ILLUSTRATIONS[1].B}
                                            alt="Stage 2 Castle"
                                            loading="lazy"
                                            decoding="async"
                                            className={`w-full h-full object-contain object-center select-none block ${!clearedStages[1] ? '[filter:brightness(0.6)_contrast(1.3)]' : ''}`}
                                        />
                                        <img
                                            src={getStageButtonImage(1)}
                                            loading="lazy"
                                            decoding="async"
                                            alt={getStageButtonAlt(1)}
                                            className="absolute -bottom-[68px] left-1/2 -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStageButtonClick(1);
                                            }}
                                            aria-hidden
                                        />
                                    </div>

                                    {/* Stage 4 – gate (B → C when cleared) */}
                                    <div
                                        className="absolute z-20 box-border cursor-pointer"
                                        style={{
                                            right: 170,
                                            bottom: 60,
                                            width: 460,
                                            height: 400,
                                            minWidth: 260,
                                            minHeight: 220,
                                        }}
                                        onClick={user?.role === 'guardian' ? () => openChapterTiming(3) : undefined}
                                    >
                                        <img
                                            src={clearedStages[3] ? STAGE_ILLUSTRATIONS[3].C : STAGE_ILLUSTRATIONS[3].B}
                                            alt="Stage 4 Gate"
                                            loading="lazy"
                                            decoding="async"
                                            className={`w-full h-full object-contain object-center select-none block ${!clearedStages[3] ? '[filter:brightness(0.4)_contrast(1.35)]' : ''}`}
                                        />
                                        <img
                                            src={getStageButtonImage(3)}
                                            loading="lazy"
                                            decoding="async"
                                            alt={getStageButtonAlt(3)}
                                            className="absolute -bottom-[68px] left-1/2 -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStageButtonClick(3);
                                            }}
                                            aria-hidden
                                        />
                                    </div>

                                    {/* Stage 3 – woods (B → C when cleared) */}
                                    <div
                                        className="absolute z-20 box-border cursor-pointer"
                                        style={{
                                            left: 570,
                                            top: 50,
                                            width: 460,
                                            height: 400,
                                            minWidth: 260,
                                            minHeight: 220,
                                        }}
                                        onClick={user?.role === 'guardian' ? () => openChapterTiming(2) : undefined}
                                    >
                                        <img
                                            src={clearedStages[2] ? STAGE_ILLUSTRATIONS[2].C : STAGE_ILLUSTRATIONS[2].B}
                                            alt="Stage 3 Woods"
                                            loading="lazy"
                                            decoding="async"
                                            className={`w-full h-full object-contain object-center select-none block ${!clearedStages[2] ? '[filter:brightness(0.55)_contrast(1.3)]' : ''}`}
                                        />
                                        <img
                                            src={getStageButtonImage(2)}
                                            loading="lazy"
                                            decoding="async"
                                            alt={getStageButtonAlt(2)}
                                            className="absolute -bottom-[68px] left-1/2 -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStageButtonClick(2);
                                            }}
                                            aria-hidden
                                        />
                                    </div>
                                </>
                            )}

                            {/* Wooden sign – only when Menu is clicked; slide up then bounce, slide down on close */}
                            {(showWoodenSign || woodenSignClosing) && (
                            <div className={`group absolute -left-[20%] bottom-0 w-[100%] max-w-[1100px] z-[50] origin-left-bottom transition-transform duration-200 hover:scale-105 ${woodenSignClosing ? 'animate-slide-down-out' : 'animate-slide-up-then-bounce'}`}>
                                <img
                                    src="/assets/img/woodboard2.webp"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-auto object-contain object-left-bottom drop-shadow-lg pointer-events-none select-none transition-all duration-200 group-hover:brightness-110 group-hover:drop-shadow-xl"
                                    aria-hidden
                                />
                                <div className="absolute top-[12%] bottom-[42%] left-0 right-0 flex flex-col items-center justify-center gap-6 sm:gap-8 pointer-events-none">
                                    <button
                                        type="button"
                                        onClick={() => setShowSettingsBoard(true)}
                                        className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap leading-tight animate-glow-blink [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)] pointer-events-auto cursor-pointer bg-transparent border-none outline-none py-1 px-2 rounded transition-all duration-200 hover:scale-110 hover:brightness-125 hover:[filter:drop-shadow(0_0_6px_#fef08a)_drop-shadow(0_0_16px_#facc15)_drop-shadow(0_0_28px_#eab308)]"
                                        aria-label="Settings"
                                    >
                                        Settings
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.post(route('logout'))}
                                        className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap leading-tight animate-glow-blink [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)] pointer-events-auto cursor-pointer bg-transparent border-none outline-none py-1 px-2 rounded transition-all duration-200 hover:scale-110 hover:brightness-125 hover:[filter:drop-shadow(0_0_6px_#fef08a)_drop-shadow(0_0_16px_#facc15)_drop-shadow(0_0_28px_#eab308)]"
                                        aria-label="Sign out"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                            )}

                            {/* Content overlay - book pages only; z-25 so profile extension sits above woods/castle/gate/prologue (z-20); nav stays z-30; pointer-events-none so hover reaches illustrations below */}
                            <div className="absolute inset-y-[10%] inset-x-[10%] flex flex-col pointer-events-none z-[25]">
                                <div className="flex flex-1 min-h-0 w-full">
                                    {/* Left page */}
                                    <div className="w-1/2 h-full relative flex items-center justify-center px-[5%] -ml-4 md:-ml-6">
                                        {activeMainTab === 'help' && helpPhase !== 'hidden' ? (
                                            <div className="flex flex-col gap-8 md:gap-10 items-start justify-center w-full max-w-md pointer-events-auto animate-fade-in-soft">
                                                <div className="flex flex-col items-start gap-2">
                                                    <div className="text-amber-800 text-2xl sm:text-3xl font-extrabold tracking-wide">
                                                        Welcome to
                                                    </div>
                                                    <img
                                                        src="/assets/img/title.webp"
                                                        alt="Stellar Steps"
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-[220px] sm:w-[260px] drop-shadow-md"
                                                    />
                                                </div>
                                                {/* Leo intro */}
                                                <div className="flex items-center gap-5 sm:gap-6">
                                                    <img
                                                        src="/assets/img/Leo0.webp"
                                                        alt="Leo"
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-40 sm:w-44 md:w-48 h-auto object-contain pointer-events-none -ml-2 sm:-ml-4"
                                                    />
                                                    <div className="flex flex-col text-left">
                                                        <div className="rounded-sans text-amber-800 text-2xl sm:text-3xl md:text-4xl font-extrabold">
                                                            This is Leo
                                                        </div>
                                                        <div className="text-black text-xl sm:text-2xl font-bold leading-relaxed">
                                                            He is in Grade 1.
                                                            <br />
                                                            He loves adventures.
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Marky intro */}
                                                <div className="flex items-center gap-5 sm:gap-6">
                                                    <img
                                                        src="/assets/img/Marky1.webp"
                                                        alt="Marky"
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-36 sm:w-40 md:w-44 h-auto object-contain pointer-events-none -ml-2 sm:-ml-4"
                                                    />
                                                    <div className="flex flex-col text-left">
                                                        <div className="rounded-sans text-amber-800 text-2xl sm:text-3xl md:text-4xl font-extrabold">
                                                            This is Marky
                                                        </div>
                                                        <div className="text-black text-xl sm:text-2xl font-bold leading-relaxed">
                                                            He guides Leo and
                                                            <br />
                                                            helps explain things.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-8 md:gap-10 items-center justify-center w-full max-w-full">
                                                {/* Left page content placeholder */}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right page */}
                                    <div className="w-1/2 h-full relative overflow-visible flex items-center justify-center">
                                        <div className="h-full w-[92%] flex flex-col items-center justify-center overflow-visible pt-[2%] pb-[2%]">
                                            {activeMainTab === 'help' && helpPhase === 'both' ? (
                                                <div className="w-full max-w-md flex flex-col items-start justify-start pointer-events-auto px-[4%] self-center translate-x-[6%] animate-fade-in-soft">
                                                    <div className="rounded-sans text-amber-800 text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-wide">
                                                        OUR STORY
                                                    </div>
                                                    <div className="space-y-2 text-amber-900 text-lg sm:text-xl font-bold leading-relaxed max-w-md text-justify">
                                                        <p>Inside the book,</p>
                                                        <p>Some places are broken.</p>
                                                        <p>Some places are messy.</p>
                                                        <p>Some friends need help.</p>
                                                        <p>Leo and Marky go on an adventure.</p>
                                                        <p>They fix the story together.</p>
                                                        <p className="mt-4 rounded-sans text-amber-800 font-bold">
                                                            But they need YOU!
                                                        </p>
                                                        <p className="mt-2">
                                                            Every good choice earns a star.
                                                        </p>
                                                        <p>Stars help fix the story!</p>
                                                        <p className="mt-4 rounded-sans font-bold text-amber-800">You help by:</p>
                                                    </div>
                                                    <div className="mt-7 flex items-center gap-6 sm:gap-10">
                                                        {[
                                                            { label: 'cleaning up' },
                                                            { label: 'being kind' },
                                                            { label: 'using polite words' },
                                                        ].map((item) => (
                                                            <div key={item.label} className="flex flex-col items-center gap-2">
                                                                <img
                                                                    src="/assets/img/Star.webp"
                                                                    alt=""
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain [filter:drop-shadow(0_0_2px_#fef08a)_drop-shadow(0_0_8px_#facc15)_drop-shadow(0_0_16px_#eab308)]"
                                                                    aria-hidden
                                                                />
                                                                <div className="text-amber-900 text-sm sm:text-base font-bold text-center whitespace-nowrap">
                                                                    {item.label}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-6">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveMainTab('map')}
                                                            className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-sm sm:text-base md:text-lg font-bold shadow-md border-2 border-amber-700 tracking-wide"
                                                        >
                                                            Let&apos;s begin the adventure!
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Profile extension – wooden plaque (only when Profile tab is clicked; bounce-out on close) */}
                                                    {(showProfileExtension || profileClosing) && (
                                                    <div className={`group relative z-[30] pointer-events-auto flex flex-col items-center justify-center w-full max-w-5xl -mt-[14rem] sm:-mt-[16rem] ml-[32rem] sm:ml-[36rem] transition-transform duration-200 origin-center hover:scale-[1.01] cursor-pointer ${profileClosing ? 'animate-bounce-out' : 'animate-bounce-in'}`}>
                                                        <div className="relative w-full flex flex-col items-center p-16 sm:p-20 min-h-[16rem] sm:min-h-[20rem]">
                                                            <img
                                                                src="/assets/img/tabframe.webp"
                                                                alt=""
                                                                loading="lazy"
                                                                decoding="async"
                                                                className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none select-none opacity-100 transition-all duration-200 group-hover:brightness-105 group-hover:drop-shadow-lg"
                                                                aria-hidden
                                                            />
                                                            <div className="relative z-10 flex flex-col items-center gap-2 text-center w-full px-4 py-6">
                                                                <span className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                                                    {user?.name ?? 'Guest'}
                                                                </span>
                                                                {user?.role === 'hero' && user?.hero_code ? (
                                                                    <span className="cartoon-thin text-white text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                                                        Hero Code: {user.hero_code}
                                                                    </span>
                                                                ) : user?.role === 'guardian' ? (
                                                                    <span className="cartoon-thin text-white text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                                                        {user?.linked_hero_name ? `Guardian of ${user.linked_hero_name}` : 'Guardian'}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
