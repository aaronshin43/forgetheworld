import React from 'react';
import { useGameStore } from '../store/gameStore';

export const Character = () => {
    const { characterAction, getAssetUrl } = useGameStore();

    return (
        <div className="flex items-end justify-center">
            <img
                src={getAssetUrl(`/character/${characterAction}.webp`)}
                alt="Character"
                className="w-auto h-auto max-w-none object-contain pixelated rendering-pixelated"
                style={{ imageRendering: 'pixelated' }}
                key={characterAction}
                draggable={false}
            />
        </div>
    );
};
