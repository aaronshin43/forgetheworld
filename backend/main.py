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
from ai_service import analyze_image_with_gemini, generate_flavor_text_with_featherless, generate_item_image, generate_item_image_v2, generate_evolution_concept, analyze_skill_image

class ImageRequest(BaseModel):
    prompt: str

class EvolutionRequest(BaseModel):
    base_item: dict
    absorbed_materials: list

class LeaderboardEntry(BaseModel):
    player_name: str
    combat_power: int
    survival_time: int
    kill_count: int
    weapons: list

# In-memory leaderboard storage (for hackathon - would use DB in production)
leaderboard_db = []

@app.post("/leaderboard/submit")
async def submit_score(entry: LeaderboardEntry):
    leaderboard_db.append(entry.dict())
    # Sort by combat power descending
    leaderboard_db.sort(key=lambda x: x['combat_power'], reverse=True)
    # Keep only top 10
    while len(leaderboard_db) > 10:
        leaderboard_db.pop()
    return {"status": "success", "rank": leaderboard_db.index(entry.dict()) + 1 if entry.dict() in leaderboard_db else None}

@app.get("/leaderboard")
async def get_leaderboard():
    return {"leaderboard": leaderboard_db[:10]}

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

@app.post("/evolve")
async def evolve_item(request: EvolutionRequest):
    # 1. Concept Generation (Gemini)
    concept = await generate_evolution_concept(request.base_item, request.absorbed_materials)
    
    # 2. Image Generation (Gemini/Imagen)
    image_url = None
    if concept and "visual_prompt" in concept:
        image_url = await generate_item_image_v2(concept["visual_prompt"])
        
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
