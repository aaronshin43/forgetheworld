import os
import json
import io
import base64
from PIL import Image
from google import genai
from google.genai import types
from dotenv import load_dotenv
from prompts import (
    GEMINI_SYSTEM_PROMPT,
    get_image_generation_prompt,
    EVOLUTION_PROMPT,
    SKILL_ANALYSIS_PROMPT,
    SKILL_DATABASE
)

load_dotenv()

# Configure Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def analyze_image_with_gemini(image_bytes: bytes, mode: str):
    """
    Analyzes the image and generates flavor text in a single pass using Gemini 2.5 Flash Lite.
    Returns flat JSON: { name, description, rarity_score, affected_stats }
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite", 
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                        types.Part.from_text(text=f"User selected action: {mode}. Analyze accordingly."),
                    ],
                ),
            ],
            config=types.GenerateContentConfig(
                system_instruction=GEMINI_SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.7,
            ),
        )
        print(f"Gemini Scan Response: {response.text}")
        result = json.loads(response.text)
        
        # Ensure we have the required fields; fallback if missing
        if "name" not in result:
             # Fallback if structure is wrong (e.g. model failed to follow strict JSON)
             return {
                 "name": result.get("item", "Unknown Item"),
                 "description": "A mysterious object from the void.",
                 "rarity_score": result.get("rarity_score", 1),
                 "affected_stats": result.get("affected_stats", ["atk", "def", "maxHp"])
             }
        
        # Compatibility: Frontend `gameStore` uses `data.rarity`.
        # The prompt returns `rarity_score`. We map it to `rarity` to be safe.
        if "rarity" not in result and "rarity_score" in result:
            result["rarity"] = result["rarity_score"]

        return result

    except Exception as e:
        print(f"Gemini Scan Error: {e}")
        return {
            "name": "Glithced Object",
            "description": "The scanner failed to identify this object.",
            "rarity_score": 1,
            "rarity": 1,
            "affected_stats": ["atk", "def", "maxHp"]
        }

async def generate_item_image(prompt: str):
    try:
        # 1. Generate Image with Gemini (Flash Image)
        print(f"Generating image for: {prompt}")
        
        full_prompt = get_image_generation_prompt(prompt)

        response = client.models.generate_content(
            model='gemini-2.5-flash-image', 
            contents=full_prompt,
            config=types.GenerateContentConfig(
                response_modalities=['Image'],
                temperature=0.8,
                image_config=types.ImageConfig(
                    aspect_ratio="1:1",
                ),
            )
        )

        for part in response.parts:
            if part.inline_data is not None:
                image_bytes = part.inline_data.data
        
                return process_image_bytes(image_bytes)

        return None

    except Exception as e:
        print(f"Gemini Image Gen Error: {e}")
        return None

def process_image_bytes(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    
    # Resize/Pad to 256x256
    target_size = (256, 256)
    image.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    # Create transparent background for padding
    new_image = Image.new("RGBA", target_size, (0, 0, 0, 0))
    # Center the image
    upper = (target_size[1] - image.size[1]) // 2
    left = (target_size[0] - image.size[0]) // 2
    new_image.paste(image, (left, upper))
    
    # Convert to WebP Base64
    buffered = io.BytesIO()
    new_image.save(buffered, format="WEBP", quality=90)
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return f"data:image/webp;base64,{img_str}"

async def generate_evolution_concept(base_item: dict, materials: list):
    try:        
        # Format materials list string
        materials_str = ", ".join([f"{m['name']} ({m['grade']})" for m in materials])
        
        prompt = EVOLUTION_PROMPT.format(
            base_item_name=base_item.get('name', 'Unknown Item'), 
            base_description=base_item.get('description', ''),
            materials_list=materials_str
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite", 
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.8,
            ),
        )
        print(f"Evolution Concept: {response.text}")
        return json.loads(response.text)
    except Exception as e:
        print(f"Evolution Error: {e}")
        # Fallback
        return {
            "name": f"Evolved {base_item.get('name', 'Item')}",
            "description": "The item has evolved, absorbing new power.",
            "visual_prompt": f"A powerful version of {base_item.get('name', 'Item')}, glowing with energy. Pixel art style."
        }

async def analyze_skill_image(image_data: bytes):
    try:
        # Load image
        image_part = types.Part.from_bytes(data=image_data, mime_type="image/jpeg")
        
        # Format Prompt
        prompt = SKILL_ANALYSIS_PROMPT.format(skill_database=SKILL_DATABASE)

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite", 
            contents=[prompt, image_part],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.8,
            ),
        )
        print(f"Skill Analysis: {response.text}")
        return json.loads(response.text)
    except Exception as e:
        print(f"Skill Analysis Error: {e}")
        # Failover
        return {
            "skill_name": "blast", 
            "type": "deal", 
            "reasoning": "Analysis failed, defaulting to basic blast."
        }
