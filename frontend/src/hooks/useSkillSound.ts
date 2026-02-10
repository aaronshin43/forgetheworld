import { useCallback } from 'react';
import { SKILL_CATEGORIES } from '../constants/assetRegistry';
import { SOUND_REGISTRY } from '../constants/soundRegistry';

export const useSkillSound = () => {
    const getSkillCategory = (skillName: string): string | null => {
        for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
            if (skills.includes(skillName)) return category;
        }
        return null; // Should we default to 'basic'? Or just fail? Fail safe.
    };

    const playSound = useCallback((skillName: string, type: 'use' | 'hit') => {
        const category = getSkillCategory(skillName);
        if (!category) return;

        const basePath = `/skill_sound/${category}/${skillName}`;

        const playAudio = (path: string): Promise<void> => {
            // Check if file exists in registry to avoid 404 logs
            if (!SOUND_REGISTRY.has(path)) {
                return Promise.resolve(); // Skip silently
            }

            return new Promise((resolve, reject) => {
                const audio = new Audio(path);
                audio.volume = 0.4;

                audio.onended = () => resolve();
                audio.onerror = () => resolve(); // Safely resolve even on error

                audio.play().catch(() => resolve()); // Ignore play errors (autoplay policy etc)
            });
        };

        const playSequence = async (suffixes: string[]): Promise<boolean> => {
            let playedAny = false;
            for (const suffix of suffixes) {
                const path = `${basePath}_${suffix}.mp3`;
                // Use the registry check inside playAudio to skip
                if (SOUND_REGISTRY.has(path)) {
                    await playAudio(path);
                    playedAny = true;
                }
            }
            return playedAny;
        };

        if (type === 'use') {
            const playLogic = async () => {
                // Priority 1: Standard Use sounds
                const playedUse = await playSequence(['use', 'use2', 'use3']);

                // Priority 2: Special/Loop (Only if no Use sounds existed)
                if (!playedUse) {
                    await playSequence(['special', 'loop']);
                }
            };
            playLogic();
        } else if (type === 'hit') {
            playAudio(`${basePath}_hit.mp3`);
        }
    }, []);

    return { playSound };
};
