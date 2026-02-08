export const CHARACTER_DURATIONS: Record<string, number> = {
    "alert": 1500,
    "heal": 800,
    "jump": 100,
    "shoot1": 800,
    "shoot2": 820,
    "shootF": 700,
    "stabO1": 800,
    "stabO2": 800,
    "stabOF": 700,
    "stabT1": 750,
    "stabT2": 750,
    "stabTF": 700,
    "stand1": 1500,
    "stand2": 1500,
    "swingO1": 800,
    "swingO2": 800,
    "swingO3": 800,
    "swingOF": 700,
    "swingP1": 800,
    "swingP2": 800,
    "swingPF": 700,
    "swingT1": 800,
    "swingT2": 800,
    "swingT3": 800,
    "swingTF": 700,
    "walk1": 720,
    "walk2": 720
};

export const SKILL_DURATIONS: Record<string, number> = {
    // Ultimate
    "astralblitz": 7140,
    "durandal": 5760,
    "groundzero": 5460,
    "shadower": 5100,
    "supercannonexplosion": 6540,
    "ren": 3480,
    "cataclysm": 4590,
    "spiritcalibur": 7020,
    "souleclipse": 8340,
    "combodefault": 4400,

    // Basic
    "blast": 960,
    "blast2": 1080,
    "divinecharge": 870,
    "divinecharge2": 1170,
    "divineswing": 900,

    // Buff
    "blueaura": 1920,
    "darkaura": 1920,
    "drainaura": 960,
    "guardianspirit": 1200,
    "heavendoor": 1800,
    "installshield": 1440,
    "signusblessing": 1980,
    "unionaura": 1920,
    "valhalar": 1380,
    "windbooster": 900,
    "yellowaura": 1920
};

export const SKILL_CATEGORIES = {
    basic: ["blast", "blast2", "divinecharge", "divinecharge2", "divineswing"],
    buff: ["blueaura", "darkaura", "drainaura", "guardianspirit", "heavendoor", "installshield", "signusblessing", "unionaura", "valhalar", "windbooster", "yellowaura"],
    ultimate: ["astralblitz", "durandal", "groundzero", "shadower", "supercannonexplosion", "ren", "cataclysm", "spiritcalibur", "souleclipse", "combodefault"]
};

export interface SkillConfig {
    x: number;
    y: number;
    scale: number;
}

export const SKILL_CONFIGS: Record<string, SkillConfig> = {
    // Ultimate Defaults
    "astralblitz": { x: 50, y: 50, scale: 1.5 },
    "durandal": { x: 50, y: 50, scale: 1.2 },
    "groundzero": { x: 50, y: 80, scale: 2.0 },
    "shadower": { x: 50, y: 50, scale: 1.0 },
    "supercannonexplosion": { x: 50, y: 50, scale: 1.8 },
    "ren": { x: 50, y: 50, scale: 1.0 },
    "cataclysm": { x: 50, y: 50, scale: 2.0 },
    "spiritcalibur": { x: 50, y: 50, scale: 1.0 },
    "souleclipse": { x: 50, y: 50, scale: 1.5 },
    "combodefault": { x: 50, y: 50, scale: 1.0 },

    // Basic Defaults (Standard Hit)
    "blast": { x: 50, y: 50, scale: 1.0 },
    "blast2": { x: 50, y: 50, scale: 1.0 },
    "divinecharge": { x: 50, y: 50, scale: 1.0 },
    "divinecharge2": { x: 50, y: 50, scale: 1.0 },
    "divineswing": { x: 50, y: 50, scale: 1.0 },

    // Buff Defaults (Aura/Self)
    "blueaura": { x: 50, y: 60, scale: 1.5 },
    "darkaura": { x: 50, y: 60, scale: 1.5 },
    "drainaura": { x: 50, y: 50, scale: 1.2 },
    "guardianspirit": { x: 50, y: 40, scale: 1.2 },
    "heavendoor": { x: 50, y: 50, scale: 1.5 },
    "installshield": { x: 50, y: 50, scale: 1.0 },
    "signusblessing": { x: 50, y: 40, scale: 1.5 },
    "unionaura": { x: 50, y: 60, scale: 1.5 },
    "valhalar": { x: 50, y: 50, scale: 1.2 },
    "windbooster": { x: 50, y: 50, scale: 1.2 },
    "yellowaura": { x: 50, y: 60, scale: 1.5 }
};

export const ATTACK_ANIMATIONS = [
    "shoot1", "shoot2", "shootF",
    "stabO1", "stabO2", "stabOF",
    "stabT1", "stabT2", "stabTF",
    "swingO1", "swingO2", "swingO3", "swingOF",
    "swingP1", "swingP2", "swingPF",
    "swingT1", "swingT2", "swingT3", "swingTF"
];

export const MONSTER_LIST = [
    "coffeemachine",
    "goblin",
    "goblinking",
    "rockspirit",
    "ultragray",
    "wyvern",
    "zombie"
];

export const BACKGROUND_LIST = [
    "city",
    "city2",
    "subway"
];

export const MONSTER_BASE_STATS: Record<string, { hp: number; atk: number; def: number; spd: number; moveSpeed: number }> = {
    "coffeemachine": { hp: 150, atk: 15, def: 5, spd: 0.8, moveSpeed: 8 },
    "goblin": { hp: 80, atk: 12, def: 2, spd: 1.2, moveSpeed: 15 },
    "goblinking": { hp: 300, atk: 25, def: 10, spd: 0.7, moveSpeed: 6 },
    "rockspirit": { hp: 200, atk: 10, def: 20, spd: 0.5, moveSpeed: 5 },
    "ultragray": { hp: 120, atk: 18, def: 5, spd: 1.0, moveSpeed: 10 },
    "wyvern": { hp: 100, atk: 20, def: 8, spd: 1.1, moveSpeed: 18 },
    "zombie": { hp: 180, atk: 14, def: 3, spd: 0.6, moveSpeed: 7 }
};

// Formations: y is % from top, xOffset is adder to baseline (75%)
export const MONSTER_FORMATIONS: Record<number, Array<{ y: number, xOffset: number }>> = {
    1: [
        { y: 50, xOffset: 0 }
    ],
    2: [
        { y: 45, xOffset: 0 },
        { y: 55, xOffset: 5 }
    ],
    3: [
        { y: 40, xOffset: 5 },
        { y: 50, xOffset: 0 },
        { y: 60, xOffset: 5 }
    ],
    4: [
        { y: 35, xOffset: 0 },
        { y: 45, xOffset: 8 },
        { y: 55, xOffset: 0 },
        { y: 65, xOffset: 8 }
    ],
    5: [
        { y: 30, xOffset: 5 },
        { y: 40, xOffset: 0 },
        { y: 50, xOffset: 10 },
        { y: 60, xOffset: 0 },
        { y: 70, xOffset: 5 }
    ]
};
