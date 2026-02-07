import React from 'react';
import { useGameStore } from '../store/gameStore';

export const Character = () => {
    const { characterAction } = useGameStore();

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <img
                src={`/character/${characterAction}.webp`}
                alt="Character"
                className="w-full h-full object-contain pixelated rendering-pixelated"
                style={{ imageRendering: 'pixelated' }}
                key={characterAction}
                draggable={false}
            />
        </div>
    );
};
