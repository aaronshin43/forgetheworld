import os
import json
import google.generativeai as genai
import requests
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Featherless / Vultr Inference (Placeholder URL, user needs to provide)
FEATHERLESS_API_URL = os.getenv("FEATHERLESS_API_URL", "https://api.featherless.ai/v1/chat/completions")
FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY")

# FEATHERLESS_MODEL = "google/gemma-3-12b-it"
FEATHERLESS_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"
# FEATHERLESS_MODEL = "mistralai/Mistral-Nemo-Instruct-2407"

generation_config = {
  "temperature": 0.7,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 1024,
  "response_mime_type": "application/json",
}

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
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-lite-preview-02-05", # Or current valid model
            generation_config=generation_config,
            system_instruction=GEMINI_SYSTEM_PROMPT
        )
        
        # Gemini expects image parts. 
        # In a real implementation, we might need to look up proper mime type or just use generic implementation
        # creating a Part object
        
        response = model.generate_content([
            {"mime_type": "image/jpeg", "data": image_bytes},
            f"User selected action: {mode}. Analyze accordingly."
        ])
        
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        # Fallback for hackathon demo if API fails
        return {
            "item": "Unknown Artifact",
            "material": "Unknown",
            "attribute": "Void",
            "type": "weapon" if mode == 'craft' else "skill",
            "stats": {"atk": 10, "def": 0, "hp": 0}
        }

async def generate_flavor_text_with_featherless(item_data: dict):
    # If no key, return placeholder
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
        return response.json()['choices'][0]['message']['content'] # Needs parsing if string
    except Exception as e:
        print(f"Featherless Error: {e}")
        return {
             "name": f"Legendary {item_data['item']}",
             "description": "The description was lost in translation."
        }
