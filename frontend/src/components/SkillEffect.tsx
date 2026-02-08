import React, { useEffect, useRef, useState } from 'react';
import { SKILL_DURATIONS, SKILL_CATEGORIES } from '../constants/assetRegistry';

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

    // Use a ref to store the latest onComplete callback
    // This prevents the useEffect from re-running when the parent component re-renders
    // and creates a new onComplete function reference.
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const [uniqueId] = useState(Date.now());

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onCompleteRef.current) {
                onCompleteRef.current();
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]); // Only re-run if duration changes (which it shouldn't for the same skill)

    return (
        <div
            className="flex items-center justify-center p-0 m-0"
            style={{
                width: '500px',
                height: '500px'
            }}
        >
            <img
                src={`${imagePath}?t=${uniqueId}`}
                alt={name}
                className="w-full h-full object-contain mix-blend-screen"
                draggable={false}
            />
        </div>
    );
};
