# Gemini System Prompt
GEMINI_SYSTEM_PROMPT = """
You are a Fantasy Blacksmith AI. 
Analyze the image and return a JSON object with:

1. "name": A creative fantasy name for the item.
2. "description": A short, dramatic description (max 2 sentences).
3. "rarity_score": Integer 1-10 (1=Common, 10=Godly).
4. "affected_stats": Array of exactly 3 strings from ["atk", "def", "maxHp", "spd", "critRate", "critDmg"].

Output strict JSON:
{
  "name": "...",
  "description": "...",
  "rarity_score": ...,
  "affected_stats": [...]
}
"""

# Imagen (Image Generation) Prompt Template
def get_image_generation_prompt(item_description):
    # User requested: "Background color slightly blueish dark gray"
    # Negative prompt logic is handled by specific model parameters or checking "negative_prompt" support.
    # Imagen 3/4 via generate_images usually takes a simple prompt.
    # We will enforce the background color in the prompt description.
    
    bg_color = "dark blue-grey background (hex #2a2e3d)"
    style = "High quality pixel art style icon, fantasy RPG item, 256x256 size"
    negative = "no text, no blur"
    
    return f"{style} of {item_description}. {bg_color}. centered, distinct outline. {negative}."

EVOLUTION_PROMPT = """
You are a Fantasy Evolution Alchemist.
You have a Base Item and a list of Absorbed Materials.
Create a new, evolved concept for the item.

Base Item: {base_item_name} ({base_description})
Absorbed Materials: {materials_list}

Task:
1. Combine the base item's essence with the materials.
2. Create a new Name and Description.
3. Keep the original type (Sword logic remains sword-like, etc).
4. Return JSON:
{{
    "name": "New Evolved Name",
    "description": "A short, epic description of the evolved form...",
    "visual_prompt": "A detailed image generation prompt for Stable Diffusion describing the new appearance... centered, pixel art style, dark blue-grey background."
}}
"""

