import os
import json
from google import genai
from google.genai import types
import requests
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Featherless / Vultr Inference
FEATHERLESS_API_URL = os.getenv("FEATHERLESS_API_URL", "https://api.featherless.ai/v1/chat/completions")
FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY")

# FEATHERLESS_MODEL = "google/gemma-3-12b-it"
FEATHERLESS_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"
# FEATHERLESS_MODEL = "mistralai/Mistral-Nemo-Instruct-2407"


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
5. "stats": { "atk": number, "def": number, "hp": number } (Scale: 10-100)

Output strict JSON.
"""

async def analyze_image_with_gemini(image_bytes: bytes, mode: str):
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
        
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {
            "item": "Unknown Artifact",
            "material": "Unknown",
            "attribute": "Void",
            "type": "weapon" if mode == 'craft' else "skill",
            "stats": {"atk": 10, "def": 0, "hp": 0}
        }

async def generate_flavor_text_with_featherless(item_data: dict):
    if not FEATHERLESS_API_KEY:
        return {
            "name": f"Ancient {item_data['item']}",
            "description": f"A mysterious {item_data['item']} found in the void. It resonates with {item_data['attribute']} energy."
        }

    prompt = f"""
    Item: {item_data['item']}
    Attribute: {item_data['attribute']}
    Type: {item_data['type']}
    
    Create a cool fantasy name and a dramatic description for this item.
    JSON Output: {{"name": "...", "description": "..."}}
    """
    
    try:
        headers = {
            "Authorization": f"Bearer {FEATHERLESS_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": FEATHERLESS_MODEL,
            "messages": [
                {"role": "system", "content": "You are a dramatic fantasy bard. Return JSON only."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        
        response = requests.post(FEATHERLESS_API_URL, headers=headers, json=data)
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Featherless Error: {e}")
        return {
             "name": f"Legendary {item_data['item']}",
             "description": "The description was lost in translation."
        }
