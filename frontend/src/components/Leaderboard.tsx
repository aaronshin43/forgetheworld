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
        if (index === 0) return 'text-5xl font-black';
        if (index === 1) return 'text-4xl font-black';
        if (index === 2) return 'text-3xl font-black';
        return 'text-gray-400 text-xl font-bold';
    };

    const getRankBg = (index: number) => {
        if (index === 0) return 'bg-gradient-to-br from-yellow-600/30 via-yellow-500/20 to-orange-600/30 border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.5)]';
        if (index === 1) return 'bg-gradient-to-br from-gray-400/30 via-gray-500/20 to-gray-600/30 border-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.4)]';
        if (index === 2) return 'bg-gradient-to-br from-orange-700/30 via-orange-600/20 to-orange-800/30 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]';
        return 'bg-gray-800/70 border-gray-600 hover:border-gray-500';
    };

    const getRankEmoji = (index: number) => {
        if (index === 0) return '👑';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
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
                    <div className="relative bg-gradient-to-r from-yellow-600/20 via-orange-500/20 to-yellow-600/20 p-8 border-b-2 border-yellow-600/50 overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(251,191,36,0.1),transparent_50%)] animate-pulse" />
                        
                        <div className="relative z-10">
                            <h1 className="text-5xl font-black text-center bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] mb-2">
                                TOP 10 FORGE MASTERS
                            </h1>
                            <p className="text-center text-yellow-400/80 text-sm font-semibold tracking-widest">HALL OF FAME</p>
                        </div>
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
                            <div className="space-y-4">
                                {leaderboard.map((entry, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.08, type: "spring" }}
                                        className={`${getRankBg(index)} rounded-xl border-2 p-5 transition-all hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden`}
                                    >
                                        {/* Rank Background Glow for Top 3 */}
                                        {index < 3 && (
                                            <div className={`absolute inset-0 opacity-20 blur-2xl ${
                                                index === 0 ? 'bg-yellow-400' : 
                                                index === 1 ? 'bg-gray-400' : 
                                                'bg-orange-400'
                                            }`} />
                                        )}

                                        <div className="relative z-10 flex items-start gap-4">
                                            {/* Rank */}
                                            <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center">
                                                <div className={`${getRankStyle(index)} ${
                                                    index === 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]' :
                                                    index === 1 ? 'text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.6)]' :
                                                    index === 2 ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' :
                                                    ''
                                                }`}>
                                                    {getRankEmoji(index)}
                                                </div>
                                            </div>

                                            {/* Player Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className={`text-2xl font-black truncate ${
                                                        index === 0 ? 'text-yellow-300' :
                                                        index === 1 ? 'text-gray-200' :
                                                        index === 2 ? 'text-orange-300' :
                                                        'text-white'
                                                    }`}>{entry.player_name}</h3>
                                                </div>

                                                {/* Combat Power - Emphasized */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Combat Power</span>
                                                    <div className="flex-1 h-px bg-gradient-to-r from-yellow-600/50 to-transparent" />
                                                    <span className={`text-3xl font-black ${
                                                        index === 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' :
                                                        index === 1 ? 'text-gray-300' :
                                                        index === 2 ? 'text-orange-400' :
                                                        'text-yellow-400'
                                                    }`}>
                                                        {entry.combat_power.toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex gap-6 text-sm mb-3 text-gray-300">
                                                    <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded">
                                                        <span className="text-blue-400">⏱️</span>
                                                        <span className="font-semibold">{formatTime(entry.survival_time)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded">
                                                        <span className="text-red-400">💀</span>
                                                        <span className="font-semibold">{entry.kill_count}</span>
                                                    </div>
                                                </div>

                                                {/* Weapons */}
                                                {entry.weapons && entry.weapons.length > 0 && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Arsenal</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {entry.weapons.slice(0, 6).map((weapon, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`px-3 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${
                                                                        weapon.grade === 'Legendary'
                                                                            ? 'bg-orange-600/40 text-orange-200 border-orange-400/60 shadow-[0_0_10px_rgba(251,146,60,0.3)]'
                                                                            : weapon.grade === 'Epic'
                                                                            ? 'bg-purple-600/40 text-purple-200 border-purple-400/60 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                                                                            : weapon.grade === 'Unique'
                                                                            ? 'bg-blue-600/40 text-blue-200 border-blue-400/60'
                                                                            : 'bg-gray-700/40 text-gray-300 border-gray-500/60'
                                                                    }`}
                                                                >
                                                                    {weapon.name}
                                                                </div>
                                                            ))}
                                                        </div>
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
                    <div className="bg-gradient-to-t from-gray-900 to-gray-900/80 p-6 border-t-2 border-yellow-600/30">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-black text-lg font-black rounded-lg transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transform hover:scale-[1.02]"
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
