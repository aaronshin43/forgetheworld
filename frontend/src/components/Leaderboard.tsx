import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
    player_name: string;
    combat_power: number;
    survival_time: number;
    kill_count: number;
    weapons: { name: string; grade: string }[];
}

interface LeaderboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchLeaderboard();
        }
    }, [isOpen]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "";
            const response = await fetch(`${apiBase}/leaderboard`);
            const data = await response.json();
            setLeaderboard(data.leaderboard || []);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getRankStyle = (index: number) => {
        if (index === 0) return 'text-yellow-400 text-2xl';
        if (index === 1) return 'text-gray-300 text-xl';
        if (index === 2) return 'text-orange-600 text-xl';
        return 'text-gray-400';
    };

    const getRankBg = (index: number) => {
        if (index === 0) return 'bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border-yellow-500';
        if (index === 1) return 'bg-gradient-to-r from-gray-600/20 to-gray-800/20 border-gray-400';
        if (index === 2) return 'bg-gradient-to-r from-orange-600/20 to-orange-800/20 border-orange-500';
        return 'bg-gray-800/50 border-gray-700';
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gradient-to-b from-gray-900 to-black rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-yellow-600/30 shadow-[0_0_50px_rgba(234,179,8,0.3)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-6 border-b border-yellow-600/30">
                        <h1 className="text-4xl font-bold text-center text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                            TOP 10 FORGE MASTERS
                        </h1>
                        <p className="text-center text-gray-400 mt-2">Hall of Fame</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-xl">No rankings yet...</p>
                                <p className="text-sm mt-2">Be the first to make history!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {leaderboard.map((entry, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`${getRankBg(index)} rounded-lg border-2 p-4 transition-all hover:scale-[1.02]`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Rank */}
                                            <div className={`${getRankStyle(index)} font-black w-12 text-center flex-shrink-0`}>
                                                {index === 0 && '👑'}
                                                {index === 1 && '🥈'}
                                                {index === 2 && '🥉'}
                                                {index > 2 && `#${index + 1}`}
                                            </div>

                                            {/* Player Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-white truncate">{entry.player_name}</h3>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <span className="text-2xl font-black text-yellow-400">
                                                            {entry.combat_power.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs text-gray-400">CP</span>
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex gap-4 text-sm mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-400">⏱️</span>
                                                        <span className="text-white">{formatTime(entry.survival_time)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-400">💀</span>
                                                        <span className="text-white">{entry.kill_count} kills</span>
                                                    </div>
                                                </div>

                                                {/* Weapons */}
                                                {entry.weapons && entry.weapons.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {entry.weapons.slice(0, 6).map((weapon, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    weapon.grade === 'Legendary'
                                                                        ? 'bg-orange-600/30 text-orange-400 border border-orange-500/50'
                                                                        : weapon.grade === 'Epic'
                                                                        ? 'bg-purple-600/30 text-purple-400 border border-purple-500/50'
                                                                        : weapon.grade === 'Unique'
                                                                        ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50'
                                                                        : 'bg-gray-600/30 text-gray-400 border border-gray-500/50'
                                                                }`}
                                                            >
                                                                {weapon.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-900/80 p-4 border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-lg transition-colors"
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
