import { useEffect, useRef } from 'react';

export const useBGM = (src: string, options: { loop?: boolean; volume?: number; enabled?: boolean } = {}) => {
    const { loop = true, volume = 0.3, enabled = true } = options;
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create or update audio instance
        if (!audioRef.current || audioRef.current.src !== new URL(src, window.location.href).href) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(src);
        }

        const audio = audioRef.current;
        audio.loop = loop;
        audio.volume = volume;

        const play = async () => {
            try {
                await audio.play();
                // console.log('[useBGM] Playing:', src);
            } catch (err) {
                console.warn('[useBGM] Autoplay blocked, waiting for interaction:', err);
                const onInteract = () => {
                    audio.play().catch(e => console.error('[useBGM] Play failed after interaction:', e));
                    document.removeEventListener('click', onInteract);
                    document.removeEventListener('keydown', onInteract);
                };
                document.addEventListener('click', onInteract);
                document.addEventListener('keydown', onInteract);
            }
        };

        if (enabled) {
            play();
        } else {
            audio.pause();
        }

        return () => {
            audio.pause();
            document.removeEventListener('click', () => { }); // optimization: clearer cleanup
        };
    }, [src, enabled, loop, volume]);

    return audioRef;
};
