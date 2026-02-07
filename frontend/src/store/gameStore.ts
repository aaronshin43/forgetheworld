import { create } from 'zustand';

interface GameState {
    hp: number;
    maxHp: number;
    film: number;
    maxFilm: number;
    timeScale: number;
    viewMode: 'battle' | 'camera';
    isAnalyzing: boolean;
    scanResult: any | null;
    inventory: (string | null)[]; // Placeholder for items
    lastFilmRecharge: number; // Timestamp

    setHp: (hp: number) => void;
    useFilm: () => boolean;
    addFilm: (amount: number) => void;
    setTimeScale: (scale: number) => void;
    setViewMode: (mode: 'battle' | 'camera') => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setScanResult: (result: any) => void;
    updateFilmRecharge: (time: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    hp: 100,
    maxHp: 100,
    film: 3,
    maxFilm: 3,
    timeScale: 1.0,
    viewMode: 'battle',
    isAnalyzing: false,
    scanResult: null,
    inventory: Array(6).fill(null),
    lastFilmRecharge: Date.now(),

    setHp: (hp) => set({ hp }),
    useFilm: () => {
        const { film } = get();
        if (film > 0) {
            set({ film: film - 1 });
            return true;
        }
        return false;
    },
    addFilm: (amount) => set((state) => ({ film: Math.min(state.film + amount, state.maxFilm) })),
    setTimeScale: (timeScale) => set({ timeScale }),
    setViewMode: (viewMode) => set({ viewMode }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setScanResult: (scanResult) => set({ scanResult }),
    updateFilmRecharge: (time) => {
        const { film, maxFilm, lastFilmRecharge } = get();
        if (film < maxFilm) {
            if (time - lastFilmRecharge > 15000) { // 15 seconds
                set({ film: film + 1, lastFilmRecharge: time });
            }
        } else {
            set({ lastFilmRecharge: time });
        }
    },
}));
