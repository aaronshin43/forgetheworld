import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface DamageNumberProps {
    id: string;
    amount: number;
    isCrit: boolean;
    x: number;
    y: number;
    timestamp: number;
    standHeight: number; // Height of stand image for positioning
}

export const DamageNumber = ({ id, amount, isCrit, x, y, standHeight }: DamageNumberProps) => {
    const removeDamageNumber = useGameStore(state => state.removeDamageNumber);

    useEffect(() => {
        const timer = setTimeout(() => {
            removeDamageNumber(id);
        }, 1200); // Show for 1.2 seconds

        return () => clearTimeout(timer);
    }, [id, removeDamageNumber]);

    return (
        <div
            className="absolute z-50 pointer-events-none"
            style={{
                left: isCrit ? `${x - 13}%` : `${x - 10}%`,
                top: `${y - (standHeight * 0.15)}%`, // Position above monster based on stand height
                animation: 'damageFloat 1.2s ease-out forwards'
            }}
        >
            <div
                className={`
                    ${isCrit ? 'font-metallic-emboss-red' : 'font-metallic-emboss'}
                    ${isCrit ? 'text-5xl' : 'text-4xl'}
                    font-bold
                `}
            >
                {amount}
            </div>
        </div>
    );
};

// Add this to globals.css:
// @keyframes damageFloat {
//     0% {
//         opacity: 1;
//         transform: translateY(0) scale(0.5);
//     }
//     30% {
//         transform: translateY(-20px) scale(1);
//     }
//     100% {
//         opacity: 0;
//         transform: translateY(-60px) scale(0.8);
//     }
// }
