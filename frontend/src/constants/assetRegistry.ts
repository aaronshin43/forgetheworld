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
    "spiritcalibur": 7020,
    "souleclipse": 8340,

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
    "yellowaura": 1920,

    // Deal
    "blizzard": 1860,
    "cannonbaguka": 1240,
    "cosmos": 3420,
    "crossthesticks": 840,
    "darkimpaile": 1080,
    "darkspear": 1530,
    "deadlycharge": 1200,
    "demonimpact": 960,
    "endlesspain": 4710,
    "fallingjustice": 2820,
    "foreverstervingbeast": 4230,
    "fourseason": 2580,
    "gambit": 3660,
    "genesis": 2430,
    "gumgobong": 1530,
    "karmapury": 1650,
    "laststanding": 2295,
    "legendaryspear": 1440,
    "limitbreak": 1740,
    "lineinfentry": 5310,
    "longrangetrueshoot": 1080,
    "loyalguard": 1170,
    "metalarmor": 4140,
    "mothership": 3600,
    "needlebat": 2000,
    "nightmare": 3180,
    "nova": 2000,
    "pachopung": 1170,
    "persilrade": 1440,
    "poisonregion": 3660,
    "primalrore": 780,
    "purgerop": 1200,
    "robotlauncherRM7": 4380,
    "ruin": 6090,
    "smight": 1380,
    "soulpanetrition": 2340,
    "superfistinrage": 810,
    "swordillustion": 3750,
    "takedown": 2100,
    "thunderbreak": 2400,
    "thunderpower": 1260,
    "thunderspear": 2970,
    "ultimateblast": 3420,
    "ultimatesniping": 1320,
    "uncountablearrow": 900,
    "wildvalcan": 2700,
    "windofpray": 1680,
    "cataclysm": 4590,
    "combodefault": 2600
};

export const SKILL_CATEGORIES = {
    basic: ["blast", "blast2", "divinecharge", "divinecharge2", "divineswing"],
    buff: ["blueaura", "darkaura", "drainaura", "guardianspirit", "heavendoor", "installshield", "signusblessing", "unionaura", "valhalar", "windbooster", "yellowaura"],
    deal: ["blizzard", "cannonbaguka", "cosmos", "crossthesticks", "darkimpaile", "darkspear", "deadlycharge", "demonimpact", "endlesspain", "fallingjustice", "foreverstervingbeast", "fourseason", "gambit", "genesis", "gumgobong", "karmapury", "laststanding", "legendaryspear", "limitbreak", "lineinfentry", "longrangetrueshoot", "loyalguard", "metalarmor", "mothership", "needlebat", "nightmare", "nova", "pachopung", "persilrade", "poisonregion", "primalrore", "purgerop", "robotlauncherRM7", "ruin", "smight", "soulpanetrition", "superfistinrage", "swordillustion", "takedown", "thunderbreak", "thunderpower", "thunderspear", "ultimateblast", "ultimatesniping", "uncountablearrow", "wildvalcan", "windofpray", "cataclysm", "combodefault"],
    ultimate: ["astralblitz", "durandal", "groundzero", "shadower", "supercannonexplosion", "ren", "spiritcalibur", "souleclipse"]
};

export interface SkillConfig {
    x: number;
    y: number;
    scale: number;
}

