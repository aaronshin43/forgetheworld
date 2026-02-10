import { create } from 'zustand';
import { CHARACTER_DURATIONS, SKILL_CATEGORIES, SKILL_CONFIGS, MONSTER_FORMATIONS, MONSTER_LIST, MONSTER_BASE_STATS, SKILL_DURATIONS } from '../constants/assetRegistry';

export interface DamageNumber {
    id: string;
    monsterId: string;
    amount: number;
    isCrit: boolean;
    x: number;
    y: number;
    timestamp: number;
}

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

export const calculateCombatPower = (stats: EntityStats): number => {
    return Math.floor(
        (stats.atk * 1.5) +
        (stats.maxHp * 0.2) +
        (stats.def * 0.8) +
        (stats.spd * 50) +
        (stats.critRate * 1000) +
        (stats.critDmg * 100)
    );
};

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
    lastHitTime?: number;
}

export interface InventoryItemStats {
    atk?: number;
    def?: number;
    hp?: number;
    maxHp?: number;
    spd?: number;
    critRate?: number;
    critDmg?: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    image: string | null; // Base64 or URL
    status: 'loading' | 'ready';
    description?: string;
    stats?: InventoryItemStats;
    grade?: string; // S, A, B, C, D
    rarity?: number; // 1-10
    enhancementLevel?: number;
    absorbedMaterials?: { name: string; grade: string }[];
}

interface MaterialData {
    name: string;
    grade: string;
    rarity: number;
    stats: Record<string, number>;
    description: string;
}

interface GameState {
    // Session State
    sessionStartTime: number;
    interactionMode: 'battle' | 'crafting' | 'enhancing';
    tempMaterial: MaterialData | null;
    isBgmMuted: boolean;

    // Hero State
    heroStats: EntityStats;
    // ...

    // Actions
    startCrafting: () => void;
    startEnhancement: () => void;
    startSkillMode: () => void;
    scanMaterial: (materialData: { name: string, rarity: number, affectedStats: string[], description: string }) => void;
    enhanceItem: (targetItemId: string) => void;
    triggerEvolution: (itemId: string) => Promise<void>;
    triggerSkill: (skillName: string) => void;
    cancelEnhancement: () => void;

    // ... existing actions

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
    killCount: number;
    feverTimeReady: boolean;
    gameStartTime: number;
    survivalTime: number;
    stageState: 'spawning' | 'walking' | 'fighting' | 'cleared' | 'gameover';
    timeScale: number;

    // App/View State
    viewMode: 'battle' | 'camera';
    scanMode: 'craft' | 'skill' | 'enhance' | null;
    isAnalyzing: boolean;
    isSkillActive: boolean;
    scanResult: any | null;
    inventory: (InventoryItem | null)[];
    appMode: 'intro' | 'game' | 'dev';
    isLoading: boolean;
    loadingProgress: number;
    isMenuOpen: boolean;

    // Visuals State
    activeEffects: ActiveEffect[];
    damageNumbers: DamageNumber[];
    monsters: ActiveMonster[];
    monsterIdCounter: number; // For generating unique IDs
    characterAction: string;
    currentBackground: string;

    // Actions
    setHeroStats: (stats: Partial<EntityStats>) => void;
    damageHero: (amount: number) => void;
    healHero: (amount: number) => void;
    triggerGameOver: () => void;
    addExp: (amount: number) => void;

    useFilm: () => boolean;
    addFilm: (amount: number) => void;
    updateFilmRecharge: (time: number) => void;

    setWave: (wave: number) => void;
    setStageState: (state: 'spawning' | 'walking' | 'fighting' | 'cleared' | 'gameover') => void;
    setTimeScale: (scale: number) => void;
    incrementKillCount: () => void;
    useFeverTime: () => void;

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
    addDamageNumber: (monsterId: string, amount: number, isCrit: boolean, x: number, y: number) => void;
    removeDamageNumber: (id: string) => void;

