import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface Props {
    onSelect: (itemId: string) => void;
    onCancel: () => void;
}

export const EnhancementSelectionModal = ({ onSelect, onCancel }: Props) => {
    const { inventory } = useGameStore();
    const validItems = inventory.filter(item => item !== null);

    const gradeColors: Record<string, string> = {
        Legendary: 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]',
        Epic: 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]',
        Unique: 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]',
        Rare: 'text-blue-400',
        Common: 'text-gray-400',
    };

    return (
        <div className="absolute inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-gray-900 border border-indigo-500/50 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
                <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-indigo-400 tracking-wider uppercase">Select Item</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-2">
                    {validItems.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No Items Found</div>
                    ) : (
                        validItems.map((item) => (
                            <motion.div
                                key={item!.id}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelect(item!.id)}
                                className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 cursor-pointer flex items-center gap-4 hover:border-indigo-500/50 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-gray-900 rounded border border-gray-700 overflow-hidden flex-shrink-0 relative">
                                    {item!.image ? (
                                        <img src={item!.image} alt={item!.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">?</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <h3 className={`font-bold truncate ${gradeColors[item!.grade || 'Common'] || 'text-gray-300'}`}>
                                        {item!.name}
                                        {item!.enhancementLevel ? <span className="text-yellow-400 ml-1">+{item!.enhancementLevel}</span> : ''}
                                    </h3>
                                    <div className="text-xs text-gray-500 flex gap-2">
                                        <span>Rarity: {item!.rarity || 1}</span>
                                        <span>•</span>
                                        <span>{item!.grade || 'Common'}</span>
                                    </div>
                                </div>
                                <div className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-wider">
                                    SELECT
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-gray-800 border-t border-gray-700">
                    <button
                        onClick={onCancel}
                        className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold"
                    >
                        CANCEL
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
