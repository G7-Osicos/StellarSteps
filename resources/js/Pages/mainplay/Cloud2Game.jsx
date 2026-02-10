import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const CLOUD_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/cloud.PNG.webp';
const ROCK_PLATFORM_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/rock platform.webp';
const BAG_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Bag Icon.webp';
const MARKY_IMG = '/assets/img/whisperingwoods/Marky4-right.webp';

const WIN_SCORE = 10;
const MAX_LIVES = 3;
const IMG_GAME_OVER_X = '/assets/img/X.png.webp';
const GAME_OVER_X_DURATION_MS = 2000;

function Heart({ filled, className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

// Generate a row: 3 objects = 2 rocks + 1 cloud in random order
function generateRow() {
    const row = ['rock', 'rock', 'cloud'];
    for (let i = row.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [row[i], row[j]] = [row[j], row[i]];
    }
    return row;
}

// Center of each slot in a 3-column grid
const ROW_LEFT_PERCENT = [16.67, 50, 83.33];

// Vertical offset per row: lower = bag sits higher on the rock
const ROW_TOP_OFFSET = 10;

// Initial platforms: upper, middle, lower (bag starts on lower center)
const INITIAL_PLATFORMS = [
    generateRow(),
    generateRow(),
    ['rock', 'rock', 'cloud'], // lower - ensure center rock for start
];

function PlatformRow({ row, platformTypes }) {
    return (
        <div className="h-[33.33%] min-h-0 grid grid-cols-3 place-items-center relative shrink-0">
            {platformTypes.map((type, i) =>
                type === 'rock' ? (
                    <img
                        key={i}
                        src={encodeURI(ROCK_PLATFORM_IMG)}
                        alt=""
                        className="w-[min(44vw,380px)] h-auto object-contain object-bottom pointer-events-none"
                    />
                ) : (
                    <img
                        key={i}
                        src={encodeURI(CLOUD_IMG)}
                        alt=""
                        className="w-[min(36vw,320px)] h-auto object-contain pointer-events-none"
                    />
                )
            )}
        </div>
    );
}

export default function Cloud2Game() {
    const { playBGM, stopBGM, playSFX } = useAudio() ?? {};
    const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);
    const [score, setScore] = useState(0);
    const [row, setRow] = useState(2);  // start at lower
    const [pos, setPos] = useState(1);   // start on center rock
    const [isFalling, setIsFalling] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isBouncing, setIsBouncing] = useState(false);
    const [isShifting, setIsShifting] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [jumpArc, setJumpArc] = useState(null);
    const [shiftContent, setShiftContent] = useState(null); // [newUpper, newMiddle, oldUpper, oldMiddle, oldLower] during shift
    const [showInstruction, setShowInstruction] = useState(true);
    const [lives, setLives] = useState(MAX_LIVES);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverShowMenu, setGameOverShowMenu] = useState(false);

    const getNextRow = useCallback((currentRow) => (currentRow - 1 + 3) % 3, []);
    const getRowLen = useCallback((r, plat = platforms) => plat[r]?.length ?? 3, [platforms]);

    const jumpRef = useRef(null);

    useEffect(() => {
        if (AUDIO.cloud2Game?.bgm && playBGM) playBGM(AUDIO.cloud2Game.bgm);
        return () => stopBGM?.();
    }, [playBGM, stopBGM]);

    const jump = useCallback((direction) => {
        if (isFalling || isJumping || isShifting || hasWon || gameOver) return;

        const nextRow = getNextRow(row);
        const currentRowLen = getRowLen(row);
        const nextRowLen = getRowLen(nextRow);
        const scaled = Math.floor((pos + 0.5) * nextRowLen / currentRowLen);
        const nextPos = direction === 'left'
            ? Math.max(0, scaled - 1)
            : Math.min(nextRowLen - 1, scaled + 1);

        const platformType = platforms[nextRow][nextPos];

        const fromLeft = ROW_LEFT_PERCENT[pos];
        const fromTop = row * 33.33 + ROW_TOP_OFFSET;
        const toLeft = ROW_LEFT_PERCENT[nextPos];
        const toTop = nextRow * 33.33 + ROW_TOP_OFFSET;

        setJumpArc({ fromLeft, fromTop, toLeft, toTop });
        setIsJumping(true);

        setTimeout(() => {
            setJumpArc(null);
            setIsJumping(false);
            if (platformType === 'cloud') {
                playSFX?.(AUDIO.sfx?.incorrect);
                const newLives = Math.max(0, lives - 1);
                setLives(newLives);
                if (newLives === 0) setGameOver(true);
                else {
                    setRow(nextRow);
                    setPos(nextPos);
                    setIsFalling(true);
                    setScore(0);
                    setTimeout(() => {
                        setIsFalling(false);
                        setRow(2);
                        setPos(1);
                        setPlatforms([generateRow(), generateRow(), ['rock', 'rock', 'cloud']]);
                    }, 800);
                }
            } else if (nextRow === 0) {
                playSFX?.(AUDIO.sfx?.correct);
                // Bag reached upper section: trigger map shift
                const newUpper = generateRow();
                const newMiddle = generateRow();
                const oldUpper = platforms[0];
                const oldMiddle = platforms[1];
                const oldLower = platforms[2];
                setShiftContent([newUpper, newMiddle, oldUpper, oldMiddle, oldLower]);
                setIsShifting(true);
                setRow(2); // bag will land on lower (was upper)
                setPos(nextPos);
                setScore((s) => {
                    const newScore = s + 1;
                    if (newScore >= WIN_SCORE) setHasWon(true);
                    return newScore;
                });
                setIsBouncing(true);
                setTimeout(() => setIsBouncing(false), 350);
            } else {
                playSFX?.(AUDIO.sfx?.correct);
                setRow(nextRow);
                setPos(nextPos);
                setScore((s) => {
                    const newScore = s + 1;
                    if (newScore >= WIN_SCORE) setHasWon(true);
                    return newScore;
                });
                setIsBouncing(true);
                setTimeout(() => setIsBouncing(false), 350);
            }
        }, 600);
    }, [row, pos, isFalling, isJumping, isShifting, hasWon, gameOver, lives, platforms, getNextRow, getRowLen, playSFX]);
    jumpRef.current = jump;

    // When shift animation completes
    useEffect(() => {
        if (!isShifting || !shiftContent) return;
        const timer = setTimeout(() => {
            setPlatforms([shiftContent[0], shiftContent[1], shiftContent[2]]);
            setShiftContent(null);
            setIsShifting(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [isShifting, shiftContent]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); jumpRef.current?.('left'); }
            if (e.key === 'ArrowRight') { e.preventDefault(); jumpRef.current?.('right'); }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    // When game over: show X first, then after delay show "Try again" menu
    useEffect(() => {
        if (!gameOver) {
            setGameOverShowMenu(false);
            return;
        }
        const t = setTimeout(() => setGameOverShowMenu(true), GAME_OVER_X_DURATION_MS);
        return () => clearTimeout(t);
    }, [gameOver]);

    const displayPlatforms = shiftContent ?? platforms;

    useEffect(() => {
        if (hasWon) {
            const t = setTimeout(() => {
                router.visit(route('mainplay.cloud3'));
            }, 1200);
            return () => clearTimeout(t);
        }
    }, [hasWon]);

    if (hasWon) {
        return (
            <>
                <Head title="Cloud 2 Game - You Win!" />
                <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 flex flex-col items-center justify-center gap-6 px-4 fade-in-soft">
                    <div className="cartoon-thin text-3xl sm:text-4xl font-bold text-center drop-shadow text-white" style={{ WebkitTextStroke: '2px black' }}>
                        You did it! Score: {WIN_SCORE}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Cloud 2 Game - The Gate of Gratitude" />
            <div
                className="fixed inset-0 z-[100] w-full h-full bg-sky-400 flex flex-col select-none overflow-hidden"
                style={{ touchAction: 'manipulation' }}
                tabIndex={0}
                aria-label="Tap left or right to jump"
            >
                <BackToMapButton />
                {/* Lives: 3 hearts */}
                {!showInstruction && !hasWon && !gameOver && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:top-6 z-[120] flex items-center gap-1.5 sm:gap-2" aria-label={`${lives} lives left`}>
                        {Array.from({ length: MAX_LIVES }, (_, i) => (
                            <Heart key={i} filled={i < lives} className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md" />
                        ))}
                    </div>
                )}
                {/* Score */}
                <div
                    className="absolute top-4 left-4 z-[120] cartoon-thin text-4xl sm:text-5xl font-bold"
                    style={{ color: 'white', WebkitTextStroke: '2px black' }}
                >
                    Score: {score}
                </div>

                {/* Platform rows - during shift: 5 rows, translate to animate fall */}
                <div
                    className={`flex-1 flex flex-col min-h-0 w-full overflow-hidden ${isShifting ? 'animate-map-shift' : ''}`}
                >
                    {displayPlatforms.map((platformTypes, i) => (
                        <PlatformRow key={i} row={i} platformTypes={platformTypes} />
                    ))}
                </div>

                {/* Tap zones: left half = jump left, right half = jump right */}
                <div className="absolute inset-0 z-[117] flex">
                    <div className="flex-1 cursor-pointer" onPointerDown={(e) => { e.preventDefault(); jump('left'); }} role="button" tabIndex={0} aria-label="Jump left" />
                    <div className="flex-1 cursor-pointer" onPointerDown={(e) => { e.preventDefault(); jump('right'); }} role="button" tabIndex={0} aria-label="Jump right" />
                </div>

                {/* Instruction overlay: Marky + narration (dismiss to start game) */}
                {showInstruction && (
                    <>
                        <div className="absolute inset-0 bg-white/65 z-[125] pointer-events-auto" aria-hidden />
                        <img
                            src={MARKY_IMG}
                            alt=""
                            loading="eager"
                            decoding="async"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(60vw,400px)] h-auto sm:w-[min(70vw,550px)] object-contain pointer-events-none z-[128]"
                            aria-hidden
                        />
                        <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[130] flex justify-center pointer-events-none">
                            <div className="w-full max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4 pointer-events-auto">
                                <div className="flex-1 min-w-0">
                                    <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                        Direction: Tap left or right to help Leo hop to the next platform and reach the top of the mountain until you score 10!
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                                    onClick={() => setShowInstruction(false)}
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

                {/* Game over: first show X, then "Try again" menu */}
                {gameOver && !gameOverShowMenu && (
                    <div className="absolute inset-0 z-[135] flex items-center justify-center bg-black" aria-hidden>
                        <img
                            src={IMG_GAME_OVER_X}
                            alt=""
                            className="max-w-[min(80vw,400px)] h-auto object-contain fade-in-soft"
                        />
                    </div>
                )}
                {gameOver && gameOverShowMenu && (
                    <div className="absolute inset-0 z-[135] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <p className="text-white text-2xl sm:text-3xl font-bold mb-6">Game Over</p>
                        <p className="text-white/90 text-base sm:text-lg mb-8">You ran out of lives. Try again!</p>
                        <button
                            type="button"
                            onClick={() => router.visit(route('mainplay.cloud2-game'))}
                            className="px-6 py-3 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-semibold border-2 border-white shadow-lg transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Bag - positioned over current platform */}
                <img
                    src={encodeURI(BAG_IMG)}
                    alt="Bag"
                    className={`absolute w-20 h-auto sm:w-28 object-contain pointer-events-none z-[115] ${
                        isFalling ? 'animate-bag-fall' : isShifting ? 'animate-bag-shift-down' : isJumping && jumpArc ? 'animate-bag-jump-arc' : isBouncing ? 'animate-bag-bounce' : ''
                    }`}
                    style={{
                        ...(isJumping && jumpArc ? {
                            '--arc-from-left': `${jumpArc.fromLeft}%`,
                            '--arc-from-top': `${jumpArc.fromTop}%`,
                            '--arc-to-left': `${jumpArc.toLeft}%`,
                            '--arc-to-top': `${jumpArc.toTop}%`,
                            '--arc-mid-left': `${(jumpArc.fromLeft + jumpArc.toLeft) / 2}%`,
                            '--arc-mid-top': `${Math.min(jumpArc.fromTop, jumpArc.toTop) - 35}%`,
                            left: `${jumpArc.fromLeft}%`,
                            top: `${jumpArc.fromTop}%`,
                        } : {
                            left: `${ROW_LEFT_PERCENT[pos]}%`,
                            top: isShifting ? undefined : `${row * 33.33 + ROW_TOP_OFFSET}%`,
                        }),
                        transform: 'translate(-50%, -50%)',
                    }}
                    aria-hidden
                />
            </div>
        </>
    );
}
