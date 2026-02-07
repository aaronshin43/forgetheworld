import React, { useEffect, useRef, useState } from 'react';
import { SKILL_DURATIONS } from '../constants/assetRegistry';

interface SkillEffectProps {
    name: string;
    x: number;
    y: number;
    scale: number;
    onComplete?: () => void;
}

export const SkillEffect = ({ name, x, y, scale, onComplete }: SkillEffectProps) => {
    const duration = SKILL_DURATIONS[name] || 3000;

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
                width: '300px',
                height: '300px'
            }}
        >
            <img
                src={`/skills/ultimate/${name}.webp?t=${uniqueId}`}
                alt={name}
                className="w-full h-full object-contain mix-blend-screen"
                draggable={false}
            />
        </div>
    );
};
