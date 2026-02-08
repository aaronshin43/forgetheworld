import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const GameMenu = () => {
    const { appMode, setAppMode, setIsMenuOpen, resetGame } = useGameStore();
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const openMenu = () => {
        setIsOpen(true);
        setIsMenuOpen(true); // Triggers graceful freeze
    };

    const closeMenu = () => {
        setIsOpen(false);
        setIsMenuOpen(false); // Unfreezes
        setShowConfirm(false);
    };

    const handleQuitClick = () => {
        if (appMode === 'dev') {
            closeMenu();
            resetGame();
            setAppMode('intro');
        } else {
            setShowConfirm(true);
        }
    };

    const confirmQuit = () => {
        // Instant Quit - No graceful stop needed for quit itself, logic is reset
        resetGame();
        setAppMode('intro');
        closeMenu(); // Reset menu state
    };

    if (!isOpen) {
        return (
            <button
                onClick={openMenu}
                className="absolute top-4 right-4 z-[100] p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm border border-white/10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        );
    }

    return (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
            {/* Menu Container */}
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl w-64 flex flex-col gap-4 relative">

                {/* Close Button */}
                <button
                    onClick={closeMenu}
                    className="absolute top-3 right-3 text-gray-500 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold text-white text-center mb-2 tracking-widest text-orange-500">PAUSED</h2>

                {!showConfirm ? (
                    <>
                        <button
                            onClick={closeMenu}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold tracking-wide transition-colors"
                        >
                            RESUME
                        </button>

                        <button
                            onClick={handleQuitClick}
                            className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 text-red-200 border border-red-500/30 rounded-lg font-bold tracking-wide transition-colors"
                        >
                            QUIT TO TITLE
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-3 animate-fade-in-up">
                        <p className="text-center text-gray-300 text-sm mb-2">
                            Are you sure you want to quit? Unsaved progress will be lost.
                        </p>
                        <button
                            onClick={confirmQuit}
                            className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
                        >
                            YES, QUIT
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                            CANCEL
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
