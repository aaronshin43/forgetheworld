import React from 'react';
import { useGameStore } from '../store/gameStore';

export const IntroScreen = () => {
    const { setAppMode } = useGameStore();

    return (
        <div className="h-full w-full min-h-0 overflow-hidden relative flex flex-col items-center justify-center">
            {/* Intro Background – 화면 비율에 맞게 꽉 차게, 스크롤 없음 */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/background/intro.webp"
                    alt="Intro"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Title & Buttons – 영역 안에서만 표시 */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-6 animate-fade-in-up min-h-0 flex-shrink overflow-visible px-4">
                {/* 타이틀 + 주변 빛줄기 (프로펠러) – 타이틀은 예전처럼 단일 이미지 크기, 빛줄기는 absolute로 밖으로만 나감 */}
                <div className="relative inline-block overflow-visible -mt-40 mb-4">
                    {/* 회전하는 빛줄기 (타이틀보다 살짝 작게) */}
                    <div
                        className="absolute left-1/2 top-1/2 animate-streak-rotate pointer-events-none z-0"
                        style={{
                            width: 'min(280px, 34vh)',
                            height: 'min(280px, 34vh)',
                            marginLeft: 'calc(min(280px, 34vh) / -2)',
                            marginTop: 'calc(min(280px, 34vh) / -2)',
                        }}
                        aria-hidden
                    >
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                            <div
                                key={deg}
                                className="absolute left-1/2 top-1/2 w-12 h-1/2 origin-bottom"
                                style={{
                                    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
                                    background: `
                                      linear-gradient(to right, transparent 0%, rgba(251,191,36,0.12) 30%, rgba(251,146,60,0.35) 50%, rgba(251,191,36,0.12) 70%, transparent 100%),
                                      linear-gradient(to top, transparent 0%, rgba(251,191,36,0.1) 15%, rgba(251,146,60,0.32) 50%, rgba(251,191,36,0.08) 85%, transparent 100%)
                                    `,
                                    filter: 'blur(6px)',
                                    boxShadow: '0 0 24px rgba(251,191,36,0.22), 0 0 48px rgba(251,146,60,0.12)',
                                }}
                            />
                        ))}
                    </div>
                    {/* 타이틀: 예전 구조처럼 이미지가 곧 블록 크기 (패딩/중첩 없음) */}
                    <img
                        src="/ui/title_mobile.webp"
                        alt="FORGE the WORLD"
                        className="relative z-10 block w-full max-w-[560px] max-h-[65vh] object-contain object-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-float"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setAppMode('game')}
                    className="block animate-pulse-scale transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 rounded-lg overflow-hidden"
                    aria-label="Start Game"
                >
                    <img
                        src="/ui/start_btn.webp"
                        alt="Start Game"
                        className="h-auto w-full max-w-[280px] object-contain pointer-events-none"
                    />
                </button>

                {/* <button
                    onClick={() => setAppMode('dev')}
                    className="px-8 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white font-mono text-sm rounded border border-gray-600 backdrop-blur-sm transition-colors"
                >
                    DEV MODE
                </button> */}
            </div>

            {/* Mute Button (Top Right) */}
            <button
                onClick={useGameStore.getState().toggleBgmMute}
                className="absolute top-4 right-4 z-50 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-all border border-white/10"
                aria-label={useGameStore(state => state.isBgmMuted) ? "Unmute BGM" : "Mute BGM"}
            >
                {useGameStore(state => state.isBgmMuted) ? (
                    // Mute Icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                ) : (
                    // Music/Sound Icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
};
