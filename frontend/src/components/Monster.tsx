import React from 'react';
import { useGameStore } from '../store/gameStore';

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
    const { getAssetUrl } = useGameStore();
    const originalPath = `/monster/${name}/${name}_${action}.webp`;
    // We append query param to blob URL? Blob URLs don't obey query params for cache busting usually, 
    // but they are unique per session. 
    // However, if the blob URL is constant for the session, the animation might not restart if we just re-mount same src?
    // Actually, animated WebP in <img> usually plays once or loops. 
    // To restart, we usually need to re-mount the <img> tag (which key={action} does).
    // Let's use getAssetUrl(originalPath).
    const src = getAssetUrl(originalPath);

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
