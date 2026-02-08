import React, { useEffect, useRef, useState } from 'react';
import { SKILL_DURATIONS, SKILL_CATEGORIES } from '../constants/assetRegistry';
import { useSkillSound } from '../hooks/useSkillSound';

interface SkillEffectProps {
    name: string;
    x: number;
    y: number;
    scale: number;
    onComplete?: () => void;
}

const getSkillPath = (name: string) => {
    if (SKILL_CATEGORIES.basic.includes(name)) return `/skills/basic/${name}.webp`;
    if (SKILL_CATEGORIES.buff.includes(name)) return `/skills/buff/${name}.webp`;
    if (SKILL_CATEGORIES.deal && SKILL_CATEGORIES.deal.includes(name)) return `/skills/deal/${name}.webp`;
    return `/skills/ultimate/${name}.webp`; // Default to ultimate
};

export const SkillEffect = ({ name, x, y, scale, onComplete }: SkillEffectProps) => {
    const duration = SKILL_DURATIONS[name] || 3000;
    const imagePath = getSkillPath(name);
    const isUltimate = SKILL_CATEGORIES.ultimate.includes(name);
    const hasSeparateBackground = name === 'souleclipse';
    const { playSound } = useSkillSound();

    // Use a ref to store the latest onComplete callback
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const [uniqueId] = useState(Date.now());

    useEffect(() => {
        // 1. Play Use Sound immediately
        playSound(name, 'use');

        // 2. Schedule Hit Sound at 75% duration (25% remaining)
        const hitTime = duration * 0.75;
        const hitTimer = setTimeout(() => {
            playSound(name, 'hit');
        }, hitTime);

        // 3. Schedule Completion
        const endTimer = setTimeout(() => {
            if (onCompleteRef.current) {
                onCompleteRef.current();
            }
        }, duration);

        return () => {
            clearTimeout(hitTimer);
            clearTimeout(endTimer);
        };
    }, [duration, name, playSound]);

    return (
        <div
            className="flex items-center justify-center p-0 m-0"
            style={{
                width: '500px',
                height: '500px'
            }}
        >
            {/* Background layer for skills with separate background */}
            {hasSeparateBackground && (
                <img
                    src={`/skills/ultimate/${name}background.webp?t=${uniqueId}`}
                    alt={`${name} background`}
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable={false}
                    style={{ zIndex: 0 }}
                />
            )}

            {/* Main effect layer */}
            <img
                src={`${imagePath}?t=${uniqueId}`}
                alt={name}
                className="w-full h-full object-contain mix-blend-screen"
                draggable={false}
                style={{ position: 'relative', zIndex: 1 }}
            />
        </div>
    );
};
