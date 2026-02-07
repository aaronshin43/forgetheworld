import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const BattleStage = () => {
    const { hp, maxHp, film: storeFilm, maxFilm } = useGameStore();

    // Simple local subscription to film updates for animation/reactivity if needed, 
    // currently we just use the store value which re-renderscomponent on change.

    return (
        <div className="h-1/2 bg-gray-900 relative overflow-hidden flex items-center justify-center">

            {/* Background (Placeholder for Game View) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-80" />

            {/* HUD Layer */}
            <div className="absolute top-4 left-4 flex gap-3 items-center z-20">
                {/* Portrait */}
                <div className="w-14 h-14 bg-gray-800 rounded-full border-2 border-orange-500/50 shadow-lg shadow-orange-500/20 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🧙‍♂️</div>
                </div>

                {/* Status Bars */}
                <div className="flex flex-col gap-1 drop-shadow-md">
                    {/* HP Bar */}
                    <div className="w-40 h-3 bg-gray-800/80 rounded-full overflow-hidden border border-gray-600/50 relative">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            style={{ width: `${(hp / maxHp) * 100}%` }}
                        />
                    </div>

                    {/* CP Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Combat Power</span>
                        <span className="text-xs text-orange-400 font-mono font-bold">⚔️ 1,450</span>
                    </div>
                </div>
            </div>

            {/* Film Roll Indicator (Top Right) */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1 z-20">
                <span className="text-[10px] font-mono text-yellow-500/80 tracking-tighter">FILM ROLL</span>
                <div className="flex gap-1.5">
                    {Array.from({ length: maxFilm }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-5 rounded-sm border border-yellow-500/50 transition-all duration-300 ${i < storeFilm ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-transparent opacity-30'}`}
                        />
                    ))}
                </div>
                <span className="text-[10px] font-mono text-yellow-500/80">{storeFilm}/{maxFilm}</span>
            </div>

            {/* Central View (Content) */}
            <div className="relative z-10 p-4 text-center">
                <h1 className="text-white/20 text-4xl font-black uppercase tracking-widest select-none pointer-events-none">Battle Stage</h1>
            </div>
        </div>
    );
};
