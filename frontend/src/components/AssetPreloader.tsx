import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_DURATIONS, ATTACK_ANIMATIONS, SKILL_CATEGORIES } from '../constants/assetRegistry';

export const AssetPreloader = () => {
    const { setLoadingProgress, setIsLoading } = useGameStore();
    const loadedCountRef = useRef(0);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        const allAssets: string[] = [];

        // 1. Collect Monster Assets (monster/[name]/[name]_[action].webp)
        Object.keys(MONSTER_DURATIONS).forEach(monsterName => {
            const actions = Object.keys(MONSTER_DURATIONS[monsterName]);
            actions.forEach(action => {
                allAssets.push(`/monster/${monsterName}/${monsterName}_${action}.webp`);
            });
        });

        // 2. Collect Character Assets (character/[action].webp)
        const charBasics = ['alert', 'heal', 'jump', 'stand1', 'stand2', 'walk1', 'walk2', 'prone', 'forge'];
        const charAttacks = [...ATTACK_ANIMATIONS];
        // Need to check if ATTACK_ANIMATIONS are just names or full paths? 
        // Based on registry it seems they are action names like 'shoot1', 'swingO1'.
        [...charBasics, ...charAttacks].forEach(action => {
            allAssets.push(`/character/${action}.webp`);
        });

        // 3. Collect Skill Assets (skills/[category]/[name].webp)
        Object.entries(SKILL_CATEGORIES).forEach(([category, skills]) => {
            skills.forEach(skillName => {
                allAssets.push(`/skills/${category}/${skillName}.webp`);
                // Special case for souleclipse background
                if (skillName === 'souleclipse') {
                    allAssets.push(`/skills/${category}/${skillName}background.webp`);
                }
            });
        });

        // 4. UI Assets
        const uiAssets = [
            'anvil.webp', 'anvil2.webp',
            'craft_btn.webp', 'enhance_btn.webp', 'skill_btn.webp', 'start_btn.webp',
            'goldenhammar.webp', 'head.webp', 'healthbar.webp',
            'inventory.webp', 'itembox.webp', 'profile_box.webp',
            'sword.webp', 'title_mobile.webp'
        ];
        uiAssets.forEach(asset => allAssets.push(`/ui/${asset}`));

        // 5. Background Assets
        const bgAssets = ['city.webp', 'city2.webp', 'intro.webp', 'subway.webp'];
        bgAssets.forEach(asset => allAssets.push(`/background/${asset}`));

        // 6. Skill Sounds (Optional - browsers might lazy load audio, but preloading helps)
        // Check for 'use', 'use2', 'special', 'hit' for each skill
        const soundSuffixes = ['use', 'use2', 'special', 'hit'];
        Object.entries(SKILL_CATEGORIES).forEach(([category, skills]) => {
            skills.forEach(skillName => {
                soundSuffixes.forEach(suffix => {
                    // Note: Not all combinations exist, but browser cache will handle 404s gracefully if we just try new Audio()
                    // or we can just preload common ones. For now, let's skip explicit audio preloading to avoid 404 console spam
                    // unless we know for sure they exist. 
                    // Given the dynamic nature, we'll let Audio() handle loading on demand or preload silently.
                    // If we strictly want to preload, we'd need a registry of existing files.
                    // Let's at least preload 'use' which exists for most.
                    if (suffix === 'use') {
                        // allAssets.push(`/skill_sound/${category}/${skillName}_${suffix}.mp3`);
                    }
                });
            });
        });

        const total = allAssets.length;
        if (total === 0) {
            setLoadingProgress(100);
            setIsLoading(false);
            return;
        }

        console.log(`[AssetPreloader] Starting preload of ${total} assets...`);

        const updateProgress = () => {
            loadedCountRef.current += 1;
            const progress = Math.min(100, Math.floor((loadedCountRef.current / total) * 100));
            setLoadingProgress(progress);

            if (loadedCountRef.current >= total) {
                console.log('[AssetPreloader] All assets loaded!');
                // Minimal delay to show 100% before switching
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            }
        };

        allAssets.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = updateProgress;
            img.onerror = () => {
                console.warn(`[AssetPreloader] Failed to load: ${src}`);
                updateProgress(); // Proceed anyway
            };
        });

    }, [setLoadingProgress, setIsLoading]);

    return null;
};
