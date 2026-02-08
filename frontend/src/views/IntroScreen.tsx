import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Leaderboard } from '../components/Leaderboard';

export const IntroScreen = () => {
    const { setAppMode } = useGameStore();
    const [showLeaderboard, setShowLeaderboard] = useState(false);

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

                <div className="flex flex-col gap-4 items-center">
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

                    <button
                        type="button"
                        onClick={() => setShowLeaderboard(true)}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-black text-sm font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(251,191,36,0.4)] border border-yellow-400"
                    >
                        LEADERBOARD
                    </button>
                </div>

                {/* <button
                    onClick={() => setAppMode('dev')}
                    className="px-8 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white font-mono text-sm rounded border border-gray-600 backdrop-blur-sm transition-colors"
                >
                    DEV MODE
                </button> */}
            </div>

            <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
        </div>
    );
};
