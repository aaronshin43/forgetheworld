import { create } from 'zustand';
import { ATTACK_ANIMATIONS, CHARACTER_DURATIONS, SKILL_CATEGORIES, SKILL_CONFIGS, MONSTER_FORMATIONS, MONSTER_LIST, MONSTER_BASE_STATS } from '../constants/assetRegistry';

export interface EntityStats {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    spd: number; // Attack Speed
    critRate: number;
    critDmg: number;
    moveSpeed: number; // Movement Speed
    scale: number;
}

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
    targetX: number;
    stats: EntityStats;
    currentAction: string;
    lastAttackTime: number;
    standCycles: number;
    stateStartTime: number;
    actionId: number; // For forcing unique animation per action event
}

export interface InventoryItem {
    id: string;
    name: string;
    image: string | null; // Base64 or URL
    status: 'loading' | 'ready';
}

interface GameState {
    // Hero State
    heroStats: EntityStats;
    heroLevel: number;
    heroExp: number;
    heroMaxExp: number;

    // Resource State
    film: number;
    maxFilm: number;
    lastFilmRecharge: number;

    // Game Loop State
    wave: number;
    score: number;
    stageState: 'spawning' | 'walking' | 'fighting' | 'cleared' | 'gameover';
    timeScale: number;

    // App/View State
    viewMode: 'battle' | 'camera';
    scanMode: 'craft' | 'skill' | 'enhance' | null;
    isAnalyzing: boolean;
    scanResult: any | null;
    inventory: (InventoryItem | null)[];
    appMode: 'intro' | 'game' | 'dev';
    isLoading: boolean;
    loadingProgress: number;

    // Visuals State
    activeEffects: ActiveEffect[];
    monsters: ActiveMonster[];
    monsterIdCounter: number; // For generating unique IDs
    characterAction: string;
    currentBackground: string;

    // Actions
    setHeroStats: (stats: Partial<EntityStats>) => void;
    damageHero: (amount: number) => void;
    healHero: (amount: number) => void;
    addExp: (amount: number) => void;

    useFilm: () => boolean;
    addFilm: (amount: number) => void;
    updateFilmRecharge: (time: number) => void;

    setWave: (wave: number) => void;
    setStageState: (state: 'spawning' | 'walking' | 'fighting' | 'cleared' | 'gameover') => void;
    setTimeScale: (scale: number) => void;

    setViewMode: (mode: 'battle' | 'camera') => void;
    setScanMode: (mode: 'craft' | 'skill' | 'enhance' | null) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setScanResult: (result: any) => void;

    // Entity Actions
    spawnMonster: (name: string, stats: EntityStats, x: number, y: number, targetX: number) => void;
    spawnWave: (count: number, monsterName?: string) => void;
    updateMonsterPosition: (id: number, x: number) => void;
    damageMonster: (id: number, amount: number) => void;
    setMonsterAction: (id: number, action: string) => void;
    clearMonsters: () => void;

    addEffect: (name: string, config: { x: number; y: number; scale: number }) => void;
    removeEffect: (id: number) => void;

    triggerCharacterAttack: () => void;
    setCharacterAction: (action: string) => void;

