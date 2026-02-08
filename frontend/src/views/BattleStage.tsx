import React, { useEffect, useState, useRef } from 'react';
import { useGameStore, calculateCombatPower } from '../store/gameStore';
import { Character } from '../components/Character';
import { SkillEffect } from '../components/SkillEffect';
import { Monster } from '../components/Monster';
import { DamageNumber } from '../components/DamageNumber';
import { useGameLoop } from '../hooks/useGameLoop';
import { MONSTER_ANIMATION_OFFSETS } from '../constants/assetRegistry';

export const BattleStage = () => {
    // Run the Game Loop
    useGameLoop();

    const {
        heroStats,
        film: storeFilm,
        maxFilm,
        activeEffects,
        damageNumbers,
        monsters,
        removeEffect,
        currentBackground
    } = useGameStore();

    // Derived values for UI
    const { hp, maxHp } = heroStats;
    const hpRatio = maxHp > 0 ? hp / maxHp : 1;

    // Combat Power Animation Logic
    const currentCP = calculateCombatPower(heroStats);
    const [animateCP, setAnimateCP] = useState(false);
    const prevCPRef = useRef(currentCP);

    useEffect(() => {
        if (currentCP !== prevCPRef.current) {
            setAnimateCP(true);
            prevCPRef.current = currentCP;

            const timer = setTimeout(() => {
                setAnimateCP(false);
            }, 300); // 300ms pulse

            return () => clearTimeout(timer);
        }
    }, [currentCP]);

    // Stand image heights for damage number positioning (in px)
    const MONSTER_STAND_HEIGHTS: Record<string, number> = {
        'goblinking': 180,
        'rockspirit': 200,
        'coffeemachine': 170,
        'ultragray': 190,
        'goblin': 160,
        'wyvern': 200,
        'zombie': 180
    };

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
                            key={`${monster.id}-${monster.actionId || 0}`}
                            className="absolute z-20 transition-all duration-500 ease-out"
                            style={{
                                left: `${monster.x}%`,
                                top: `${monster.y}%`,
                                transform: 'translate(-50%, -100%)' // Anchor at feet
                            }}
                        >
                            <Monster
                                name={monster.name}
                                action={monster.currentAction}
                                scale={monster.stats.scale || 1.0}
                                animXOffset={MONSTER_ANIMATION_OFFSETS[monster.name]?.[monster.currentAction]?.x || 0}
                                animYOffset={MONSTER_ANIMATION_OFFSETS[monster.name]?.[monster.currentAction]?.y || 0}
                                uuid={`${monster.id}_${monster.actionId}`}
                            />
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

                {/* Damage Numbers Layer (Z-40) */}
                <div className="absolute inset-0 pointer-events-none z-40">
                    {damageNumbers.map(dmg => {
                        const monster = monsters.find(m => m.id.toString() === dmg.monsterId);
                        if (!monster) return null;

                        const standHeight = MONSTER_STAND_HEIGHTS[monster.name] || 180;

                        return (
                            <DamageNumber
                                key={dmg.id}
                                {...dmg}
                                standHeight={standHeight}
                            />
                        );
                    })}
                </div>
            </div>

            {/* HUD Layer (Z-50) */}
            <div className="absolute top-4 left-2 flex gap-0 items-start z-50">
                <div className="relative w-[88px] h-[88px] flex-shrink-0 mt-1">
                    <div className="absolute inset-0 flex items-center justify-center translate-y-1">
                        <img src="/ui/head.webp" alt="Character" className="w-[70%] h-[70%] object-contain object-center" />
                    </div>
                    <img src="/ui/profile_box.webp" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5 drop-shadow-md translate-y-2 -ml-1">
                    {/* Combat Power – Calculate & Animate */}
                    <div className="flex items-center gap-1.5 ml-1">
                        <img src="/ui/sword.webp" alt="" className="w-5 h-5 object-contain flex-shrink-0" aria-hidden />
                        <span
                            className={`text-sm font-metallic-emboss transition-all duration-300 ${animateCP ? 'scale-125 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]' : 'text-white'}`}
                        >
                            {currentCP.toLocaleString()}
                        </span>
                    </div>

                    {/* HP Bar: 빨간 바 뒤에, healthbar.webp 사진이 맨 위(앞)에 */}
                    <div className="relative w-48 h-7 flex-shrink-0 isolate">
                        {/* 트랙 + 채움 바 – 빨간색만 */}
                        <div className="absolute bottom-[0.575rem] left-5 right-5 h-2.5 rounded-sm overflow-hidden bg-gray-900/90 z-0">
                            <div
                                className="h-full min-w-0 bg-red-500 transition-all duration-300"
                                style={{ width: `${Math.max(hpRatio * 100, 0)}%` }}
                            />
                        </div>
                        {/* healthbar.webp – 맨 앞(위) 레이어 */}
                        <img
                            src="/ui/healthbar.webp"
                            alt=""
                            className="absolute inset-0 w-full h-full object-fill object-top pointer-events-none z-10"
                            aria-hidden
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
