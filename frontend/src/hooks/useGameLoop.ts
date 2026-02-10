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
    const currentTargetIdRef = useRef<number | null>(null);

    const animate = (time: number) => {
        if (previousTimeRef.current !== null) {
            const deltaTime = time - previousTimeRef.current;
            const scaledDelta = deltaTime * timeScale;

            // 1. Film Recharge (Always runs)
            updateFilmRecharge(time);

            // 2. Game Logic based on State
            // Freeze on game over
            if (stageState === 'gameover') {
                previousTimeRef.current = time;
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

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
                const currentMonsters = useGameStore.getState().monsters; // Live State at start of frame
                const { appMode, viewMode, isAnalyzing, scanResult, isMenuOpen, isSkillActive } = useGameStore.getState();
                const isFrozen = viewMode === 'camera' || isAnalyzing || !!scanResult || isMenuOpen || isSkillActive;
                const now = Date.now();

                // 1. Monster Logic (Animation Cycles & Freeze)
                // We run this FIRST so that if Hero attacks later in this frame, 
                // the 'hit1' reaction OVERRIDES any 'stand' cycle updates from here.
                currentMonsters.forEach(monster => {
                    // GRACEFUL FREEZE LOGIC
                    if (isFrozen) {
                        // 1. If moving, stop immediately to stand
                        if (monster.currentAction === 'move') {
                            useGameStore.setState(state => ({
                                monsters: state.monsters.map(m => m.id === monster.id ? {
                                    ...m,
                                    currentAction: 'stand',
                                    stateStartTime: now,
                                    standCycles: 0
                                } : m)
                            }));
                            return;
                        }

                        const elapsed = now - (monster.stateStartTime || now);
                        const currentDuration = MONSTER_DURATIONS[monster.name]?.[monster.currentAction] || 1000;

                        if (elapsed >= currentDuration) {
                            // 2. If 'stand' cycle finishes, just loop stand. DO NOT ATTACK.
                            if (monster.currentAction === 'stand') {
                                useGameStore.setState(state => ({
                                    monsters: state.monsters.map(m => m.id === monster.id ? {
                                        ...m,
                                        stateStartTime: now,
                                        standCycles: 0 // Reset cycles
                                    } : m)
                                }));
                            }
                            // 3. If Attack/Hit/Die finishes, go to stand
                            else if (monster.currentAction.startsWith('attack') || monster.currentAction.startsWith('hit') || monster.currentAction === 'die1') {
                                const nextAction = monster.currentAction === 'die1' ? 'REMOVE' : 'stand';

                                if (nextAction === 'REMOVE') {
                                    useGameStore.setState(state => ({
                                        monsters: state.monsters.filter(m => m.id !== monster.id)
                                    }));
                                } else {
                                    useGameStore.setState(state => ({
                                        monsters: state.monsters.map(m => m.id === monster.id ? {
                                            ...m,
                                            currentAction: 'stand',
                                            stateStartTime: now,
                                            standCycles: 0
                                        } : m)
                                    }));
                                }
                            }
                        }
                        return; // Skip normal logic
                    }

                    // NORMAL BATTLE LOGIC
                    const elapsed = now - (monster.stateStartTime || now);
                    const currentDuration = MONSTER_DURATIONS[monster.name]?.[monster.currentAction] || 1000;

                    if (elapsed >= currentDuration) {
                        // Animation finished! Decision time.

                        // 1. DIE ANIMATION FINISHED
                        if (monster.currentAction === 'die1') {
                            useGameStore.setState(state => ({
                                monsters: state.monsters.filter(m => m.id !== monster.id)
                            }));
                            // Increment kill counter for fever time
                            useGameStore.getState().incrementKillCount();
                            return;
                        }

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

                                // Deal Damage Logic
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
                        else if (monster.currentAction.startsWith('attack')) {
                            // Attack finished. Did we get hit during attack?
                            let nextAction = 'stand';
                            let nextStateTime = now;

                            if (monster.lastHitTime) {
                                const hitDuration = MONSTER_DURATIONS[monster.name]?.['hit1'] || 500;
                                const timeSinceHit = now - monster.lastHitTime;

                                // If hit fits within the "recent enough to show" window
                                // AND the hit duration hasn't fully elapsed yet?
                                // User said: "if duration remains, show for remaining time".
                                if (timeSinceHit < hitDuration) {
                                    nextAction = 'hit1';
                                    nextStateTime = monster.lastHitTime; // Resume hit animation from actual hit time
                                }
                            }

                            // If not transitioning to hit, check death or stand
                            if (nextAction !== 'hit1') {
                                if (monster.stats.hp <= 0) {
                                    nextAction = 'die1';
                                }
                            }

                            useGameStore.setState(state => ({
                                monsters: state.monsters.map(m => m.id === monster.id ? {
                                    ...m,
                                    currentAction: nextAction,
                                    stateStartTime: nextStateTime,
                                    standCycles: 0,
                                    // Clear lastHitTime if we consumed it or it expired? 
                                    // Maybe safely clear it to prevent re-triggering?
                                    // If we transition to hit1, we use it. If we skip, we ignore.
                                    lastHitTime: nextAction === 'hit1' ? m.lastHitTime : undefined
                                } : m)
                            }));
                        }
                        else if (monster.currentAction.startsWith('hit')) {
                            // Hit finished.
                            if (monster.stats.hp <= 0) {
                                useGameStore.setState(state => ({
                                    monsters: state.monsters.map(m => m.id === monster.id ? {
                                        ...m,
                                        currentAction: 'die1',
                                        stateStartTime: now,
                                        standCycles: 0
                                    } : m)
                                }));
                            } else {
                                // Alive. Increment cycles (Getting hit counts as waiting/charging!)
                                const newCycles = (monster.standCycles || 0) + 1;

                                if (newCycles >= monster.stats.spd) {
                                    // Attack! (Counter-attack after hit)
                                    const attackAction = 'attack1';
                                    useGameStore.setState(state => ({
                                        monsters: state.monsters.map(m => m.id === monster.id ? {
                                            ...m,
                                            currentAction: attackAction,
                                            stateStartTime: now,
                                            standCycles: 0
                                        } : m)
                                    }));

                                    // Deal Damage Logic
                                    const rawDmg = monster.stats.atk * (100 / (100 + heroStats.def));
                                    const variance = 0.95 + Math.random() * 0.1;
                                    let finalDmg = rawDmg * variance;
                                    damageHero(Math.ceil(finalDmg));
                                } else {
                                    // Go to stand with increased cycles
                                    useGameStore.setState(state => ({
                                        monsters: state.monsters.map(m => m.id === monster.id ? {
                                            ...m,
                                            currentAction: 'stand',
                                            stateStartTime: now,
                                            standCycles: newCycles
                                        } : m)
                                    }));
                                }
                            }
                        }
                        else if (monster.currentAction === 'die1') {
                            // Death animation finished. Remove monster.
                            useGameStore.setState(state => ({
                                monsters: state.monsters.filter(m => m.id !== monster.id)
                            }));
                        }
                    }
                });

                // 2. Hero Attack Logic
                // This comes SECOND so it can interrupt 'stand' loops set by the monster logic.
                const heroCooldown = 1000 / heroStats.spd;
                // Only auto-attack if NOT in dev mode AND NOT frozen
                if (appMode !== 'dev' && !isFrozen && time - lastHeroAttackRef.current >= heroCooldown) {
                    const validTargets = currentMonsters.filter(m => m.stats.hp > 0 && m.currentAction !== 'die1');

                    let target = null;

                    // 1. Check if we have a locked target that is still valid
                    if (currentTargetIdRef.current !== null) {
                        const lockedTarget = validTargets.find(m => m.id === currentTargetIdRef.current);
                        if (lockedTarget) {
                            target = lockedTarget;
                        } else {
                            currentTargetIdRef.current = null; // Target lost/dead
                        }
                    }

                    // 2. If no target (or lost), pick the first valid one (sequential)
                    if (!target && validTargets.length > 0) {
                        // Sort by ID or X position? Array order is usually spawn order, which works for sequential.
                        target = validTargets[0];
                        currentTargetIdRef.current = target.id;
                    }

                    if (target) {
                        triggerCharacterAttack();
                        const rawDmg = heroStats.atk * (100 / (100 + target.stats.def));
                        const variance = 0.95 + Math.random() * 0.1;
                        let finalDmg = rawDmg * variance;

                        if (Math.random() < heroStats.critRate) {
                            finalDmg *= heroStats.critDmg;
                        }

                        damageMonster(target.id, Math.ceil(finalDmg));

                        // Check LATEST state to ensure we interrupt nicely
                        const currentMonsterState = useGameStore.getState().monsters.find(m => m.id === target!.id);
                        if (currentMonsterState && currentMonsterState.currentAction === 'stand') {
                            useGameStore.getState().setMonsterAction(target.id, 'hit1');
                            // No timeout needed; loop handles transition back to stand
                        }
                    }
                    lastHeroAttackRef.current = time;
                }

                // 3. Handle Death Triggers REMOVED - NOW HANDLED IN LOOP

                // Check for Wave Clear
                const remainingMonsters = useGameStore.getState().monsters;
                if (remainingMonsters.length === 0) {
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
