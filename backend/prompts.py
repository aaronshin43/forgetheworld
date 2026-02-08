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
