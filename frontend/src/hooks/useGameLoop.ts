import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export const useGameLoop = () => {
    const { timeScale, updateFilmRecharge } = useGameStore();
    const requestRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);

    const animate = (time: number) => {
        if (previousTimeRef.current !== null) { // Check for null explicitly or just use truthiness if 0 is not valid (time is never 0 in loop usually)
            const deltaTime = time - previousTimeRef.current;
            // const scaledDelta = deltaTime * timeScale;

            updateFilmRecharge(time);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [timeScale, updateFilmRecharge]);
};
