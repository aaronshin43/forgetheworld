'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { InventoryItem } from '../store/gameStore';

interface ItemDetailModalProps {
    item: InventoryItem;
    onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
    const { name, image, description, stats } = item;
    const atk = stats?.atk ?? 0;
    const def = stats?.def ?? 0;
    const hp = stats?.hp ?? 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Item details"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-zinc-800/95 shadow-[0_0_40px_rgba(251,191,36,0.15)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Dark panel with subtle texture */}
                <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 p-6 flex flex-col items-center">
                    {/* Item image frame */}
                    <div className="w-40 h-40 rounded-xl bg-zinc-900/90 border border-amber-500/30 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                        {image ? (
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-4xl text-amber-500/50">?</span>
                        )}
                    </div>

                    {/* Item name - golden, bold */}
                    <h2 className="text-xl font-bold text-amber-400 mb-2 text-center tracking-wide">
                        {name}
                    </h2>

                    {/* Description / lore - italic, quoted */}
                    {description && (
                        <p className="text-sm text-zinc-300/90 italic text-center mb-5 max-w-xs">
                            &ldquo;{description}&rdquo;
                        </p>
                    )}

                    {/* Stat boxes: ATK, DEF, HP */}
                    <div className="grid grid-cols-3 gap-2 w-full max-w-[260px] mb-6">
                        <div className="bg-zinc-700/60 rounded-lg p-2 text-center border border-zinc-600/50">
                            <div className="text-[10px] uppercase text-zinc-400 tracking-wider">ATK</div>
                            <div className="text-lg font-bold text-amber-400">{atk}</div>
                        </div>
                        <div className="bg-zinc-700/60 rounded-lg p-2 text-center border border-zinc-600/50">
                            <div className="text-[10px] uppercase text-zinc-400 tracking-wider">DEF</div>
                            <div className="text-lg font-bold text-amber-400">{def}</div>
                        </div>
                        <div className="bg-zinc-700/60 rounded-lg p-2 text-center border border-zinc-600/50">
                            <div className="text-[10px] uppercase text-zinc-400 tracking-wider">HP</div>
                            <div className="text-lg font-bold text-amber-400">{hp}</div>
                        </div>
                    </div>

                    {/* Close / Confirm button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm uppercase tracking-wider transition-colors shadow-lg"
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
