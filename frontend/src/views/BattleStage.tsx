import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Character } from '../components/Character';
import { SkillEffect } from '../components/SkillEffect';
import { Monster } from '../components/Monster';
import { useGameLoop } from '../hooks/useGameLoop';

export const BattleStage = () => {
    // Run the Game Loop
    useGameLoop();

    const {
        heroStats,
        film: storeFilm,
        maxFilm,
        activeEffects,
        monsters,
        removeEffect,
        currentBackground
    } = useGameStore();

    // Derived values for UI
    const { hp, maxHp } = heroStats;

    return (
        <div className="h-full bg-gray-900 relative flex items-center justify-center z-10">

            {/* Game World Clipping Container */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={`/background/${currentBackground}.webp`}
                        alt="Background"
                        className="w-full h-full object-cover object-top opacity-80"
                    />
                    {/* Optional Overlay to darken it slightly for better entity visibility */}
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Game World Container */}
                <div className="absolute inset-0 z-10">

                    {/* Monsters Layer */}
                    {monsters.map(monster => (
                        <div
                            key={monster.id}
                            className="absolute z-20 transition-all duration-500 ease-out"
                            style={{
                                left: `${monster.x}%`,
                                top: `${monster.y}%`,
                                transform: 'translate(-50%, -100%)' // Anchor at feet
                            }}
                        >
                            <Monster name={monster.name} action={monster.currentAction} scale={monster.stats.scale || 1.0} />
                        </div>
                    ))}

                    {/* Character */}
                    <div className="absolute bottom-[5%] left-[10%] z-30">
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
            <div className="absolute top-4 left-2 flex gap-3 items-start z-50">
                <div className="relative w-[88px] h-[88px] flex-shrink-0 mt-1">
                    <div className="absolute inset-0 flex items-center justify-center translate-y-1">
                        <img src="/ui/head.webp" alt="Character" className="w-[70%] h-[70%] object-contain object-center" />
                    </div>
                    <img src="/ui/profile_box.webp" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5 drop-shadow-md">
                    {/* Combat Power (Moved Above) */}
                    <div className="flex items-center gap-1.5 ml-1">
                        <span className="text-sm">⚔️</span>
                        <span className="text-sm text-orange-400 font-mono font-bold italic">1,450</span>
                    </div>

                    {/* HP Bar */}
                    <div className="w-40 h-3 bg-gray-800/80 rounded-full overflow-hidden border border-gray-600/50 relative">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            style={{ width: `${(hp / maxHp) * 100}%` }}
                        />
                    </div>

                    {/* Film (goldenhammar icon) */}
                    <div className="flex items-center gap-1 mt-1 ml-0.5">
                        {Array.from({ length: maxFilm }).map((_, i) => (
                            <img
                                key={i}
                                src="/ui/goldenhammar.webp"
                                alt=""
                                aria-hidden
                                className={`w-5 h-5 object-contain drop-shadow-lg transition-all duration-300 ${i < storeFilm ? 'opacity-100 scale-110' : 'opacity-40 scale-90 grayscale'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
