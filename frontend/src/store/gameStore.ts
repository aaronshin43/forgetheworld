import { create } from 'zustand';
import { ATTACK_ANIMATIONS, CHARACTER_DURATIONS } from '../constants/assetRegistry';

export interface ActiveEffect {
    id: number;
    name: string;
    x: number;
    y: number;
    scale: number;
}

export interface ActiveMonster {
    id: number;
    name: string;
    x: number;
    y: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    image: string | null; // Base64 or URL
    status: 'loading' | 'ready';
}

interface GameState {
    hp: number;
    maxHp: number;
    film: number;
    maxFilm: number;
    timeScale: number;
    viewMode: 'battle' | 'camera';
    scanMode: 'craft' | 'skill' | 'enhance' | null;
    isAnalyzing: boolean;
    scanResult: any | null;
    inventory: (InventoryItem | null)[];
    lastFilmRecharge: number;

    // Visuals State
    activeEffects: ActiveEffect[];
    monsters: ActiveMonster[];
    characterAction: string;
    currentBackground: string;
    appMode: 'intro' | 'game' | 'dev';

    setHp: (hp: number) => void;
    useFilm: () => boolean;
    addFilm: (amount: number) => void;
    setTimeScale: (scale: number) => void;
    setViewMode: (mode: 'battle' | 'camera') => void;
    setScanMode: (mode: 'craft' | 'skill' | 'enhance' | null) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setScanResult: (result: any) => void;
    updateFilmRecharge: (time: number) => void;

    // Visuals Actions
    addEffect: (name: string, config: { x: number; y: number; scale: number }) => void;
    removeEffect: (id: number) => void;
    spawnMonster: (name: string) => void;
    clearMonsters: () => void;
    triggerCharacterAttack: () => void;
    setCharacterAction: (action: string) => void;
    setInventoryItem: (index: number, item: InventoryItem | null) => void;
    setBackground: (background: string) => void;
    setAppMode: (mode: 'intro' | 'game' | 'dev') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    hp: 100,
    maxHp: 100,
    film: 3,
    maxFilm: 3,
    timeScale: 1.0,
    viewMode: 'battle',
    scanMode: null,
    isAnalyzing: false,
    scanResult: null,
    inventory: Array(6).fill(null),
    lastFilmRecharge: Date.now(),

    activeEffects: [],
    monsters: [],
    characterAction: 'stand1',
    currentBackground: 'city', // Default background

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
    setScanMode: (scanMode) => set({ scanMode }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setScanResult: (scanResult) => set({ scanResult }),
    updateFilmRecharge: (time) => {
        const { film, maxFilm, lastFilmRecharge } = get();
        if (film < maxFilm) {
            if (time - lastFilmRecharge > 15000) {
                set({ film: film + 1, lastFilmRecharge: time });
            }
        } else {
            set({ lastFilmRecharge: time });
        }
    },

    addEffect: (name, config) => {
        const id = Date.now() + Math.random();
        set((state) => ({ activeEffects: [...state.activeEffects, { id, name, ...config }] }));
    },
    removeEffect: (id) => {
        set((state) => ({ activeEffects: state.activeEffects.filter(e => e.id !== id) }));
    },
    spawnMonster: (name) => {
        const id = Date.now() + Math.random();
        const x = 55 + Math.random() * 30;
        const y = 40 + Math.random() * 30;
        set((state) => ({ monsters: [...state.monsters, { id, name, x, y }] }));
    },
    clearMonsters: () => set({ monsters: [] }),

    setCharacterAction: (action) => set({ characterAction: action }),
    triggerCharacterAttack: () => {
        const randomAttack = ATTACK_ANIMATIONS[Math.floor(Math.random() * ATTACK_ANIMATIONS.length)];
        const duration = CHARACTER_DURATIONS[randomAttack] || 1000;

        set({ characterAction: randomAttack });

        // Reset to stand after animation
        setTimeout(() => {
            const current = get().characterAction;
            if (current === randomAttack) {
                set({ characterAction: 'stand1' });
            }
        }, duration);
    },

    setInventoryItem: (index, item) => {
        const newInventory = [...get().inventory];
        newInventory[index] = item;
        set({ inventory: newInventory });
    },

    setBackground: (background) => set({ currentBackground: background }),

    // App Mode State
    appMode: 'intro',
    setAppMode: (mode: 'intro' | 'game' | 'dev') => set({ appMode: mode })
}));
