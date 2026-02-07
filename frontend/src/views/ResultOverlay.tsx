import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const ResultOverlay = () => {
    const { scanResult, setScanResult, setViewMode, setTimeScale, setIsAnalyzing } = useGameStore();

    if (!scanResult) return null;

    const handleClose = () => {
        setScanResult(null);
        setIsAnalyzing(false);
        setViewMode('battle');
        setTimeScale(1.0);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm bg-gray-800 rounded-xl overflow-hidden border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]"
            >
                <div className="bg-gray-900 p-8 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-transparent to-transparent" />
                    <span className="text-6xl relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        {/* Fallback Icon based on type */}
                        {scanResult.analysis.type === 'weapon' ? '⚔️' : scanResult.analysis.type === 'armor' ? '🛡️' : '🧪'}
                    </span>
                </div>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-1">{scanResult.flavor.name}</h2>
                    <p className="text-gray-400 text-xs italic mb-4">"{scanResult.flavor.description}"</p>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-gray-700/50 p-2 rounded">
                            <div className="text-[10px] text-gray-500 uppercase">ATK</div>
                            <div className="text-lg font-bold text-white">{scanResult.analysis.stats.atk}</div>
                        </div>
                        <div className="bg-gray-700/50 p-2 rounded">
                            <div className="text-[10px] text-gray-500 uppercase">DEF</div>
                            <div className="text-lg font-bold text-white">{scanResult.analysis.stats.def}</div>
                        </div>
                        <div className="bg-gray-700/50 p-2 rounded">
                            <div className="text-[10px] text-gray-500 uppercase">HP</div>
                            <div className="text-lg font-bold text-white">{scanResult.analysis.stats.hp}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors"
                    >
                        CLAIM ITEM
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