export const SKILL_CONFIGS: Record<string, SkillConfig> = {
    // Ultimate Defaults
    "astralblitz": { x: 50, y: 55, scale: 1.5 },
    "durandal": { x: 50, y: 55, scale: 1.5 },
    "groundzero": { x: 50, y: 55, scale: 1.4 },
    "shadower": { x: 50, y: 55, scale: 1.2 },
    "supercannonexplosion": { x: 50, y: 52, scale: 1.0 },
    "ren": { x: 50, y: 55, scale: 1.0 },
    "spiritcalibur": { x: 50, y: 53, scale: 0.9 },
    "souleclipse": { x: 55, y: 50, scale: 1.0 },

    // Basic Defaults (Standard Hit)
    "blast": { x: 38, y: 68, scale: 1.0 },
    "blast2": { x: 43, y: 72, scale: 1.0 },
    "divinecharge": { x: 40, y: 70, scale: 1.0 },
    "divinecharge2": { x: 45, y: 70, scale: 1.0 },
    "divineswing": { x: 40, y: 75, scale: 1.0 },

    // Buff Defaults (Aura/Self)
    "blueaura": { x: 17, y: 80, scale: 0.5 },
    "darkaura": { x: 17, y: 80, scale: 0.5 },
    "drainaura": { x: 17, y: 80, scale: 0.5 },
    "guardianspirit": { x: 18, y: 55, scale: 0.5 },
    "heavendoor": { x: 55, y: 50, scale: 1.0 },
    "installshield": { x: 18, y: 55, scale: 1.0 },
    "signusblessing": { x: 17, y: 70, scale: 0.5 },
    "unionaura": { x: 17, y: 80, scale: 0.5 },
    "valhalar": { x: 50, y: 50, scale: 1.0 },
    "windbooster": { x: 17, y: 80, scale: 0.5 },
    "yellowaura": { x: 17, y: 70, scale: 0.5 },

    // Deal Defaults
    "blizzard": { x: 50, y: 50, scale: 1.0 },
    "cannonbaguka": { x: 50, y: 50, scale: 1.0 },
    "cosmos": { x: 50, y: 50, scale: 1.0 },
    "crossthesticks": { x: 50, y: 50, scale: 1.0 },
    "darkimpaile": { x: 50, y: 50, scale: 1.0 },
    "darkspear": { x: 50, y: 50, scale: 1.0 },
    "deadlycharge": { x: 50, y: 50, scale: 1.0 },
    "demonimpact": { x: 50, y: 50, scale: 1.0 },
    "endlesspain": { x: 50, y: 50, scale: 1.0 },
    "fallingjustice": { x: 50, y: 50, scale: 1.0 },
    "foreverstervingbeast": { x: 50, y: 50, scale: 1.0 },
    "fourseason": { x: 50, y: 50, scale: 1.0 },
    "gambit": { x: 50, y: 50, scale: 1.0 },
    "genesis": { x: 50, y: 50, scale: 1.0 },
    "gumgobong": { x: 50, y: 50, scale: 1.0 },
    "karmapury": { x: 50, y: 50, scale: 1.0 },
    "laststanding": { x: 50, y: 50, scale: 1.0 },
    "legendaryspear": { x: 50, y: 50, scale: 1.0 },
    "limitbreak": { x: 50, y: 50, scale: 1.0 },
    "lineinfentry": { x: 50, y: 50, scale: 1.0 },
    "longrangetrueshoot": { x: 50, y: 50, scale: 1.0 },
    "loyalguard": { x: 50, y: 50, scale: 1.0 },
    "metalarmor": { x: 50, y: 50, scale: 1.0 },
    "mothership": { x: 50, y: 50, scale: 1.0 },
    "needlebat": { x: 50, y: 50, scale: 1.0 },
    "nightmare": { x: 50, y: 50, scale: 1.0 },
    "nova": { x: 50, y: 50, scale: 1.0 },
    "pachopung": { x: 50, y: 50, scale: 1.0 },
    "persilrade": { x: 50, y: 50, scale: 1.0 },
    "poisonregion": { x: 50, y: 50, scale: 1.0 },
    "primalrore": { x: 50, y: 50, scale: 1.0 },
    "purgerop": { x: 50, y: 50, scale: 1.0 },
    "robotlauncherRM7": { x: 50, y: 50, scale: 1.0 },
    "ruin": { x: 50, y: 50, scale: 1.0 },
    "smight": { x: 50, y: 50, scale: 1.0 },
    "soulpanetrition": { x: 50, y: 50, scale: 1.0 },
    "superfistinrage": { x: 50, y: 50, scale: 1.0 },
    "swordillustion": { x: 50, y: 50, scale: 1.0 },
    "takedown": { x: 50, y: 50, scale: 1.0 },
    "thunderbreak": { x: 50, y: 50, scale: 1.0 },
    "thunderpower": { x: 50, y: 50, scale: 1.0 },
    "thunderspear": { x: 50, y: 50, scale: 1.0 },
    "ultimateblast": { x: 50, y: 50, scale: 1.0 },
    "ultimatesniping": { x: 50, y: 50, scale: 1.0 },
    "uncountablearrow": { x: 50, y: 50, scale: 1.0 },
    "wildvalcan": { x: 50, y: 50, scale: 1.0 },
    "windofpray": { x: 50, y: 50, scale: 1.0 },
    "combodefault": { x: 50, y: 55, scale: 1.4 },
    "cataclysm": { x: 50, y: 66, scale: 1.7 }
};

