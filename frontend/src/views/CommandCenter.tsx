import React from 'react';
import { useGameStore } from '../store/gameStore';

export const CommandCenter = () => {
    const { inventory } = useGameStore();

    return (
        <div className="h-1/2 bg-gray-950 text-white p-6 flex flex-col justify-between border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-20">

            {/* Inventory Grid (3x2) */}
            <div className="w-full">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Inventory</h3>
                <div className="grid grid-cols-3 gap-2">
                    {inventory.map((item, index) => (
                        <div key={index} className="aspect-square bg-white/5 border border-white/10 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden group">
                            {item ? (
                                <span className="text-2xl drop-shadow-md">{item}</span>
                            ) : (
                                <img
                                    src="/ui/anvil.webp"
                                    alt="Empty Slot"
                                    className="w-1/2 h-1/2 object-contain opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-300"
                                />
                            )}
                        </div>
                    ))}
                </div>
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
