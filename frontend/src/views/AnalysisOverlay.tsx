import React from 'react';
import { motion } from 'framer-motion';

export const AnalysisOverlay = () => {
    return (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-8 backdrop-blur-sm">
            <motion.div
                animate={{ rotate: [0, -45, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-6xl mb-8"
            >
                🔨
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">ANALYZING...</h2>
            <p className="text-gray-400 text-center text-sm">Identifying material properties and magical aura...</p>
        </div>
    );
};
