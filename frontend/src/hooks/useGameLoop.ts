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
                            // No timeout needed; loop handles transition back to stand
                        }
                    }
                    lastHeroAttackRef.current = time;
                }

                // Monster Logic (Cycle Based)
                // We iterate monsters and check if their current animation cycle is complete.

                // Need to use setMonsterAction which now resets startTime. 
                // But we also need to increment standCycles sometimes WITHOUT changing action or resetting time?
                // Actually, if we loop 'stand', we effectively restart it. So resetting startTime is correct for looping.
                // But we need a way to increment standCycles. The store doesn't have a specific action for that.
                // We can add one, or just do it manually via a custom setState here? 
                // Better to add a helper or just do: 
                // useGameStore.setState(s => ({ monsters: s.monsters.map(...) }))

                const now = Date.now();

                currentMonsters.forEach(monster => {
                    const elapsed = now - (monster.stateStartTime || now);
                    const currentDuration = MONSTER_DURATIONS[monster.name]?.[monster.currentAction] || 1000;

                    if (elapsed >= currentDuration) {
                        // Animation finished! Decision time.
                        if (monster.currentAction === 'stand') {
                            // Stand cycle finished.
                            const newCycles = (monster.standCycles || 0) + 1;

                            if (newCycles >= monster.stats.spd) {
                                // Attack!
                                const attackAction = 'attack1';
                                // Directly update state to Attack and rest cycles
                                useGameStore.setState(state => ({
                                    monsters: state.monsters.map(m => m.id === monster.id ? {
                                        ...m,
                                        currentAction: attackAction,
                                        stateStartTime: now,
                                        standCycles: 0
                                    } : m)
                                }));

                                // Deal Damage Logic (Immediate or delayed? User asked for animation first?)
                                // "Monster attack motion should play, THEN damage?" 
                                // Usually damage is at impact point. For simplicity, let's deal damage at start or middle?
                                // Let's deal it now for immediate feedback, or maybe schedule it. 
                                // User said: "output attack motion after stand motion ends".
                                // Let's simplify: Attack starts now. Damage happens now.
                                const rawDmg = monster.stats.atk * (100 / (100 + heroStats.def));
                                const variance = 0.95 + Math.random() * 0.1;
                                let finalDmg = rawDmg * variance;
                                damageHero(Math.ceil(finalDmg));

                            } else {
                                // Wait more. Replay stand.
                                useGameStore.setState(state => ({
                                    monsters: state.monsters.map(m => m.id === monster.id ? {
                                        ...m,
                                        currentAction: 'stand', // Re-set to trigger any effects if monitoring?
                                        stateStartTime: now,
                                        standCycles: newCycles
                                    } : m)
                                }));
                            }
                        }
                        else if (monster.currentAction.startsWith('attack') || monster.currentAction.startsWith('hit')) {
                            // Attack or Hit finished. Go back to stand.
                            useGameStore.setState(state => ({
                                monsters: state.monsters.map(m => m.id === monster.id ? {
                                    ...m,
                                    currentAction: 'stand',
                                    stateStartTime: now,
                                    // standCycles is already 0 from attack start, or preserved if hit?
                                    // If hit interrupts stand, we probably should reset or keep? 
                                    // Simple: Reset cycles on any interruption to be safe/fair.
                                    standCycles: 0
                                } : m)
                            }));
                        }
                        else if (monster.currentAction === 'die1') {
                            // Death animation finished. Remove monster.
                            useGameStore.setState(state => ({
                                monsters: state.monsters.filter(m => m.id !== monster.id)
                            }));
                        }
                    }
                });

                // Handle Death Triggers (Transition alive -> die1)
                // We check for monsters with HP <= 0 that are NOT yet in 'die1' action.
                currentMonsters.forEach(m => {
                    if (m.stats.hp <= 0 && m.currentAction !== 'die1') {
                        useGameStore.getState().setMonsterAction(m.id, 'die1');
                        // Loop will catch the end of 'die1' and remove them.
                    }
                });

                // Check for Wave Clear
                // If there are NO monsters left in the array, we are done.
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