    triggerCharacterAttack: () => void;
    setCharacterAction: (action: string) => void;
    setInventoryItem: (index: number, item: InventoryItem | null) => void;
    setBackground: (background: string) => void;
    setAppMode: (mode: 'intro' | 'game' | 'dev') => void;
    toggleBgmMute: () => void;
    setIsLoading: (isLoading: boolean) => void;
    setLoadingProgress: (progress: number) => void;
    setIsMenuOpen: (isMenuOpen: boolean) => void;
    resetGame: () => void;
    devEquipRandomItem: () => void;
    craftItem: (index: number, itemData: { id: string, name: string, description?: string, rarity: number, affectedStats: string[] }) => void;

    // Asset Obfuscation Cache
    assetCache: Record<string, string>;
    setAssetUrl: (path: string, url: string) => void;
    getAssetUrl: (path: string) => string;
}

const GRADE_THRESHOLDS = { Legendary: 14, Epic: 11, Unique: 8, Rare: 5, Common: 0 };

const calculateGrade = (rarity: number, sessionStartTime: number): string => {
    const minutesPlayed = (Date.now() - sessionStartTime) / 60000;
    const timeBonus = Math.floor(minutesPlayed / 10); // +1 per 10 mins
    const score = rarity + timeBonus;

    if (score >= GRADE_THRESHOLDS.Legendary) return 'Legendary';
    if (score >= GRADE_THRESHOLDS.Epic) return 'Epic';
    if (score >= GRADE_THRESHOLDS.Unique) return 'Unique';
    if (score >= GRADE_THRESHOLDS.Rare) return 'Rare';
    return 'Common';
};

const generateItemStats = (baseStats: EntityStats, grade: string, affectedStats: string[]) => {
    const multiplierMap: Record<string, number> = {
        Legendary: 1.5,
        Epic: 1.3,
        Unique: 1.15,
        Rare: 1.05,
        Common: 0.9
    };
    const multiplier = multiplierMap[grade] || 1.0;

    const newStats = { ...baseStats };
    const changes: Record<string, number> = {};
    const itemStats: any = {};

    affectedStats.slice(0, 3).forEach(key => {
        let baseVal = 0;
        if (key === 'atk') baseVal = 50;
        if (key === 'def') baseVal = 20;
        if (key === 'maxHp') baseVal = 100;
        if (key === 'sp') baseVal = 0.1; // Typo fix: spd
        if (key === 'spd') baseVal = 0.1;
        if (key === 'critRate') baseVal = 0.05;
        if (key === 'critDmg') baseVal = 0.1;

        const variance = 0.8 + Math.random() * 0.4;
        const finalVal = baseVal * multiplier * variance;

        const val = Number(finalVal.toFixed(2));

        if (key === 'maxHp') {
            newStats.maxHp = Number((newStats.maxHp + val).toFixed(2));
            newStats.hp = Number((newStats.hp + val).toFixed(2));
        } else {
            // Safe casting
            if (key in newStats) {
                (newStats as any)[key] = Number(((newStats as any)[key] + val).toFixed(2));
            }
        }

        changes[key] = val;
        itemStats[key] = val;
    });

    return { newStats, changes, itemStats };
};

