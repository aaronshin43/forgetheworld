import React from 'react';
import { useGameStore } from '../store/gameStore';

export const LoadingScreen = () => {
    const { loadingProgress } = useGameStore();

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
            <div className="mb-8 relative w-24 h-24 animate-bounce">
                {/* Placeholder for a loading icon or logo */}
                <div className="w-full h-full bg-orange-500 rounded-full blur-md opacity-50 absolute"></div>
                <div className="w-full h-full bg-orange-600 rounded-full relative flex items-center justify-center border-4 border-white">
                    <span className="text-4xl">⚔️</span>
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-6 tracking-widest uppercase">Forge The World</h1>

            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                    className="h-full bg-orange-500 transition-all duration-100 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                />
            </div>

            <div className="mt-2 text-xs text-gray-500 font-mono">
                LOADING ASSETS... {loadingProgress}%
            </div>
        </div>
    );
};