export const ATTACK_ANIMATIONS = [
    "shoot1", "shoot2", "shootF",
    "stabO1", "stabO2", "stabOF",
    "stabT1", "stabT2", "stabTF",
    "swingO1", "swingO2", "swingO3",
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

export const MONSTER_BASE_STATS: Record<string, { hp: number; atk: number; def: number; spd: number; moveSpeed: number; scale: number }> = {
    "coffeemachine": { hp: 150, atk: 15, def: 5, spd: 2, moveSpeed: 12, scale: 0.8 },
    "goblin": { hp: 80, atk: 12, def: 2, spd: 1, moveSpeed: 15, scale: 1.0 },
    "goblinking": { hp: 300, atk: 25, def: 10, spd: 2, moveSpeed: 11, scale: 1.0 },
    "rockspirit": { hp: 200, atk: 10, def: 20, spd: 2, moveSpeed: 18, scale: 1.0 },
    "ultragray": { hp: 120, atk: 18, def: 5, spd: 1, moveSpeed: 16, scale: 1.0 },
    "wyvern": { hp: 100, atk: 20, def: 8, spd: 2, moveSpeed: 17, scale: 0.8 },
    "zombie": { hp: 180, atk: 14, def: 3, spd: 2, moveSpeed: 13, scale: 1.0 }
};

export const MONSTER_DURATIONS: Record<string, Record<string, number>> = {
    "coffeemachine": {
        "attack1": 1800,
        "die1": 1440,
        "hit1": 600,
        "move": 1080,
        "stand": 1080
    },
    "goblin": {
        "attack1": 1580,
        "die1": 820,
        "hit1": 600,
        "move": 600,
        "stand": 780
    },
    "goblinking": {
        "attack1": 2370,
        "die1": 1740,
        "hit1": 300,
        "move": 1020,
        "stand": 1200
    },
    "rockspirit": {
        "attack1": 2160,
        "attack2": 2190,
        "attack3": 3780,
        "die1": 1800,
        "hit1": 600,
        "move": 480,
        "stand": 1200
    },
    "ultragray": {
        "attack1": 1650,
        "die1": 1140,
        "hit1": 600,
        "move": 480,
        "stand": 2350
    },
    "wyvern": {
        "attack1": 2160,
        "attack2": 2160,
        "die1": 1020,
        "move": 720,
        "stand": 720
    },
    "zombie": {
        "attack1": 1500,
        "attack2": 1620,
        "die1": 1300,
        "hit1": 600,
        "move": 800,
        "stand": 600
    }
};

// Animation Offsets (in pixels, relative to center anchor, positive is right/down, negative is left/up)
export const MONSTER_ANIMATION_OFFSETS: Record<string, Record<string, { x: number; y: number }>> = {
    "goblinking": {
        "die1": { x: 35, y: 0 }
    },
    "rockspirit": {
        "attack1": { x: -265, y: 10 },
        "attack2": { x: -100, y: 0 },
        "attack3": { x: -100, y: 0 }
    },
    "coffeemachine": {
        "attack1": { x: -50, y: 15 },
        "die1": { x: -10, y: 0 }
    },
    "ultragray": {
        "attack1": { x: 15, y: 0 }
    },
    "goblin": {
        "attack1": { x: -15, y: 0 }
    },
    "wyvern": {
        "attack1": { x: -25, y: 15 }
    },
    "zombie": {
        "attack1": { x: -15, y: 0 }
    }
};

// Formations: y is % from top, xOffset is adder to baseline (75%)
export const MONSTER_FORMATIONS: Record<number, Array<{ y: number, xOffset: number }>> = {
    1: [
        { y: 95, xOffset: 0 }
    ],
    2: [
        { y: 88, xOffset: 0 },
        { y: 95, xOffset: 15 }
    ],
    3: [
        { y: 89, xOffset: 13 },
        { y: 93, xOffset: 0 },
        { y: 97, xOffset: 15 }
    ],
    4: [
        { y: 85, xOffset: 3 },
        { y: 89, xOffset: 13 },
        { y: 93, xOffset: 0 },
        { y: 97, xOffset: 15 }
    ],
    5: [
        { y: 88, xOffset: 3 },
        { y: 82, xOffset: 16 },
        { y: 90, xOffset: 20 },
        { y: 94, xOffset: 0 },
        { y: 98, xOffset: 15 }
    ]
};
