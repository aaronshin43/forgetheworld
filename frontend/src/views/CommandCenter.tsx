import React from 'react';
import { useGameStore } from '../store/gameStore';

export const CommandCenter = () => {
    const { film, maxFilm, inventory } = useGameStore();

    return (
        <div className="h-1/2 bg-gray-950 text-white p-6 flex flex-col justify-between border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-20">

            {/* Inventory Grid */}
            <div className="w-full">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Inventory</h3>
                <div className="grid grid-cols-6 gap-2">
                    {inventory.map((item, index) => (
                        <div key={index} className="aspect-square bg-white/5 border border-white/10 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                            {item ? <span className="text-xl">{item}</span> : <div className="w-2 h-2 rounded-full bg-white/5"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Resource Indicator */}
            <div className="flex justify-center items-center gap-2 mb-2">
                <span className="text-xs font-mono text-yellow-500/80">FILM ROLL</span>
                <div className="flex gap-1">
                    {Array.from({ length: maxFilm }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-4 rounded-sm border border-yellow-500/50 ${i < film ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-transparent'}`}
                        />
                    ))}
                </div>
                <span className="text-xs font-mono text-yellow-500/80">{film}/{maxFilm}</span>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 gap-4 h-24">
                <button
                    onClick={() => { useGameStore.getState().setViewMode('camera'); useGameStore.getState().setTimeScale(0.1); }}
                    className="group relative bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center active:scale-95 transition-all hover:bg-indigo-600/30">
                    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🔨</div>
                    <span className="text-xs font-bold text-indigo-200 tracking-wider">CRAFT</span>
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                    onClick={() => { useGameStore.getState().setViewMode('camera'); useGameStore.getState().setTimeScale(0.1); }}
                    className="group relative bg-rose-600/20 backdrop-blur-md border border-rose-500/30 rounded-2xl flex flex-col items-center justify-center active:scale-95 transition-all hover:bg-rose-600/30">
                    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">⚡</div>
                    <span className="text-xs font-bold text-rose-200 tracking-wider">SKILL</span>
                    <div className="absolute inset-0 rounded-2xl bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                    onClick={() => { useGameStore.getState().setViewMode('camera'); useGameStore.getState().setTimeScale(0.1); }}
                    className="group relative bg-purple-600/20 backdrop-blur-md border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center active:scale-95 transition-all hover:bg-purple-600/30">
                    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">✨</div>
                    <span className="text-xs font-bold text-purple-200 tracking-wider">ENHANCE</span>
                    <div className="absolute inset-0 rounded-2xl bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </div>
    );
};
