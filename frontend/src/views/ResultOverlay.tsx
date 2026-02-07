import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const ResultOverlay = () => {
    const { scanResult, setScanResult, setViewMode, setTimeScale, setIsAnalyzing, inventory } = useGameStore();

    if (!scanResult) return null;

    const matchingItem = inventory.find(item => item && (item.name === scanResult.flavor.name || item.name === scanResult.analysis.item) && item.image);

    const displayImage = matchingItem?.image;

    const handleClose = () => {
        setScanResult(null);
        setIsAnalyzing(false);
        // Note: View transition is now handled in CameraView immediately after capture, 
        // but we might want to ensure we are in battle mode here too just in case.
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
                <div className="bg-gray-900 p-8 flex items-center justify-center relative overflow-hidden h-64">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-transparent to-transparent" />

                    {displayImage ? (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={displayImage}
                            alt="Generated Item"
                            className="relative z-10 w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        />
                    ) : (
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-6xl mb-4 animate-pulse">
                                {scanResult.analysis.type === 'weapon' ? '⚔️' : scanResult.analysis.type === 'armor' ? '🛡️' : '🧪'}
                            </span>
                            <span className="text-xs text-yellow-500/70 uppercase tracking-widest animate-pulse">Forging...</span>
                        </div>
                    )}
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
