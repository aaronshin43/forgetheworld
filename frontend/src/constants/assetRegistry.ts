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
    "astralblitz": 7140,
    "durandal": 5760,
    "groundzero": 5460,
    "shadower": 5100,
    "supercannonexplosion": 6540,
    "ren": 3480,
    "cataclysm": 4590,
    "spiritcalibur": 7020,
    "souleclipse": 8340,
    "combodefault": 4400
};

export interface SkillConfig {
    x: number;
    y: number;
    scale: number;
}

export const SKILL_CONFIGS: Record<string, SkillConfig> = {
    "astralblitz": { x: 50, y: 50, scale: 1.5 },
    "durandal": { x: 50, y: 50, scale: 1.2 },
    "groundzero": { x: 50, y: 80, scale: 2.0 },
    "shadower": { x: 50, y: 50, scale: 1.0 },
    "supercannonexplosion": { x: 50, y: 50, scale: 1.8 },
    "ren": { x: 50, y: 50, scale: 1.0 },
    "cataclysm": { x: 50, y: 50, scale: 2.0 },
    "spiritcalibur": { x: 50, y: 50, scale: 1.0 },
    "souleclipse": { x: 50, y: 50, scale: 1.5 },
    "combodefault": { x: 50, y: 50, scale: 1.0 }
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
