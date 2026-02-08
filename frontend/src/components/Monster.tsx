import React from 'react';

interface MonsterProps {
    name: string;
    action?: string;
    x?: number; // Optional, handled by parent positioning mostly, but good to have prop interface
    y?: number;
    scale?: number;
}

export const Monster = ({ name, action = 'stand', scale = 1.0 }: MonsterProps) => {
    // Default to 'stand' action if not provided.
    // Assumes asset path pattern: /monster/{name}/{name}_{action}.webp
    // Some monsters might have slightly different naming conventions (e.g. numbered stands), 
    // but for MVP we assume standard naming or just use what we found (goblin_stand.webp).
    // If specific monsters disobey this rule, we'll need a mapping in registry.
    // Based on "goblin_stand.webp", pattern seems to be `{name}_{action}`.

    // Note: Some assets might be just "stand.webp" inside nested folders if structure varies,
    // but looking at "goblin" folder it was "goblin_stand.webp".
    // Let's assume consistent naming of {folder_name}_{action}.webp inside {folder_name}/

    const src = `/monster/${name}/${name}_${action}.webp`;

    return (
        <div
            className="flex items-end justify-center pointer-events-none"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'bottom center' // Ensure scaling happens from feet
            }}
        >
            <img
                src={src}
                alt={`${name} ${action}`}
                className="w-auto h-auto max-w-none object-contain pixelated rendering-pixelated"
                style={{ imageRendering: 'pixelated' }}
                draggable={false}
            />
        </div>
    );
};
