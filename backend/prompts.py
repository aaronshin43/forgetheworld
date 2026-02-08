# Gemini System Prompt
GEMINI_SYSTEM_PROMPT = """
You are a Fantasy Blacksmith AI. 
Analyze the image and return a JSON object with:
1. "item": Name of the object (e.g., "Red Scissors").
2. "material": Physical material (e.g., "Metal", "Plastic").
3. "attribute": Element or vibe (e.g., "Fire", "Sharp", "Ice", "Modern").
4. "type": One of ["weapon", "armor", "skill"].
   - Sharp/Long -> weapon
   - Wide/Protective -> armor
   - Consumable/Energy -> skill
5. "rarity_score": Integer 1-10 based on item's apparent value, price, uniqueness, or coolness. (1=Common/Cheap, 10=Godly/Priceless).
6. "affected_stats": Array of exactly 3 strings from ["atk", "def", "maxHp", "spd", "critRate", "critDmg"] that best suit the item.

Output strict JSON.
"""

# Featherless (Flavor Text) Prompt Template
def get_flavor_text_prompt(item_data):
    return f"""
    Item: {item_data['item']}
    Attribute: {item_data['attribute']}
    Type: {item_data['type']}
    
    Create a cool fantasy name and a dramatic description for this item.
    Keep the description short and punchy (max 2 sentences, under 100 characters).
    JSON Output: {{"name": "...", "description": "..."}}
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
blizzard;Ice, Snow, Magic, Crystal;Cold, Freezing, Storm
cannonbaguka;Metal, Gunpowder, Iron, Smoke;Heavy, Explosive, Fire, Cylinder
cosmos;Star, Light, Galaxy, Energy;Space, Mysterious, Violet, Infinite
crossthesticks;Soul, Dark_Energy, Star, Galaxy;Space, Cosmic, Violet
darkimpaile;Dark_Matter, Spear, Metal, Phantom;Evil, Pierce, Sharp, Violet
darkspear;Shadow, Spear, Void, Energy;Throwing, Pierce, Dark, Sharp
deadlycharge;Metal, Light, Armo;Dash, Holy, Impact, Valiant
demonimpact;Demon, Obsidian, Rock, Magma;Crushing, Dark, Explosive, Purple
endlesspain;Curse, Blood, Chains, Venom;Agony, Eternal, Dark, Torment
fallingjustice;Light, Hammer, Gold, Energy;Holy, Judgement, Vertical, Righteous
foreverstervingbeast;Flesh, Teeth, Void, Abyss;Hunger, Ravenous, Beastly, Red
fourseason;Shuriken, Wind, Metal;Cyclic, Ninja, Fast
gambit;Train, Magic, Cube;Tricky, Gambling, Modern
genesis;Light, Holy_Ray, Dragon_Scale, Heaven;Divine, Ultimate, Destruction, Bright
gumgobong;Gold, Iron, Wood, Magic;Giant, Blunt, Heavy, Oriental
karmapury;Blade, Steel, Shadow, Blood;Dual, Rapid, Chaos, Sharp
laststanding;Iron, Shield, Rock, Willpower;Swing, Sturdy, Unbreakable, Solo
legendaryspear;Magic, Leaf, Elf_Steel, Wind;Royal, Pink, Aerial, Piercing
limitbreak;Time, Glass, Dimension, Clock;Chrono, Freeze, Burst, Transcendent
lineinfentry;Metal, Robot, Plastic, Oil;Military, Stationary, Shooting, Army
longrangetrueshoot;Arrow, Lens, Steel, Wind;Precise, Sniper, Distant, Focusing
loyalguard;Light, Shield, Gold, Aura;Guard, Counter, Holy, Reflective
metalarmor;Steel, Alloy, Circuit, Engine;Robotic, Heavy, Pilot, Sci-Fi
mothership;Spaceship, Metal, Beam, Fuel;Massive, Sci-Fi, Aerial, Command
needlebat;Wood, Nail, Iron, Leather;Blunt, Spiky, Painful, Crude
nightmare;Mist, Shadow, Moon, Dream;Sleep, Purple, Illusory, Ghostly
nova;Cube, Plastic, Telekinesis;Explosive, White, Black, Burst
pachopung;Fan, Wind, Paper, Leaf;Gale, Green, Knockback, Oriental
persilrade;Bullet, Gunpowder, Tentacle, Water;Ocean, Rapid, Shooting, Pirate
poisonregion;Gas, Slime, Poison, Bubble;Toxic, Green, Hazard, Area
primalrore;Soundwave, Pink_Light, Heart, Soul;Dragon, Cute, Loud, Sonic
purgerop;Steel, Beam, Aircraft;Robotic, Blue, Razor, Sci-Fi
robotlauncherRM7;Metal, Missile, Fire, Smoke;Homing, Explosive, Robotic, Tech
ruin;Magic_Sword, Ether, Light, Crystal;Destruction, Massive, Vertical, Royal
smight;Hammer, Thunder, Light, Gold;Binding, Crushing, Holy, Shock
soulpanetrition;Soul, Light, Sword, Star;Piercing, Aerial, Binding, Celestial
superfistinrage;Dragon, Fist, Energy, Muscle;Punch, Fast, Blue, Physical
swordillustion;Sword, Hologram, Dragon_Soul, Fire;Copy, Fast, Warrior
takedown;Wood, Nail, Iron, Chain;Blunt, Spiky, Painful, Crude
thunderbreak;Lightning, Water, Electricity, Shark;Chain, Blue, Shocking, Storm
thunderpower;Spark, Plasma, Anchor, Light;Electric, Blue,  Lightening, Bright
thunderspear;Lightning, Spear, Plasma, Magic;Electric, Piercing, Stun, Blue
ultimateblast;Energy, Beam, Heat, Violet;Ultimate, Straight, Heavy, Impact
ultimatesniping;Metal, Scope, Arrow, Light;Critical, One-Shot, Precise, Deadly
uncountablearrow;Arrow, Feather, Wind, Light;Rapid, Flurry, Red, Sharp
wildvalcan;Gatling_Gun, Beast_Fur, Metal, Bullet;Rapid, Wild, Jaguar, Hunting
windofpray;Wind, Feather, Leaf, Light;Green, Healing, Soft, Nature
cataclysm;Meteor, Rock, Fire, Sky;Falling, Massive, Destruction, Apocalyptic
combodefault;Blade, Light, Slash, Energy;Cutting, Swift, Diagonal, Splitting
guardianspirit;Nature, Spirit, Light, Shield;Healing, Protection, Green, Soft
heavendoor;Gate, Light, Holy, Dimension;Resurrection, AOE, Divine, Gold
installshield;Metal, Shield, Tech, Barrier;Defense, Invincible, Blue, Robotic
signusblessing;Royal, Light, Sword, Queen;Stat Buff, Ultimate, Ascension, Holy
valhalar;Warrior, Sword, Shout, Spirit;Attack Buff, Viking, Red, Berserk
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
3. Determine if this skill is primarily 'buff' or 'deal' (damage).
   - Most in the list are 'deal', but check reasoning (e.g., healing/shielding = buff).

Return ONLY JSON:
{{
    "skill_name": "exact_skill_name_from_db",
    "type": "deal", // or "buff"
}}
"""