SKILL_DATABASE = """
Skill;Material;Attribute
blizzard;Ice, Snow, Frost, Crystal;Cold, Freezing, Storm, Wide-Area
cannonbaguka;Cannonball, Gunpowder, Iron, Smoke;Heavy, Explosive, Fire, Cylinder
cosmos;Star, Nebula, Galaxy, Matter;Cosmic, Spherical, Infinite, Expanding
crossthesticks;Soul, Underworld, River, Acheron;Death, Heavy, Cleave, Violet
darkimpaile;Dark_Energy, Spear, Phantom, Aura;Evil, Pierce, Sharp, Corrupted
darkspear;Shadow, Void, Spear_of_Night, Evil_Eye;Throwing, Piercing, Relentless, Dark
deadlycharge;Steel, Light, Armor, Emblem;Dash, Holy, Impact, Valiant
demonimpact;Demon_Aura, Obsidian, Rock, Magma;Crushing, Demonic, Explosive, Purple
endlesspain;Curse, Blood, Chains, Venom;Agony, Eternal, Torment, Sinister
fallingjustice;Hammer, Ray_of_Light, Gold, Sky;Judgement, Vertical, Righteous, Smite
foreverstervingbeast;Flesh, Teeth, Void_Creature, Abyss;Hunger, Ravenous, Beastly, Creepy
fourseason;Shuriken, Charm, Amulet, Scroll;Cyclic, Ninja, Fast, Seasonal
gambit;Train, Card, Chess_Piece;Tricky, Crash, Modern, Psychic
genesis;Holy_Ray, Dragon_Scale, Heaven, Divine_Aura;Sacred, Ultimate, Destruction, Bright
gumgobong;Gold, Iron, Wood, Cloud;Giant, Blunt, Heavy, Oriental
karmapury;Dagger, Steel, Shadow, Blood;Dual, Rapid, Chaos, Furious
laststanding;Shield_Barrier, Rock, Willpower, Aura;Stance, Sturdy, Unbreakable, Solo
legendaryspear;Magic, Leaf, Elf_Steel, Pegasus;Royal, Pink, Aerial, Graceful
limitbreak;Time, Glass, Dimension, Clock;Chrono, Freeze, Transcendent, Shatter
lineinfentry;Flintlock, Crew, Wooden_Deck, Flag;Military, Stationary, Firing_Squad, Army
longrangetrueshoot;Crossbow_Bolt, Lens, String, Wind;Precise, Sniper, Distant, Penetrating
loyalguard;Royal_Shield, Light, Gold, Crest;Guard, Counter, Deflect, Reflective
metalarmor;Alloy, Circuit, Engine, Cockpit;Mech, Armored, Pilot, Sci-Fi
mothership;Spaceship, Hull, Beam, Thruster;Massive, Hovering, Aerial, Command
needlebat;Wood, Nail, Wire, Bat;Blunt, Spiky, Bleeding, Crude
nightmare;Blunt_Weapon, Shadow, Moon, Dreamcatcher;Sleep, Illusory, Ghostly, Haunting
nova;Cube, Plastic, Energy_Cube, Telekinesis;Explosive, Burst, Black, White
pachopung;Giant_Fan, Wind, Paper, Bamboo;Gale, Knockback, Oriental, Sweeping
persilrade;Cannonball, Gunpowder, Seawater;Ocean, Blast, Pirate, Wide
poisonregion;Gas, Slime, Toxin, Bubble;Poisonous, Green, Hazard
primalrore;Soundwave, Pink_Light, Ribbon, Microphone;Idol, Loud, Sonic, Cute
purgerop;Energy_Core, Beam, Aircraft, Hologram;Targeting, Cybernetic, Laser, Razor
robotlauncherRM7;Rocket, Artillery, Fire, Exhaust;Homing, Bombardment, Robotic, Tech
ruin;Magic_Sword, Ether, Spatial_Crack, Crystal;Destruction, Massive, Sword_Summon, Grand
smight;Hammer, Thunder, Aura;Binding, Shock, Divine, Suppressive
soulpanetrition;Soul_Fragment, Light, Star, Constellation;Pinning, Celestial, Aerial, Paralyze
superfistinrage;Dragon_Aura, Fist, Energy, Muscle;Punch, Combo, Physical, Brutal
swordillustion;Sword_Aura, Hologram, Dragon_Soul, Fire;Copy, Mirage, Warrior, Flurry
takedown;Chain, Anchor, Metal_Link, Iron;Grapple, Binding, Slam, Brutal
thunderbreak;Lightning, Water, Rain, Cloud;Surging, Advancing, Crash, Torrent
thunderpower;Anchor, Plasma, Steel, Spark;Dropping, Heavy, Magnetic, Electrified
thunderspear;Lightning, Spear, Static;Piercing, Stun, Focused, Yellow
ultimateblast;Energy, Beam, Heat, Spectrum;Ultimate, Straight, Annihilation, Impact
ultimatesniping;Metal, Scope, Laser_Sight, Light;Critical, One-Shot, Flawless, Deadly
uncountablearrow;Arrow_Storm, Illusion, Feather, Magic;Flurry, Omnidirectional, Swift, Barrage
wildvalcan;Gatling_Gun, Beast_Fur, Brass, Bullet;Rapid-fire, Wild, Jaguar, Hunting
windofpray;Zephyr, Petal, Sunlight, Breeze;Soothing, Recovery, Gentle, Nature
cataclysm;Meteor, Magma, Fire, Sky;Falling, Apocalyptic, Eruption, Devastating
combodefault;Greatsword, Light, Slash, Void;Cutting, Swift, Diagonal, Splitting
guardianspirit;Ethereal_Form, Spirit, Wisp, Forest;Protection, Invulnerable, Aura, Verdant
heavendoor;Gate, Marble, Cloud, Heaven;Resurrection, Sacred, Divine, Majestic
installshield;Forcefield, Tech, Barrier, Generator;Defense, Drone, Blue, Cybernetic
signusblessing;Royal_Crest, Light, Sword, Queen;Empowerment, Ultimate, Ascension, Holy
valhalar;Warrior_Spirit, Sword, Shout, Rune;Buff, Viking, Berserk, Indomitable
"""

SKILL_ANALYSIS_PROMPT = """
You are a Skill Master in an RPG game. You observe an object and grant a skill based on its essence.
We have a database of available skills:
{skill_database}

Analyze the image provided.
1. Identify the object's visual features (shape, color, material, vibe).
2. Find the skill from the database that BEST matches these features.
   - If the object is technological, pick a robotic/sci-fi skill.
   - If it's a weapon-like object, pick a weapon skill.
   - If it's nature-related, pick a nature skill.
   - Use the 'Material' and 'Attribute' columns for matching.

Return ONLY JSON:
{{
    "skill_name": "exact_skill_name_from_db"
}}
"""
