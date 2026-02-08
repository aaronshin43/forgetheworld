import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_DURATIONS, ATTACK_ANIMATIONS } from '../constants/assetRegistry';

export const AssetPreloader = () => {
    const { setLoadingProgress, setIsLoading } = useGameStore();
    const loadedCountRef = useRef(0);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        const allAssets: string[] = [];

        // 1. Collect Monster Assets
        Object.keys(MONSTER_DURATIONS).forEach(monsterName => {
            const actions = Object.keys(MONSTER_DURATIONS[monsterName]);
            actions.forEach(action => {
                allAssets.push(`/monster/${monsterName}/${monsterName}_${action}.webp`);
            });
        });

        // 2. Collect Character Assets
        const charBasics = ['alert', 'heal', 'jump', 'stand1', 'stand2', 'walk1', 'walk2'];
        [...charBasics, ...ATTACK_ANIMATIONS].forEach(action => {
            allAssets.push(`/character/${action}.webp`);
        });

        // 3. UI/Background Assets (Optional but recommended)
        allAssets.push('/ui/head.webp', '/ui/profile_box.webp', '/ui/goldenhammar.webp');
        allAssets.push('/background/city.webp', '/background/city2.webp', '/background/subway.webp');

        const total = allAssets.length;
        if (total === 0) {
            setLoadingProgress(100);
            setIsLoading(false);
            return;
        }

        const updateProgress = () => {
            loadedCountRef.current += 1;
            const progress = Math.min(100, Math.floor((loadedCountRef.current / total) * 100));
            setLoadingProgress(progress);

            if (loadedCountRef.current >= total) {
                // Small delay to ensure state update renders fully
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            }
        };

        allAssets.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = updateProgress;
            img.onerror = () => {
                console.warn(`Failed to preload asset: ${src}`);
                updateProgress(); // Proceed anyway to avoid hanging
            };
        });

    }, [setLoadingProgress, setIsLoading]);

    return null;
};
