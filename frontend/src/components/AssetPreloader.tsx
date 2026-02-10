import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_DURATIONS, ATTACK_ANIMATIONS, SKILL_CATEGORIES } from '../constants/assetRegistry';
import { fetchAndDecrypt } from '../utils/assetSecurity';

export const AssetPreloader = () => {
    const { setLoadingProgress, setIsLoading, setAssetUrl } = useGameStore();
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
        const bgAssets = ['city.webp', 'intro.webp'];
        bgAssets.forEach(asset => allAssets.push(`/background/${asset}`));

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
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            }
        };

        // Secure Loading Logic: Fetch .bin, Decrypt, Store Blob URL
        allAssets.forEach(async (path) => {
            try {
                const blobUrl = await fetchAndDecrypt(path);
                setAssetUrl(path, blobUrl);

                // Preload the image from Blob URL to browser cache
                const img = new Image();
                img.src = blobUrl;
                img.onload = updateProgress;
                img.onerror = () => {
                    console.warn(`[AssetPreloader] Failed to render blob: ${path}`);
                    updateProgress();
                };
            } catch (e) {
                console.error(`[AssetPreloader] Failed to decrypt: ${path}`, e);
                updateProgress();
            }
        });

    }, [setLoadingProgress, setIsLoading, setAssetUrl]);

    return null;
};
