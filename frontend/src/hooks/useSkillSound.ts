import { useCallback } from 'react';
import { SKILL_CATEGORIES } from '../constants/assetRegistry';

export const useSkillSound = () => {
    const getSkillCategory = (skillName: string): string | null => {
        for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
            if (skills.includes(skillName)) return category;
        }
        return null;
    };

    const playSound = useCallback((skillName: string, type: 'use' | 'hit') => {
        const category = getSkillCategory(skillName);
        if (!category) return;

        const basePath = `/skill_sound/${category}/${skillName}`;

        const playAudio = (path: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const audio = new Audio(path);
                audio.volume = 0.5;

                audio.onended = () => resolve();

                audio.onerror = () => reject(); // Skip if file not found

                // Try to play
                audio.play().catch(() => reject());
            });
        };

        const playSequence = async (suffixes: string[]): Promise<boolean> => {
            let playedAny = false;
            for (const suffix of suffixes) {
                try {
                    await playAudio(`${basePath}_${suffix}.mp3`);
                    playedAny = true;
                } catch (e) {
                    // Ignore missing files and continue to next
                    continue;
                }
            }
            return playedAny;
        };

        if (type === 'use') {
            const playLogic = async () => {
                // Priority 1: Standard Use sounds
                const playedUse = await playSequence(['use', 'use2']);

                // Priority 2: Special/Loop (Only if no Use sounds existed)
                if (!playedUse) {
                    await playSequence(['special', 'loop']);
                }
            };
            playLogic();
        } else if (type === 'hit') {
            playAudio(`${basePath}_hit.mp3`).catch(() => { });
        }
    }, []);

    return { playSound };
};
