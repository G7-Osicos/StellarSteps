import { useState, useRef, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
    const { errors: pageErrors } = usePage().props || {};
    const { playSFX } = useAudio() ?? {};
    const rightPageRef = useRef(null);
    const tapeRef = useRef(null);
    const formRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const tape = tapeRef.current;
        const form = formRef.current;
        if (!tape || !form) return;

        const updateScale = () => {
            // Measure tape container's inner area (accounting for 15% inset padding on each side)
            const tapeW = tape.offsetWidth * 0.7; // 70% of tape width for inner content area (15% inset each side)
            const tapeH = tape.offsetHeight * 0.7; // 70% of tape height for inner content area (15% inset each side)
            const formW = form.scrollWidth || form.offsetWidth;
            const formH = form.scrollHeight || form.offsetHeight;
            if (formW <= 0 || formH <= 0) return;
            const scaleW = tapeW / formW;
            const scaleH = tapeH / formH;
            const s = Math.min(scaleW, scaleH);
            // Scale to fit within tape, allowing larger forms
            setScale(Math.max(s * 0.95, 0.55)); // Scale down to 55% minimum, with 5% buffer
        };

        updateScale();
        const rafId = requestAnimationFrame(() => {
            updateScale();
        });
        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updateScale);
        });
        observer.observe(tape);
        observer.observe(form);

        return () => {
            cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, []);

    const [isLogin, setIsLogin] = useState(false); // true = Log In form, false = Sign Up form
    const [role, setRole] = useState('hero'); // 'hero' (kid) | 'guardian' (parent)
    const [heroName, setHeroName] = useState('');
    const [age, setAge] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [heroCode, setHeroCode] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasFadedIn, setHasFadedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => {
            setTimeout(() => setHasFadedIn(true), 50);
        });
        return () => cancelAnimationFrame(t);
    }, []);

    useEffect(() => {
        if (pageErrors && typeof pageErrors === 'object') {
            const msg = pageErrors.pin || pageErrors.name || pageErrors.hero_code || pageErrors.age || Object.values(pageErrors)[0];
            if (msg) setErrorMessage(typeof msg === 'string' ? msg : msg[0] || 'Something went wrong.');
        }
    }, [pageErrors]);

    const canCreatePin = role === 'hero'
        ? heroName.trim() !== '' && age.trim() !== ''
        : guardianName.trim() !== '' && heroCode.trim() !== '';

    const canEnterPinLogin = role === 'hero'
        ? heroName.trim() !== ''
        : guardianName.trim() !== '' && heroCode.trim() !== '';

    const switchToLogin = () => {
        setIsLogin(true);
        setPin('');
        setConfirmPin('');
        setIsConfirming(false);
        setErrorMessage('');
    };

    const switchToSignup = () => {
        setIsLogin(false);
        setPin('');
        setConfirmPin('');
        setIsConfirming(false);
        setErrorMessage('');
    };

    const selectHero = () => {
        if (AUDIO.sfx?.platformStep && playSFX) {
            playSFX(AUDIO.sfx.platformStep);
        }
        setRole('hero');
        setGuardianName('');
        setHeroCode('');
        setPin('');
        setConfirmPin('');
        setIsConfirming(false);
        setErrorMessage('');
    };

    const selectGuardian = () => {
        if (AUDIO.sfx?.platformStep && playSFX) {
            playSFX(AUDIO.sfx.platformStep);
        }
        setRole('guardian');
        setHeroName('');
        setAge('');
        setPin('');
        setConfirmPin('');
        setIsConfirming(false);
        setErrorMessage('');
    };

    const handlePinClick = (num) => {
        if (isLogin) {
            if (!canEnterPinLogin) return;
            if (pin.length < 4) {
                const newPin = pin + num;
                setPin(newPin);
                setErrorMessage('');
                if (newPin.length === 4) {
                    setErrorMessage('');
                    setIsSubmitting(true);
                    router.post(route('login.stellar'), {
                        ...(role === 'hero'
                            ? { name_or_code: heroName.trim() }
                            : { name: guardianName.trim(), hero_code: heroCode.trim() }
                        ),
                        pin: newPin,
                        role,
                    }, { preserveState: false, onFinish: () => setIsSubmitting(false) });
                }
            }
            return;
        }
        if (!canCreatePin) return;
        if (isConfirming) {
            if (confirmPin.length < 4) {
                const newConfirmPin = confirmPin + num;
                setConfirmPin(newConfirmPin);
                if (newConfirmPin.length === 4) {
                    if (newConfirmPin === pin) {
                        setErrorMessage('');
                        setIsSubmitting(true);
                        if (role === 'hero') {
                            router.post(route('signup.hero'), {
                                name: heroName.trim(),
                                age: age.trim(),
                                pin,
                            }, { preserveState: false, onFinish: () => setIsSubmitting(false) });
                        } else {
                            router.post(route('signup.guardian'), {
                                name: guardianName.trim(),
                                hero_code: heroCode.trim(),
                                pin,
                            }, { preserveState: false, onFinish: () => setIsSubmitting(false) });
                        }
                    } else {
                        setErrorMessage('Wrong PIN');
                        setTimeout(() => {
                            setPin('');
                            setConfirmPin('');
                            setIsConfirming(false);
                            setErrorMessage('');
                        }, 1500);
                    }
                }
            }
        } else {
            if (pin.length < 4) {
                const newPin = pin + num;
                setPin(newPin);
                if (newPin.length === 4) {
                    setIsConfirming(true);
                    setErrorMessage('');
                }
            }
        }
    };

    const handlePinDelete = () => {
        if (isLogin) {
            setPin(pin.slice(0, -1));
            setErrorMessage('');
            return;
        }
        if (isConfirming) {
            setConfirmPin(confirmPin.slice(0, -1));
            setErrorMessage('');
        } else {
            setPin(pin.slice(0, -1));
        }
    };
    return (
        <>
            <Head title={isLogin ? 'Log In' : 'Sign Up'}>
                <link rel="preload" href="/assets/img/LP_BG-960w.webp" as="image" />
            </Head>
            <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-3 relative" style={{ backgroundColor: '#5c4a3d' }}>
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
                <div
                    className={`relative z-10 w-fit max-w-[96vw] max-h-[96vh] flex justify-center items-center transition-opacity duration-500 ease-out ${hasFadedIn ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src="/assets/img/openbook.webp"
                        srcSet="/assets/img/openbook-800w.webp 800w, /assets/img/openbook-1600w.webp 1600w"
                        sizes="(max-width: 768px) 96vw, 90vw"
                        alt="Story book opened"
                        fetchpriority="high"
                        decoding="async"
                        className="max-h-[96vh] max-w-[96vw] w-auto h-auto object-contain drop-shadow-2xl pointer-events-none select-none block"
                    />

                    {/* Content overlay - positioned over the book */}
                    <div className="absolute inset-y-[10%] inset-x-[10%] flex pointer-events-auto">
                        {/* Left Signup - Left page with Hero & Guardian buttons (sized relative to book) */}
                        <div className="w-1/2 h-full relative flex items-center justify-center px-[5%] -ml-4 md:-ml-6">
                            <div className="flex flex-col gap-8 md:gap-10 items-center justify-center w-full max-w-full">
                                <button
                                    type="button"
                                    onClick={selectHero}
                                    className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 w-[70%] sm:w-[72%] md:w-[75%] max-w-[22rem] md:max-w-[26rem]"
                                >
                                    <img
                                        src="/assets/img/herobutton.webp"
                                        alt="I'm a Hero"
                                        loading="lazy"
                                        decoding="async"
                                        className={`w-full h-auto drop-shadow-lg pointer-events-none select-none block transition-all duration-200 ${role === 'guardian' ? 'opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0' : ''}`}
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={selectGuardian}
                                    className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 w-[70%] sm:w-[72%] md:w-[75%] max-w-[22rem] md:max-w-[26rem]"
                                >
                                    <img
                                        src="/assets/img/guardianbutton.webp"
                                        alt="I'm a Guardian"
                                        loading="lazy"
                                        decoding="async"
                                        className={`w-full h-auto drop-shadow-lg pointer-events-none select-none block transition-all duration-200 ${role === 'hero' ? 'opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0' : ''}`}
                                    />
                                </button>
                            </div>
                        </div>
                        
                        {/* Right Signup - Right page with taped signup form that scales with book */}
                        <div
                            ref={rightPageRef}
                            className="w-1/2 h-full relative flex items-center justify-center px-0 ml-10 md:ml-14 -mr-4 md:-mr-6 overflow-visible"
                        >
                            {/* Paper tape container - extends beyond right page for bigger look */}
                            <div ref={tapeRef} className="relative w-[125%] h-[125%] min-w-0 min-h-0 flex items-center justify-center -m-[12.5%]">
                                <img
                                    src="/assets/img/papetape.webp"
                                    alt="Sign up note"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full max-w-full max-h-full object-contain pointer-events-none select-none block drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                                />

                                {/* Form overlay, centered inside the tape */}
                                <div className="absolute top-[22%] bottom-[10%] left-[15%] right-[15%] flex items-center justify-center overflow-visible">
                                    <div className="flex flex-col items-center justify-center w-full max-w-full h-full overflow-visible">
                                        <div
                                            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
                                            className="w-full h-full flex-shrink-0 flex items-center justify-center"
                                        >
                                            <div
                                                ref={formRef}
                                                className="flex flex-col items-center justify-center gap-1 text-center cartoon-body w-full h-full overflow-visible bg-transparent"
                                            >
                                                <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-3 sm:pb-4 flex flex-col gap-1 w-full overflow-visible">
                                                    <div className="space-y-1 sm:space-y-2 w-full flex-shrink-0 min-h-0">
                                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide text-center text-black cartoon-body whitespace-nowrap">
                                            {isLogin ? 'Log In' : 'Sign Up'}
                                        </h2>

                                        {isLogin ? (
                                            <>
                                                {role === 'hero' ? (
                                                    <div className="space-y-1 w-full">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Name or Hero Code"
                                                            value={heroName}
                                                            onChange={(e) => {
                                                                setHeroName(e.target.value);
                                                                if (!e.target.value.trim()) {
                                                                    setPin('');
                                                                    setErrorMessage('');
                                                                }
                                                            }}
                                                            className="w-4/5 mx-auto block bg-transparent focus:outline-none focus:ring-0 text-center text-lg sm:text-xl md:text-2xl text-black placeholder-gray-500 cartoon-underline-black relative border-none"
                                                            onFocus={(e) => {
                                                                e.target.dataset.placeholder = e.target.placeholder;
                                                                e.target.placeholder = '';
                                                            }}
                                                            onBlur={(e) => {
                                                                if (!e.target.value) {
                                                                    e.target.placeholder = e.target.dataset.placeholder || '';
                                                                }
                                                            }}
                                                        />
                                                        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center -mt-0.5">Name or Hero Code</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="space-y-1 w-full">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Your Name"
                                                                value={guardianName}
                                                                onChange={(e) => {
                                                                    setGuardianName(e.target.value);
                                                                    if (!e.target.value.trim() || !heroCode.trim()) {
                                                                        setPin('');
                                                                        setErrorMessage('');
                                                                    }
                                                                }}
                                                                className="w-4/5 mx-auto block bg-transparent focus:outline-none focus:ring-0 text-center text-lg sm:text-xl md:text-2xl text-black placeholder-gray-500 cartoon-underline-black relative border-none"
                                                                onFocus={(e) => {
                                                                    e.target.dataset.placeholder = e.target.placeholder;
                                                                    e.target.placeholder = '';
                                                                }}
                                                                onBlur={(e) => {
                                                                    if (!e.target.value) {
                                                                        e.target.placeholder = e.target.dataset.placeholder || '';
                                                                    }
                                                                }}
                                                            />
                                                            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center -mt-0.5">Guardian Name</p>
                                                        </div>
                                                        <div className="space-y-1 w-full">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Hero Code"
                                                                value={heroCode}
                                                                onChange={(e) => {
                                                                    setHeroCode(e.target.value);
                                                                    if (!guardianName.trim() || !e.target.value.trim()) {
                                                                        setPin('');
                                                                        setErrorMessage('');
                                                                    }
                                                                }}
                                                                className="w-4/5 mx-auto block bg-transparent focus:outline-none focus:ring-0 text-center text-lg sm:text-xl md:text-2xl text-black placeholder-gray-500 cartoon-underline-black relative border-none"
                                                                onFocus={(e) => {
                                                                    e.target.dataset.placeholder = e.target.placeholder;
                                                                    e.target.placeholder = '';
                                                                }}
                                                                onBlur={(e) => {
                                                                    if (!e.target.value) {
                                                                        e.target.placeholder = e.target.dataset.placeholder || '';
                                                                    }
                                                                }}
                                                            />
                                                            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center -mt-0.5">Hero Code</p>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : role === 'hero' ? (
                                            <>
                                                <div className="space-y-1 w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your Name"
                                                        value={heroName}
                                                        onChange={(e) => {
                                                            setHeroName(e.target.value);
                                                            if (!e.target.value.trim() || !age.trim()) {
                                                                setPin('');
                                                                setConfirmPin('');
                                                                setIsConfirming(false);
                                                                setErrorMessage('');
                                                            }
                                                        }}
                                                        className="w-4/5 mx-auto block bg-transparent focus:outline-none focus:ring-0 text-center text-lg sm:text-xl md:text-2xl text-black placeholder-gray-500 cartoon-underline-black relative border-none"
                                                        onFocus={(e) => {
                                                            e.target.dataset.placeholder = e.target.placeholder;
                                                            e.target.placeholder = '';
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!e.target.value) {
                                                                e.target.placeholder = e.target.dataset.placeholder || '';
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center -mt-0.5">Hero Name</p>
                                                </div>
                                                <div className="space-y-1 w-full">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="Enter Age"
                                                        value={age}
                                                        onChange={(e) => {
                                                            setAge(e.target.value);
                                                            if (!heroName.trim() || !e.target.value.trim()) {
                                                                setPin('');
                                                                setConfirmPin('');
                                                                setIsConfirming(false);
                                                                setErrorMessage('');
                                                            }
                                                        }}
                                                        className="w-4/5 mx-auto block bg-transparent focus:outline-none focus:ring-0 text-center text-lg sm:text-xl md:text-2xl text-black placeholder-gray-500 cartoon-underline-black relative border-none"
                                                        onFocus={(e) => {
                                                            e.target.dataset.placeholder = e.target.placeholder;
                                                            e.target.placeholder = '';
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!e.target.value) {
                                                                e.target.placeholder = e.target.dataset.placeholder || '';
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center -mt-0.5">Age</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1 w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your Name"
                                                        value={guardianName}
                                                        onChange={(e) => {
                                                            setGuardianName(e.target.value);
                                                            if (!e.target.value.trim() || !heroCode.trim()) {
                                                                setPin('');
                                                                setConfirmPin('');
                                                                setIsConfirming(false);
                                                                setErrorMessage('');
                                                            }
                                                        }}
                                                        className="w-4/5 mx-auto block bg-transparent focus:outline-none focus:ring-0 text-center text-lg sm:text-xl md:text-2xl text-black placeholder-gray-500 cartoon-underline-black relative border-none"
                                                        onFocus={(e) => {
                                                            e.target.dataset.placeholder = e.target.placeholder;
                                                            e.target.placeholder = '';
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!e.target.value) {
                                                                e.target.placeholder = e.target.dataset.placeholder || '';
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center -mt-0.5">Guardian Name</p>
                                                </div>
                                                <div className="space-y-1 w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Hero Code"
                                                        value={heroCode}
                                                        onChange={(e) => {
                                                            setHeroCode(e.target.value);
                                                            if (!guardianName.trim() || !e.target.value.trim()) {
                                                                setPin('');
                                                                setConfirmPin('');
                                                                setIsConfirming(false);
                                                                setErrorMessage('');
                                                            }
                                                        }}
                                                        className="w-4/5 mx-auto block bg-transparent focus:outline-none focus:ring-0 text-center text-lg sm:text-xl md:text-2xl text-black placeholder-gray-500 cartoon-underline-black relative border-none"
                                                        onFocus={(e) => {
                                                            e.target.dataset.placeholder = e.target.placeholder;
                                                            e.target.placeholder = '';
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!e.target.value) {
                                                                e.target.placeholder = e.target.dataset.placeholder || '';
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center -mt-0.5">Hero Code</p>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex flex-col items-center flex-shrink-0">
                                            <p className={`text-lg sm:text-xl md:text-2xl text-black ${errorMessage ? 'text-red-600' : ''}`}>
                                                {isLogin
                                                    ? (errorMessage || (canEnterPinLogin ? 'Enter your PIN' : 'Enter your PIN'))
                                                    : (errorMessage || (canCreatePin 
                                                        ? (isConfirming ? 'Confirm your PIN' : 'Create your PIN')
                                                        : 'Create your PIN'))}
                                            </p>
                                            <div className="mt-0.5 sm:mt-1 w-full flex items-center justify-center">
                                                <p className="pin-digits cartoon-body text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] sm:tracking-[0.3em] text-center text-black">
                                                    {isLogin
                                                        ? (canEnterPinLogin ? (showPin ? pin.padEnd(4, ' ') : '*'.repeat(pin.length || 4)) : '----')
                                                        : (canCreatePin ? (
                                                            showPin 
                                                                ? (isConfirming ? confirmPin.padEnd(4, ' ') : pin.padEnd(4, ' '))
                                                                : '*'.repeat(isConfirming ? confirmPin.length || 4 : pin.length || 4)
                                                        ) : '----')}
                                                </p>
                                            </div>
                                        </div>

                                    {/* Functional keypad */}
                                    <div className="pin-digits cartoon-body w-full grid grid-cols-3 gap-x-0.5 gap-y-0 sm:gap-x-1 sm:gap-y-0.5 text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mx-auto flex-shrink-0 mt-1 sm:mt-1.5 max-w-[14rem] sm:max-w-[17rem]">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => handlePinClick(num.toString())}
                                                disabled={isLogin ? !canEnterPinLogin || pin.length >= 4 : !canCreatePin || (isConfirming ? confirmPin.length >= 4 : pin.length >= 4)}
                                                className="pin-digits cartoon-body min-h-[2.25rem] sm:min-h-[2.5rem] py-1 sm:py-1 hover:scale-110 transform transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-black"
                                            >
                                                {num}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPin(prev => !prev); }}
                                            disabled={isLogin ? !canEnterPinLogin : !canCreatePin}
                                            title={showPin ? 'Hide PIN' : 'Show PIN'}
                                            aria-label={showPin ? 'Hide PIN numbers' : 'Show PIN numbers'}
                                            className="min-h-[2.5rem] sm:min-h-[2.75rem] py-1 flex items-center justify-center text-black hover:scale-110 transform transition-transform duration-150 focus:outline-none text-lg sm:text-xl md:text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {showPin ? (
                                                <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" aria-hidden />
                                            ) : (
                                                <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" aria-hidden />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePinClick('0')}
                                            disabled={isLogin ? !canEnterPinLogin || pin.length >= 4 : !canCreatePin || (isConfirming ? confirmPin.length >= 4 : pin.length >= 4)}
                                            className="pin-digits cartoon-body min-h-[2.25rem] sm:min-h-[2.5rem] py-1 hover:scale-110 transform transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-black"
                                        >
                                            0
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePinDelete}
                                            disabled={isLogin ? !canEnterPinLogin || pin.length === 0 : !canCreatePin || (isConfirming ? confirmPin.length === 0 : pin.length === 0)}
                                            className="min-h-[2.5rem] sm:min-h-[2.75rem] py-1 hover:scale-110 transform transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-black"
                                        >
                                            ⌫
                                        </button>
                                    </div>

                                    <div className="text-center text-base sm:text-lg md:text-xl text-gray-700 mt-0 flex-shrink-0">
                                        {isLogin ? (
                                            <>
                                                Don&apos;t have an account yet?{' '}
                                                <button
                                                    type="button"
                                                    onClick={switchToSignup}
                                                    className="text-amber-600 underline underline-offset-2 text-lg sm:text-xl md:text-2xl font-medium"
                                                >
                                                    Sign Up!
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                Already have an account?{' '}
                                                <button
                                                    type="button"
                                                    onClick={switchToLogin}
                                                    className="text-amber-600 underline underline-offset-2 text-lg sm:text-xl md:text-2xl font-medium"
                                                >
                                                    Log In
                                                </button>
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
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

