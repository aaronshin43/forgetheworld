import React from 'react';
import { motion } from 'framer-motion';

export const AnalysisOverlay = () => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Dark blurred backdrop */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" aria-hidden />
            {/* Subtle radial glow behind character */}
            <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(251,191,36,0.12) 0%, transparent 55%)',
                }}
                aria-hidden
            />

            <div className="relative z-10 flex flex-col items-center max-w-sm">
                {/* Character with glow and float animation */}
                <motion.div
                    className="relative mb-8"
                    animate={{
                        y: [0, -8, 0],
                        filter: ['drop-shadow(0 0 20px rgba(251,191,36,0.3))', 'drop-shadow(0 0 28px rgba(251,191,36,0.5))', 'drop-shadow(0 0 20px rgba(251,191,36,0.3))'],
                    }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                >
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                        <img
                            src="/character/forge.webp"
                            alt=""
                            className="w-full h-full object-contain object-center scale-110"
                        />
                    </div>
                </motion.div>

                {/* Title with gradient and pulse */}
                <motion.h2
                    className="text-2xl sm:text-3xl font-bold mb-2 tracking-wider"
                    style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 40%, #f59e0b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                    animate={{ opacity: [0.9, 1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    FORGING...
                </motion.h2>
                <p className="text-amber-200/80 text-center text-sm sm:text-base mb-6 tracking-wide">
                    Identifying materials and magical aura...
                </p>

                {/* Minimal loading bar */}
                <motion.div
                    className="h-1 w-48 sm:w-56 rounded-full bg-zinc-700/80 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        initial={{ width: '0%' }}
                        animate={{ width: ['0%', '70%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                </motion.div>
            </div>
        </div>
    );
};
