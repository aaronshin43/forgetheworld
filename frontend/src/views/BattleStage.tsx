import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Character } from '../components/Character';
import { SkillEffect } from '../components/SkillEffect';
import { Monster } from '../components/Monster';

export const BattleStage = () => {
    const { hp, maxHp, film: storeFilm, maxFilm, activeEffects, monsters, removeEffect } = useGameStore();

    return (
        <div className="h-1/2 bg-gray-900 relative flex items-center justify-center z-10">

            {/* Game World Clipping Container */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-80 z-0" />

                {/* Game World Container - where action happens */}
                <div className="absolute inset-0 z-10">

                    {/* Monsters Layer */}
                    {monsters.map(monster => (
                        <div
                            key={monster.id}
                            className="absolute z-20 transition-all duration-500 ease-out"
                            style={{
                                left: `${monster.x}%`,
                                top: `${monster.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <Monster name={monster.name} action="stand" />
                        </div>
                    ))}

                    {/* Character - Centered Left */}
                    <div className="absolute bottom-[20%] left-[20%] z-30">
                        <Character />
                    </div>

                    {/* Skill Effects Layer */}
                    {activeEffects.map(effect => (
                        <div
                            key={effect.id}
                            className="absolute pointer-events-none z-40"
                            style={{
                                left: `${effect.x}%`,
                                top: `${effect.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div style={{ transform: `scale(${effect.scale})` }}>
                                <SkillEffect
                                    name={effect.name}
                                    x={0} y={0} scale={1}
                                    onComplete={() => removeEffect(effect.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* HUD Layer (Z-50) */}
            <div className="absolute top-4 left-4 flex gap-3 items-center z-50">
                <div className="w-14 h-14 bg-gray-800 rounded-full border-2 border-orange-500/50 shadow-lg shadow-orange-500/20 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🧙‍♂️</div>
                </div>
                <div className="flex flex-col gap-1 drop-shadow-md">
                    <div className="w-40 h-3 bg-gray-800/80 rounded-full overflow-hidden border border-gray-600/50 relative">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            style={{ width: `${(hp / maxHp) * 100}%` }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Combat Power</span>
                        <span className="text-xs text-orange-400 font-mono font-bold">⚔️ 1,450</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 right-4 flex flex-col items-end gap-1 z-50">
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
        </div>
    );
};
