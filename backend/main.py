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
from ai_service import analyze_image_with_gemini, generate_item_image, generate_evolution_concept, analyze_skill_image

class ImageRequest(BaseModel):
    prompt: str

class EvolutionRequest(BaseModel):
    base_item: dict
    absorbed_materials: list

@app.post("/scan")
async def scan_item(
    file: UploadFile = File(...), 
    mode: str = Form(...),
    skip_image_generation: bool = Form(False)
):
    contents = await file.read()
    
    # 1. Consolidated Scan (Gemini 2.5 Flash Lite)
    # Returns both analysis and flavor text
    scan_result = await analyze_image_with_gemini(contents, mode)
    
    return scan_result

@app.post("/generate-image")
async def generate_image(request: ImageRequest):
    image_url = await generate_item_image(request.prompt)
    return {"image": image_url}

@app.post("/evolve")
async def evolve_item(request: EvolutionRequest):
    # 1. Concept Generation (Gemini)
    concept = await generate_evolution_concept(request.base_item, request.absorbed_materials)
    
    # 2. Image Generation (Gemini/Imagen)
    image_url = None
    if concept and "visual_prompt" in concept:
        image_url = await generate_item_image(concept["visual_prompt"])
        
    return {
        "name": concept.get("name", "Unknown Evolution"),
        "description": concept.get("description", "A mysterious form."),
        "image": image_url
    }

@app.post("/scan-skill")
async def scan_skill(file: UploadFile = File(...)):
    contents = await file.read()
    skill_data = await analyze_skill_image(contents)
    
    return {
        "analysis": {
            "item": skill_data.get("skill_name"),
            "type": "skill",
            "skill_type": skill_data.get("type", "deal"),
            "rarity_score": 5, 
            "affected_stats": []
        },
        "flavor": {
            "name": skill_data.get("skill_name"),
            "description": skill_data.get("reasoning", "A powerful skill.")
        }
    }