export const useGameStore = create<GameState>((set, get) => ({
    // Session Init
    sessionStartTime: Date.now(),
    interactionMode: 'battle',
    tempMaterial: null,

    // Hero Initial State
    heroStats: {
        hp: 1000,
        maxHp: 1000,
        atk: 3000,
        def: 5,
        spd: 0.7, // Attacks per second
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
    killCount: 0,
    feverTimeReady: false,
    gameStartTime: Date.now(),
    survivalTime: 0,
    stageState: 'spawning',
    timeScale: 1.0,

    viewMode: 'battle',
    scanMode: null,
    isAnalyzing: false,
    isSkillActive: false,
    scanResult: null,
    inventory: Array(6).fill(null),
    appMode: 'intro',
    isLoading: true,
    loadingProgress: 0,
    isMenuOpen: false,

    // Asset Cache Implementation
    assetCache: {},
    setAssetUrl: (path, url) => set((state) => ({
        assetCache: { ...state.assetCache, [path]: url }
    })),
    getAssetUrl: (path) => {
        return get().assetCache[path] || path;
    },

    activeEffects: [],
    damageNumbers: [],
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
        const updatedStats = { ...state.heroStats, hp: newHp };

        // Trigger game over if HP reaches 0
        if (newHp === 0 && state.stageState !== 'gameover') {
            get().triggerGameOver();
        }

        return { heroStats: updatedStats };
    }),
    healHero: (amount) => set((state) => ({
        heroStats: { ...state.heroStats, hp: Math.min(state.heroStats.maxHp, state.heroStats.hp + amount) }
    })),
    triggerGameOver: () => set((state) => {
        const survivalTime = Math.floor((Date.now() - state.gameStartTime) / 1000); // in seconds
        return {
            stageState: 'gameover',
            survivalTime,
            characterAction: 'prone'
        };
    }),
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
    incrementKillCount: () => set((state) => {
        const newKillCount = state.killCount + 1;
        const feverTimeReady = newKillCount >= 10;
        return { killCount: newKillCount, feverTimeReady };
    }),
    useFeverTime: () => {
        const { feverTimeReady, triggerSkill } = get();
        if (!feverTimeReady) return;

        // Get random ultimate skill
        const ultimateSkills = SKILL_CATEGORIES.ultimate;
        if (ultimateSkills && ultimateSkills.length > 0) {
            const randomSkill = ultimateSkills[Math.floor(Math.random() * ultimateSkills.length)];
            triggerSkill(randomSkill);
        }

        // Reset counter
        set({ killCount: 0, feverTimeReady: false });
    },

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
    setIsLoading: (isLoading) => set({ isLoading }),
    setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
    setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
    addDamageNumber: (monsterId, amount, isCrit, x, y) => set((state) => ({
        damageNumbers: [...state.damageNumbers, {
            id: `dmg_${Date.now()}_${Math.random()}`,
            monsterId,
            amount,
            isCrit,
            x,
            y,
            timestamp: Date.now()
        }]
    })),
    removeDamageNumber: (id) => set((state) => ({
        damageNumbers: state.damageNumbers.filter(d => d.id !== id)
    })),
    resetGame: () => set((state) => ({
        heroStats: {
            hp: 100,
            maxHp: 100,
            atk: 30,
            def: 5,
            spd: 1.0,
            critRate: 0.1,
            critDmg: 1.5,
            moveSpeed: 0,
            scale: 1.0
        },
        heroLevel: 1,
        heroExp: 0,
        heroMaxExp: 100,
        wave: 1,
        score: 0,
        stageState: 'spawning',
        timeScale: 1.0,
        monsters: [],
        activeEffects: [],
        monsterIdCounter: 0,
        characterAction: 'stand1',
        isAnalyzing: false,
        scanResult: null,
        scanMode: null,
        isMenuOpen: false,
        inventory: Array(6).fill(null)
    })),
    craftItem: (index, itemData) => set((state) => {
        const grade = calculateGrade(itemData.rarity, state.sessionStartTime);
        const { newStats, changes, itemStats } = generateItemStats(state.heroStats, grade, itemData.affectedStats);

        console.log(`[Crafted] ${itemData.name} (Grade ${grade})`, changes);

        const newItem: InventoryItem = {
            id: itemData.id,
            name: itemData.name,
            image: null, // Image comes later via async update
            status: 'loading',
            description: itemData.description,
            stats: itemStats,
            grade: grade,
            rarity: itemData.rarity
        };

        const newInventory = [...state.inventory];
        newInventory[index] = newItem;

        return {
            inventory: newInventory,
            heroStats: newStats
        };
    }),
    startCrafting: () => set({ interactionMode: 'crafting', viewMode: 'camera', scanMode: 'craft' }),
    startSkillMode: () => set({ interactionMode: 'battle', viewMode: 'camera', scanMode: 'skill', tempMaterial: null }),
    // Enhancement Actions
    startEnhancement: () => set({ interactionMode: 'enhancing', viewMode: 'camera', scanMode: 'enhance', tempMaterial: null }),

    scanMaterial: (data) => set((state) => {
        const grade = calculateGrade(data.rarity, state.sessionStartTime);
        const { itemStats } = generateItemStats(state.heroStats, grade, data.affectedStats);

        return {
            tempMaterial: {
                name: data.name,
                grade,
                rarity: data.rarity,
                stats: itemStats,
                description: data.description
            },
            // ResultOverlay needs `scanResult` to be set
            scanResult: {
                analysis: { ...data, stats: itemStats, rarity_score: data.rarity, affected_stats: data.affectedStats },
                flavor: { name: data.name, description: data.description }
            } as any
        };
    }),

    enhanceItem: (targetItemId) => {
        const state = get();
        const { tempMaterial, inventory } = state;
        if (!tempMaterial) return;

        let shouldEvolve = false;

        const newInventory = inventory.map(item => {
            if (item && item.id === targetItemId) {
                const newStats = { ...(item.stats || {}) };
                Object.entries(tempMaterial.stats).forEach(([key, val]) => {
                    const k = key as keyof InventoryItemStats;
                    newStats[k] = Number(((newStats[k] || 0) + (val as number)).toFixed(2));
                });

                const newAbsorbed = [...(item.absorbedMaterials || []), { name: tempMaterial.name, grade: tempMaterial.grade }];
                const newLevel = (item.enhancementLevel || 0) + 1;

                console.log(`[Enhanced] ${item.name} +${newLevel} (Absorbed ${tempMaterial.name})`);

                if (newLevel > 0 && newLevel % 3 === 0) {
                    shouldEvolve = true;
                }

                return {
                    ...item,
                    stats: newStats,
                    enhancementLevel: newLevel,
                    absorbedMaterials: newAbsorbed
                };
            }
            return item;
        });

        set({
            inventory: newInventory,
            tempMaterial: null,
            interactionMode: 'battle',
            viewMode: 'battle',
            scanResult: null
        });

        if (shouldEvolve) {
            get().triggerEvolution(targetItemId);
        }
    },

    triggerEvolution: async (itemId) => {
        const { inventory } = get();
        const item = inventory.find(i => i && i.id === itemId);
        if (!item) return;

        set({ isAnalyzing: true, viewMode: 'battle', interactionMode: 'enhancing' });

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
            const response = await fetch(`${apiBase}/evolve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    base_item: { name: item.name, description: item.description },
                    absorbed_materials: item.absorbedMaterials || []
                })
            });
            const data = await response.json();

            set((state) => ({
                inventory: state.inventory.map(i => {
                    if (i && i.id === itemId) {
                        return {
                            ...i,
                            name: data.name,
                            description: data.description,
                            image: data.image,
                            grade: i.grade === 'Common' ? 'Rare' : i.grade === 'Rare' ? 'Unique' : i.grade === 'Unique' ? 'Epic' : 'Legendary',
                            rarity: Math.min((i.rarity || 1) + 2, 10),
                            status: 'ready'
                        };
                    }
                    return i;
                }),
                isAnalyzing: false,
                interactionMode: 'battle',
                scanResult: {
                    analysis: {
                        item: data.name,
                        rarity_score: (item.rarity || 1) + 2,
                        affected_stats: Object.keys(item.stats || {}),
                        stats: item.stats
                    },
                    flavor: { name: data.name, description: data.description }
                } as any
            }));

        } catch (e) {
            console.error("Evolution Failed", e);
            set({ isAnalyzing: false });
        }
    },

    cancelEnhancement: () => set({ interactionMode: 'battle', viewMode: 'battle', tempMaterial: null, scanResult: null }),

    devEquipRandomItem: () => set((state) => {
        const inventory = [...state.inventory];
        const emptyIndex = inventory.findIndex(item => item === null);
        if (emptyIndex === -1) return {};

        const statsKeys = ['atk', 'def', 'maxHp', 'spd', 'critRate', 'critDmg'];
        const selected = [...statsKeys].sort(() => 0.5 - Math.random()).slice(0, 3);

        const { newStats, itemStats } = generateItemStats(state.heroStats, 'Legendary', selected);

        const newItem: InventoryItem = {
            id: `dev-${Date.now()}`,
            name: 'Dev God Sword',
            image: '/ui/sword.webp',
            status: 'ready',
            description: 'Cheated item.',
            stats: itemStats,
            grade: 'Legendary',
            rarity: 10
        };
        inventory[emptyIndex] = newItem;

        return {
            inventory,
            heroStats: newStats
        };
    }),
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
    damageMonster: (id, amount) => {
        const state = get();
        const monster = state.monsters.find(m => m.id === id);
        if (!monster || monster.currentAction === 'die1') return;

        // Calculate crit
        const isCrit = Math.random() < state.heroStats.critRate;
        const finalAmount = isCrit ? Math.ceil(amount * state.heroStats.critDmg) : Math.ceil(amount);

        // Add damage number
        state.addDamageNumber(
            monster.id.toString(),
            finalAmount,
            isCrit,
            monster.x,
            monster.y
        );

        set((state) => {
            const newMonsters = state.monsters.map(m => {
                if (m.id === id) {
                    // If already dead/dying, don't interrupt death with hit
                    if (m.currentAction === 'die1') return m;

                    const newHp = Math.max(0, m.stats.hp - finalAmount);

                    // If attacking, don't interrupt. Just queue hit time.
                    if (m.currentAction.startsWith('attack')) {
                        return {
                            ...m,
                            stats: { ...m.stats, hp: newHp },
                            lastHitTime: Date.now()
                        };
                    }

                    // Otherwise, force hit reaction immediately
                    return {
                        ...m,
                        stats: { ...m.stats, hp: newHp },
                        currentAction: 'hit1',
                        stateStartTime: Date.now(),
                        actionId: (m.actionId || 0) + 1,
                        lastHitTime: Date.now()
                    };
                }
                return m;
            });
            return { monsters: newMonsters };
        });
    },
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

    isBgmMuted: false,

    setAppMode: (mode) => set((state) => {
        if (mode === 'game') {
            // Reset game state on new game start
            return {
                appMode: mode,
                killCount: 0,
                feverTimeReady: false,
                wave: 1,
                score: 0,
                stageState: 'spawning',
                gameStartTime: Date.now(),
                survivalTime: 0,
                heroStats: { ...state.heroStats, hp: state.heroStats.maxHp }, // Reset HP
                monsters: [],
                activeEffects: [],
                damageNumbers: []
            };
        }
        return { appMode: mode };
    }),

    toggleBgmMute: () => set((state) => ({ isBgmMuted: !state.isBgmMuted })),

    setCharacterAction: (action) => set({ characterAction: action }),
    triggerCharacterAttack: () => {
        // 1. Character Animation (Sprite) – basic 스킬은 swingP1 모션만 사용
        const characterMotion = 'swingP1';
        const duration = CHARACTER_DURATIONS[characterMotion] || 1000;
        set({ characterAction: characterMotion });

        // 2. Skill Effect (Visual)
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
            if (current === characterMotion) {
                set({ characterAction: 'stand1' });
            }
        }, duration);
    },

    triggerSkill: (skillName) => {
        const { heroStats, activeEffects, addEffect, damageMonster, monsters } = get();
        const skillDuration = (SKILL_DURATIONS as any)[skillName] || 3000;

        // 1. Set Active (Freezes monsters via useGameLoop)
        set({ isSkillActive: true, scanResult: null, interactionMode: 'battle', viewMode: 'battle' });

        // 2. Add Visual Effect
        // Central position for "Screen Nuke" skills typical of this genre
        const config = SKILL_CONFIGS[skillName] || { x: 50, y: 50, scale: 1.0 };
        get().addEffect(skillName, {
            x: config.x,
            y: config.y,
            scale: config.scale
        });

        // 3. Delayed Damage
        setTimeout(() => {
            const currentMonsters = get().monsters;
            const multiplier = 5.0; // High damage for skills
            const rawDmg = heroStats.atk * multiplier;

            // AOE Damage to ALL visible monsters
            currentMonsters.forEach(m => {
                let dmg = rawDmg * (100 / (100 + m.stats.def));
                if (Math.random() < heroStats.critRate) dmg *= heroStats.critDmg;
                get().damageMonster(m.id, Math.ceil(dmg));
            });

            // 4. Resume
            set({ isSkillActive: false });
        }, skillDuration * 0.9);
    },
}));
