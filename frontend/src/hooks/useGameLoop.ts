import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_FORMATIONS, MONSTER_LIST, MONSTER_BASE_STATS, MONSTER_DURATIONS } from '../constants/assetRegistry';

export const useGameLoop = () => {
    const {
        timeScale,
        updateFilmRecharge,
        stageState,
        setStageState,
        wave,
        setWave,
        monsters,
        heroStats,
        spawnMonster,
        updateMonsterPosition,
        triggerCharacterAttack,
        damageMonster,
        damageHero,
        clearMonsters
    } = useGameStore();

    const requestRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);
    const lastHeroAttackRef = useRef<number>(0);

    const animate = (time: number) => {
        if (previousTimeRef.current !== null) {
            const deltaTime = time - previousTimeRef.current;
            const scaledDelta = deltaTime * timeScale;

            // 1. Film Recharge (Always runs)
            updateFilmRecharge(time);

            // 2. Game Logic based on State
            if (stageState === 'spawning') {
                const { appMode, spawnWave } = useGameStore.getState();

                if (appMode === 'dev') {
                    // Check live state
                    if (useGameStore.getState().monsters.length > 0) {
                        setStageState('walking');
                    }
                } else {
                    const spawnCount = Math.min(5, Math.max(1, Math.floor(wave / 2) + Math.floor(Math.random() * 2)));
                    spawnWave(spawnCount);
                    setStageState('walking');
                }
            }
            else if (stageState === 'walking') {
                const currentMonsters = useGameStore.getState().monsters; // Live State
                let allArrived = true;

                currentMonsters.forEach(monster => {
                    const target = monster.targetX || 70;
                    if (monster.x > target) {
                        allArrived = false;
                        if (monster.currentAction !== 'move') {
                            useGameStore.getState().setMonsterAction(monster.id, 'move');
                        }
                        const moveDist = monster.stats.moveSpeed * (scaledDelta / 1000);
                        updateMonsterPosition(monster.id, Math.max(target, monster.x - moveDist));
                    } else if (monster.currentAction === 'move') {
                        useGameStore.getState().setMonsterAction(monster.id, 'stand');
                    }
                });

                if (allArrived && currentMonsters.length > 0) {
                    setStageState('fighting');
                }
            }
            else if (stageState === 'fighting') {
                const currentMonsters = useGameStore.getState().monsters; // Live State

                const { appMode } = useGameStore.getState();

                // Hero Attack Logic
                const heroCooldown = 1000 / heroStats.spd;
                // Only auto-attack if NOT in dev mode
                if (appMode !== 'dev' && time - lastHeroAttackRef.current >= heroCooldown) {
                    const target = currentMonsters[Math.floor(Math.random() * currentMonsters.length)];
                    if (target) {
                        triggerCharacterAttack();
                        const rawDmg = heroStats.atk * (100 / (100 + target.stats.def));
                        const variance = 0.95 + Math.random() * 0.1;
                        let finalDmg = rawDmg * variance;

                        if (Math.random() < heroStats.critRate) {
                            finalDmg *= heroStats.critDmg;
                        }

                        damageMonster(target.id, Math.ceil(finalDmg));

                        const currentMonsterState = useGameStore.getState().monsters.find(m => m.id === target.id);
                        if (currentMonsterState && currentMonsterState.currentAction === 'stand') {
                            useGameStore.getState().setMonsterAction(target.id, 'hit1');
                            setTimeout(() => {
                                const m = useGameStore.getState().monsters.find(x => x.id === target.id);
                                if (m && m.stats.hp > 0 && m.currentAction === 'hit1') {
                                    useGameStore.getState().setMonsterAction(target.id, 'stand');
                                }
                            }, 400);
                        }
                    }
                    lastHeroAttackRef.current = time;
                }

                currentMonsters.forEach(monster => {
                    const attackChance = monster.stats.spd * (scaledDelta / 1000);

                    if (Math.random() < attackChance) {
                        const attackAction = 'attack1';
                        useGameStore.getState().setMonsterAction(monster.id, attackAction);

                        const duration = MONSTER_DURATIONS[monster.name]?.[attackAction] || 1000;

                        setTimeout(() => {
                            const currentM = useGameStore.getState().monsters.find(m => m.id === monster.id);
                            if (currentM && currentM.stats.hp > 0 && currentM.currentAction === attackAction) {
                                useGameStore.getState().setMonsterAction(monster.id, 'stand');
                            }
                        }, duration);

                        const rawDmg = monster.stats.atk * (100 / (100 + heroStats.def));
                        const variance = 0.95 + Math.random() * 0.1;
                        let finalDmg = rawDmg * variance;
                        damageHero(Math.ceil(finalDmg));
                    }
                });

                // Check for Deaths
                // Filter out truly dead (HP <= 0) to know if we cleared
                const aliveMonsters = currentMonsters.filter(m => m.stats.hp > 0);

                // Handle Death Animation triggers for newly dead
                const justDied = currentMonsters.filter(m => m.stats.hp <= 0 && m.currentAction !== 'die1');

                justDied.forEach(m => {
                    useGameStore.getState().setMonsterAction(m.id, 'die1');
                    const dieDuration = MONSTER_DURATIONS[m.name]?.['die1'] || 1000;

                    setTimeout(() => {
                        // Remove from state completely
                        useGameStore.setState(state => ({
                            monsters: state.monsters.filter(monster => monster.id !== m.id)
                        }));
                    }, dieDuration);
                });

                if (aliveMonsters.length === 0 && justDied.length === 0 && currentMonsters.length === 0) {
                    // Empty state -> Cleared (Wait a bit?)
                    // If we just removed them, currentMonsters will be empty in NEXT frame.
                    // But here, currentMonsters is the snapshot at start of frame.
                    // If everything is dead and removed, we are cleared.
                }

                // Simple Check: If NO monsters left in the array, we are done.
                if (currentMonsters.length === 0) {
                    setStageState('cleared');
                }
            }
            else if (stageState === 'cleared') {
                setWave(wave + 1);
                // Maybe wait a bit before spawning? 
                // Currently it instantly goes to spawning.
                // Let's add a small check or just let it loop.
                setStageState('spawning');
            }
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [timeScale, stageState, heroStats, wave]); // Re-bind on key state changes
};
