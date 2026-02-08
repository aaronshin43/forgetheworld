import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_FORMATIONS, MONSTER_LIST, MONSTER_BASE_STATS } from '../constants/assetRegistry';

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
                // Determine spawn count (1-5, biased by wave)
                const spawnCount = Math.min(5, Math.max(1, Math.floor(wave / 2) + Math.floor(Math.random() * 2)));

                // Pick ONE random monster type for this wave
                const monsterName = MONSTER_LIST[Math.floor(Math.random() * MONSTER_LIST.length)];

                // Spawn monsters
                for (let i = 0; i < spawnCount; i++) {
                    const base = MONSTER_BASE_STATS[monsterName] || { hp: 100, atk: 10, def: 5, spd: 1.0, moveSpeed: 10, scale: 1.0 };

                    // Base stats scaling
                    const stats = {
                        hp: Math.floor(base.hp * (1 + wave * 0.2)),
                        maxHp: Math.floor(base.hp * (1 + wave * 0.2)),
                        atk: Math.floor(base.atk * (1 + wave * 0.1)),
                        def: Math.floor(base.def * (1 + wave * 0.1)),
                        spd: base.spd,
                        critRate: 0.05,
                        critDmg: 1.5,
                        moveSpeed: base.moveSpeed,
                        scale: base.scale
                    };

                    // Formation Logic
                    // We need to import MONSTER_FORMATIONS. Since we can't easily add imports here without overwriting whole file,
                    // let's assume they are imported or just reimplement simple offset logic if import fails.
                    // Actually, I should check returns of previous steps to be safe.
                    // But for now, let's assume imports from Step 896 are still valid (Wait, Step 896 was a failed tool call?)
                    // Ah, I need to ensure MONSTER_FORMATIONS is imported.
                    // Since I am modifying this block, I will assume the import is there or I need to add it.
                    // Let's check imports first.

                    // Actually, I see the file content from Step 936. 'MONSTER_FORMATIONS' is NOT imported.
                    // I will fix the import in a separate call or just use hardcoded logic for now? No, better use registry.

                    // Wait, Step 896 failed. Step 898 (my manual view) showed 'MONSTER_BASE_STATS' but not 'MONSTER_FORMATIONS' in the import.
                    // So I need to add the import too.

                    // For this call, I will update the logic assuming the import exists, then I will fix the import.
                    // Actually I can't assume. I will update this block AND the import in one go if I use multi_replace? NO, multi_replace is better.

                    // I will just update the logic here to use formation values if available, or simple calculation.
                    // But the user specifically asked for formation logic.
                    // I will use `any` to bypass TS for formation map if needed or just fix imports properly.

                    // Let's look at Step 936 again. Line 2:
                    // import { ATTACK_ANIMATIONS, CHARACTER_DURATIONS, SKILL_CATEGORIES, SKILL_CONFIGS } from '../constants/assetRegistry';
                    // Oh wait, useGameLoop imports from store. NO, it imports from assetRegistry?
                    // Step 936 Line 2: `import { useGameStore } from '../store/gameStore';`
                    // It does NOT import from assetRegistry at all in Step 936 view!
                    // I need to add the import.

                    const formation = (MONSTER_FORMATIONS as any)?.[spawnCount] || (MONSTER_FORMATIONS as any)?.[1];
                    const pos = formation?.[i] || { y: 50, xOffset: 0 };

                    const targetX = 70 + pos.xOffset; // 75 is baseline
                    const startX = 100 + pos.xOffset; // Stagger start too

                    spawnMonster(monsterName, stats, startX, pos.y, targetX);
                }
                setStageState('walking');
            }
            else if (stageState === 'walking') {
                let allArrived = true;

                monsters.forEach(monster => {
                    const target = monster.targetX || 70;
                    if (monster.x > target) {
                        allArrived = false;
                        // Move animation if not already
                        if (monster.currentAction !== 'move') {
                            useGameStore.getState().setMonsterAction(monster.id, 'move');
                        }

                        // Move left: distance = speed * delta (in seconds)
                        // x is percentage. moveSpeed is %/sec.
                        const moveDist = monster.stats.moveSpeed * (scaledDelta / 1000);
                        updateMonsterPosition(monster.id, Math.max(target, monster.x - moveDist));
                    } else if (monster.currentAction === 'move') {
                        // Stopped walking, set to stand
                        useGameStore.getState().setMonsterAction(monster.id, 'stand');
                    }
                });

                if (allArrived && monsters.length > 0) {
                    setStageState('fighting');
                }
            }
            else if (stageState === 'fighting') {
                // Hero Attack Logic
                // cooldown = 1000ms / spd
                const heroCooldown = 1000 / heroStats.spd;
                if (time - lastHeroAttackRef.current >= heroCooldown) {
                    // Attack Random Monster
                    const target = monsters[Math.floor(Math.random() * monsters.length)];
                    if (target) {
                        triggerCharacterAttack();
                        // Calculate Damage
                        // Dmg = Atk * (100 / (100 + Def)) * (0.95 ~ 1.05)
                        const rawDmg = heroStats.atk * (100 / (100 + target.stats.def));
                        const variance = 0.95 + Math.random() * 0.1;
                        let finalDmg = rawDmg * variance;

                        // Critical Hit
                        if (Math.random() < heroStats.critRate) {
                            finalDmg *= heroStats.critDmg;
                            // TODO: Add critical visual indicator
                        }

                        damageMonster(target.id, Math.ceil(finalDmg));

                        // Monster Hit Animation (conditional)
                        // Only play hit animation if currently STANDING (not attacking, not moving, not already hit)
                        const currentMonsterState = useGameStore.getState().monsters.find(m => m.id === target.id);
                        if (currentMonsterState && currentMonsterState.currentAction === 'stand') {
                            useGameStore.getState().setMonsterAction(target.id, 'hit1');
                            setTimeout(() => {
                                // Check if still alive and valid state
                                const m = useGameStore.getState().monsters.find(x => x.id === target.id);
                                if (m && m.stats.hp > 0 && m.currentAction === 'hit1') {
                                    useGameStore.getState().setMonsterAction(target.id, 'stand');
                                }
                            }, 400); // Increased to 400ms (approx 2 frames at 5fps, or just longer visibility)
                        }
                    }
                    lastHeroAttackRef.current = time;
                }

                // Monster Attack Logic (Simplified for now - strictly by time or just random chance per frame?)
                // Since we don't track per-monster attack timer in this loop cleanly without state updates...
                // Let's assume monsters attack if they are alive.
                // NOTE: Proper implementation requires tracking `lastAttackTime` for *each* monster in the store or local ref map.
                // For MVP, let's just do a random chance based on SPD * delta

                monsters.forEach(monster => {
                    // Chance to attack this frame = spd * (delta/1000)
                    // if spd is 1 atk/sec, and delta is 16ms, chance is 0.016
                    // This creates stochastic attack timing rather than rhythmic, which is fine for chaos.
                    const attackChance = monster.stats.spd * (scaledDelta / 1000);

                    if (Math.random() < attackChance) {
                        // Trigger Attack Animation
                        useGameStore.getState().setMonsterAction(monster.id, 'attack1');
                        setTimeout(() => {
                            const currentM = useGameStore.getState().monsters.find(m => m.id === monster.id);
                            if (currentM && currentM.stats.hp > 0 && currentM.currentAction === 'attack1') {
                                useGameStore.getState().setMonsterAction(monster.id, 'stand');
                            }
                        }, 500); // Attack duration approx

                        // Attack Hero
                        const rawDmg = monster.stats.atk * (100 / (100 + heroStats.def));
                        const variance = 0.95 + Math.random() * 0.1;
                        let finalDmg = rawDmg * variance;
                        damageHero(Math.ceil(finalDmg));
                    }
                });

                // Check for Deaths
                const aliveMonsters = monsters.filter(m => m.stats.hp > 0);
                const deadMonsters = monsters.filter(m => m.stats.hp <= 0 && m.currentAction !== 'die1'); // Just died

                // Handle Death Animation triggers
                deadMonsters.forEach(m => {
                    useGameStore.getState().setMonsterAction(m.id, 'die1');
                    // Remove after animation (e.g. 1s)
                    setTimeout(() => {
                        // We need a 'removeMonster' action ideally, but for now damageMonster filters them?
                        // Wait, damageMonster only updates HP. 
                        // To remove, we need to update state. 
                        // Actually, current damageMonster implementation filters out dead monsters immediately!
                        // Step 1015 changed damageMonster to NOT auto-remove. Good.
                        // Now we manually remove after delay.
                        useGameStore.setState(state => ({
                            monsters: state.monsters.filter(monster => monster.id !== m.id)
                        }));
                    }, 800);
                });

                if (monsters.length === 0 && deadMonsters.length === 0 && aliveMonsters.length === 0) {
                    // All gone
                    setStageState('cleared');
                }
            }
            else if (stageState === 'cleared') {
                setWave(wave + 1);
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
    }, [timeScale, stageState, monsters, heroStats, wave]); // Re-bind on key state changes
};
