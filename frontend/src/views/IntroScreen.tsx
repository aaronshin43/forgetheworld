import React from 'react';
import { useGameStore } from '../store/gameStore';

export const IntroScreen = () => {
    const { setAppMode } = useGameStore();

    return (
        <div className="h-full w-full relative flex flex-col items-center justify-center">
            {/* Intro Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/background/intro.webp"
                    alt="Intro"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Title & Buttons */}
            <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
                <h1 className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-tighter mb-4">
                    FORGE THE WORLD
                </h1>

                <button
                    onClick={() => setAppMode('game')}
                    className="px-12 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xl rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all hover:scale-105 active:scale-95 tracking-wide border-2 border-orange-400"
                >
                    START GAME
                </button>

                <button
                    onClick={() => setAppMode('dev')}
                    className="px-8 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white font-mono text-sm rounded border border-gray-600 backdrop-blur-sm transition-colors"
                >
                    DEV MODE
                </button>
            </div>
        </div>
    );
};
