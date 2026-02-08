import React from 'react';

interface MonsterProps {
    name: string;
    action?: string;
    x?: number;
    y?: number;
    scale?: number;
    animXOffset?: number;
    animYOffset?: number;
    uuid?: string; // Globally Unique ID for cache busting
}

export const Monster = ({ name, action = 'stand', scale = 1.0, animXOffset = 0, animYOffset = 0, uuid }: MonsterProps) => {
    // Default to 'stand' action if not provided.
    // Assumes asset path pattern: /monster/{name}/{name}_{action}.webp
    // Appending tmestamp/uuid to force restart of animated webp
    const src = `/monster/${name}/${name}_${action}.webp?id=${uuid || Date.now()}`;

    return (
        <div
            className="flex items-end justify-center pointer-events-none"
            style={{
                transform: `translateX(${animXOffset}px) translateY(${animYOffset}px) scale(${scale})`,
                transformOrigin: 'bottom center' // Ensure scaling happens from feet
            }}
        >
            <img
                key={action} // Force remount on action change to eliminate glitch
                src={src}
                alt={`${name} ${action}`}
                className="w-auto h-auto max-w-none object-contain pixelated rendering-pixelated"
                style={{ imageRendering: 'pixelated' }}
                draggable={false}
            />
        </div>
    );
};
