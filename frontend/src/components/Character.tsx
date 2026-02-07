import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { CHARACTER_DURATIONS, ATTACK_ANIMATIONS } from '../constants/assetRegistry';

export interface CharacterHandle {
    triggerAttack: () => void;
    playAnimation: (name: string) => void;
}

export const Character = forwardRef<CharacterHandle, {}>((props, ref) => {
    const [action, setAction] = useState('stand1');
    const [isAttacking, setIsAttacking] = useState(false);

    useImperativeHandle(ref, () => ({
        triggerAttack: () => {
            const randomAttack = ATTACK_ANIMATIONS[Math.floor(Math.random() * ATTACK_ANIMATIONS.length)];
            playAnimation(randomAttack);
        },
        playAnimation: (name: string) => {
            playAnimation(name);
        }
    }));

    const playAnimation = (name: string) => {
        setAction(name);
        setIsAttacking(true);

        const duration = CHARACTER_DURATIONS[name] || 1000;

        // Reset to stand after duration
        setTimeout(() => {
            setAction('stand1'); // Default idle
            setIsAttacking(false);
        }, duration);
    };

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* 
        Using img tag for animated webp. 
        Next.js Image component might freeze animations or require unoptimized prop.
      */}
            <img
                src={`/character/${action}.webp`}
                alt="Character"
                className="w-full h-full object-contain pixelated rendering-pixelated"
                style={{ imageRendering: 'pixelated' }}
                key={action} // Force re-render to restart animation if needed
            />
        </div>
    );
});

Character.displayName = 'Character';