    setInventoryItem: (index: number, item: InventoryItem | null) => void;
    setBackground: (background: string) => void;
    setAppMode: (mode: 'intro' | 'game' | 'dev') => void;
    setIsLoading: (isLoading: boolean) => void;
    setLoadingProgress: (progress: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    // Hero Initial State
    heroStats: {
        hp: 1000,
        maxHp: 1000,
        atk: 300,
        def: 50,
        spd: 1.0, // Attacks per second
        critRate: 0.1, // 10%
        critDmg: 1.5, // 150%
        moveSpeed: 0, // Hero doesn't move
        scale: 1.0
    },
    heroLevel: 1,
    heroExp: 0,
    heroMaxExp: 100,

    film: 3,
    maxFilm: 3,
    lastFilmRecharge: Date.now(),

    // Game Loop State
    wave: 1,
    score: 0,
    stageState: 'spawning',
    timeScale: 1.0,

    viewMode: 'battle',
    scanMode: null,
    isAnalyzing: false,
    scanResult: null,
    inventory: Array(6).fill(null),
    appMode: 'intro',
    isLoading: true,
    loadingProgress: 0,

    activeEffects: [],
    monsters: [],
    monsterIdCounter: 0,
    characterAction: 'stand1',
    currentBackground: 'city',

    // Hero Actions
    setHeroStats: (stats) => set((state) => ({
        heroStats: { ...state.heroStats, ...stats }
    })),
    damageHero: (amount) => set((state) => {
        const newHp = Math.max(0, state.heroStats.hp - amount);
        return {
            heroStats: { ...state.heroStats, hp: newHp },
            // Optional: check game over here or in loop
        };
    }),
    healHero: (amount) => set((state) => ({
        heroStats: { ...state.heroStats, hp: Math.min(state.heroStats.maxHp, state.heroStats.hp + amount) }
    })),
    addExp: (amount) => set((state) => {
        let { heroExp, heroMaxExp, heroLevel } = state;
        heroExp += amount;
        while (heroExp >= heroMaxExp) {
            heroExp -= heroMaxExp;
            heroLevel += 1;
            heroMaxExp = Math.floor(heroMaxExp * 1.2);
            // Increase stats on level up
            // Keeping it simple for now
        }
        return { heroExp, heroMaxExp, heroLevel };
    }),

    useFilm: () => {
        const { film } = get();
        if (film > 0) {
            set({ film: film - 1 });
            return true;
        }
        return false;
    },
    addFilm: (amount) => set((state) => ({ film: Math.min(state.film + amount, state.maxFilm) })),
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

    setWave: (wave) => set({ wave }),
    setStageState: (stageState) => set({ stageState }),
    setTimeScale: (timeScale) => set({ timeScale }),

    setViewMode: (viewMode) => set({ viewMode }),
    setScanMode: (scanMode) => set({ scanMode }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setScanResult: (scanResult) => set({ scanResult }),
    setInventoryItem: (index, item) => {
        const newInventory = [...get().inventory];
        newInventory[index] = item;
        set({ inventory: newInventory });
    },
    setBackground: (background) => set({ currentBackground: background }),
    setAppMode: (appMode) => set({ appMode }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setLoadingProgress: (loadingProgress) => set({ loadingProgress }),

    // Monster Actions
    spawnMonster: (name, stats, x, y, targetX) => {
        set((state) => {
            const newId = state.monsterIdCounter + 1;
            return {
                monsterIdCounter: newId,
                monsters: [...state.monsters, {
                    id: newId,
                    name,
                    x,
                    y,
                    targetX,
                    stats: { ...stats },
                    currentAction: 'move',
                    lastAttackTime: 0,
                    standCycles: 0,
                    stateStartTime: Date.now(),
                    actionId: 0
                }]
            };
        });
    },
    spawnWave: (count, monsterName) => {
        const { wave, spawnMonster } = get();
        // If monsterName is provided, stick to it. Otherwise random.
        const name = monsterName || MONSTER_LIST[Math.floor(Math.random() * MONSTER_LIST.length)];

        // Formation
        const spawnCount = count || 1;
        const formation = (MONSTER_FORMATIONS as any)?.[spawnCount] || (MONSTER_FORMATIONS as any)?.[1]; // type casting safe here as constants are reliable

        for (let i = 0; i < spawnCount; i++) {
            const base = MONSTER_BASE_STATS[name] || { hp: 100, atk: 10, def: 5, spd: 1.0, moveSpeed: 10, scale: 1.0 };
            const stats = {
                hp: Math.floor(base.hp * (1 + wave * 0.2)),
                maxHp: Math.floor(base.hp * (1 + wave * 0.2)),
                atk: Math.floor(base.atk * (1 + wave * 0.1)),
                def: Math.floor(base.def * (1 + wave * 0.1)),
                spd: base.spd,
                critRate: 0.05,
                critDmg: 1.5,
                moveSpeed: base.moveSpeed,
                scale: base.scale
            };

            const pos = formation?.[i] || { y: 50, xOffset: 0 };
            const targetX = 70 + pos.xOffset;
            const startX = 100 + pos.xOffset;

            spawnMonster(name, stats, startX, pos.y, targetX);
        }
    },
    updateMonsterPosition: (id, x) => set((state) => ({
        monsters: state.monsters.map(m => m.id === id ? { ...m, x } : m)
    })),
    damageMonster: (id, amount) => set((state) => {
        const newMonsters = state.monsters.map(m => {
            if (m.id === id) {
                return { ...m, stats: { ...m.stats, hp: Math.max(0, m.stats.hp - amount) } };
            }
            return m;
        });
        return { monsters: newMonsters };
    }),
    setMonsterAction: (id, action) => set((state) => ({
        monsters: state.monsters.map(m => {
            if (m.id === id) {
                // Prevent restarting death animation if already dying
                if (action === 'die1' && m.currentAction === 'die1') {
                    return m;
                }

                // Only update if action is different to avoid resetting start time on redundant calls?
                // The loop logic will handle redundancy. If we call this, we imply a change or restart.
                return {
                    ...m,
                    currentAction: action,
                    stateStartTime: Date.now(),  // Reset time on action change
                    actionId: (m.actionId || 0) + 1 // Guaranteed unique increment
                };
            }
            return m;
        })
    })),
    clearMonsters: () => set({ monsters: [] }),

    // Effects
    addEffect: (name, config) => {
        const id = Date.now() + Math.random();
        set((state) => ({ activeEffects: [...state.activeEffects, { id, name, ...config }] }));
    },
    removeEffect: (id) => {
        set((state) => ({ activeEffects: state.activeEffects.filter(e => e.id !== id) }));
    },

    setCharacterAction: (action) => set({ characterAction: action }),
    triggerCharacterAttack: () => {
        // 1. Character Animation (Sprite)
        const randomAttack = ATTACK_ANIMATIONS[Math.floor(Math.random() * ATTACK_ANIMATIONS.length)];
        const duration = CHARACTER_DURATIONS[randomAttack] || 1000;
        set({ characterAction: randomAttack });

        // 2. Skill Effect (Visual)
        // Pick random basic skill
        const basicSkills = SKILL_CATEGORIES.basic;
        if (basicSkills && basicSkills.length > 0) {
            const randomSkillName = basicSkills[Math.floor(Math.random() * basicSkills.length)];
            const config = SKILL_CONFIGS[randomSkillName] || { x: 50, y: 50, scale: 1.0 };

            get().addEffect(randomSkillName, {
                x: config.x,
                y: config.y,
                scale: config.scale
            });
        }

        setTimeout(() => {
            const current = get().characterAction;
            if (current === randomAttack) {
                set({ characterAction: 'stand1' });
            }
        }, duration);
    },
}));
