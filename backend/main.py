from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "Forge the World"}

import json
import re
from fastapi import UploadFile, File, Form
from fastapi import UploadFile, File, Form, Body
from pydantic import BaseModel
from ai_service import analyze_image_with_gemini, generate_flavor_text_with_featherless, generate_item_image, generate_item_image_v2

class ImageRequest(BaseModel):
    prompt: str

@app.post("/scan")
async def scan_item(
    file: UploadFile = File(...), 
    mode: str = Form(...),
    skip_image_generation: bool = Form(False)
):
    contents = await file.read()
    
    # 1. Vision Analysis (Gemini)
    gemini_result = await analyze_image_with_gemini(contents, mode)
    
    if skip_image_generation:
        return {
            "analysis": gemini_result,
            "flavor": {
                "name": gemini_result.get("item", "Unknown Material"),
                "description": "A material used for enhancing items."
            }
        }

    # 2. Flavor Text (Featherless)
    flavor_text = await generate_flavor_text_with_featherless(gemini_result)
    if isinstance(flavor_text, str):
        raw = flavor_text.strip()
        # parse json
        if raw.startswith("```"):
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
        try:
            flavor_text = json.loads(raw)
        except Exception:
            flavor_text = {"name": gemini_result["item"], "description": flavor_text}

    return {
        "analysis": gemini_result,
        "flavor": flavor_text
    }

@app.post("/generate-image")
async def generate_image(request: ImageRequest):
    image_url = await generate_item_image_v2(request.prompt)
    return {"image": image_url}
