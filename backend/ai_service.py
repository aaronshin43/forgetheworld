import os
import json
import io
import base64
from PIL import Image
from google import genai
from google.genai import types
import requests
from dotenv import load_dotenv
from prompts import GEMINI_SYSTEM_PROMPT, get_flavor_text_prompt, get_image_generation_prompt

load_dotenv()

# Configure Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Featherless / Vultr Inference
FEATHERLESS_API_URL = os.getenv("FEATHERLESS_API_URL", "https://api.featherless.ai/v1/chat/completions")
FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY")

FEATHERLESS_MODEL = "google/gemma-2-2b-it"
# FEATHERLESS_MODEL = "google/gemma-3-1b-it"
# FEATHERLESS_MODEL = "microsoft/Phi-4-mini-instruct"


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
        print(f"Gemini Response: {response.text}")
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

    prompt = get_flavor_text_prompt(item_data)
    
    try:
        headers = {
            "Authorization": f"Bearer {FEATHERLESS_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": FEATHERLESS_MODEL,
            "messages": [
                {"role": "system", "content": "You are a dramatic fantasy system. Return JSON only."},
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

async def generate_item_image(prompt: str):
    try:
        # 1. Generate Image with Imagen
        print(f"Generating image for: {prompt}")
        
        full_prompt = get_image_generation_prompt(prompt)

        # Generate with Imagen
        response = client.models.generate_images(
            model='imagen-4.0-generate-001', 
            prompt=full_prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",
                output_mime_type="image/jpeg"
            )
        )

        # # Generate with NanoBanana
        # response = client.models.generate_content(
        #     model='gemini-2.5-flash-image', 
        #     contents=full_prompt,
        #     config=types.GenerateContentConfig(
        #         image_config=types.ImageConfig(
        #             aspect_ratio="1:1",
        #         ),
        #     )
        # )

        if not response.generated_images:
            return None

        # 2. Process Image (Resize & Convert to WebP)
        image_bytes = response.generated_images[0].image.image_bytes
        return process_image_bytes(image_bytes)

    except Exception as e:
        print(f"Imagen Error: {e}")
        return None

async def generate_item_image_v2(prompt: str):
    try:
        # 1. Generate Image with Gemini (Flash Image)
        print(f"Generating image (v2) for: {prompt}")
        
        full_prompt = get_image_generation_prompt(prompt)

        response = client.models.generate_content(
            model='gemini-2.5-flash-image', 
            contents=full_prompt,
            config=types.GenerateContentConfig(
                response_modalities=['Image'],
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
