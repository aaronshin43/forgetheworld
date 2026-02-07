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

from fastapi import UploadFile, File, Form
from ai_service import analyze_image_with_gemini, generate_flavor_text_with_featherless

@app.post("/scan")
async def scan_item(
    file: UploadFile = File(...), 
    mode: str = Form(...)
):
    contents = await file.read()
    
    # 1. Vision Analysis (Gemini)
    gemini_result = await analyze_image_with_gemini(contents, mode)
    
    # 2. Flavor Text (Featherless)
    flavor_text = await generate_flavor_text_with_featherless(gemini_result)
    if isinstance(flavor_text, str):
        try:
            flavor_text = json.loads(flavor_text)
        except:
            flavor_text = {"name": gemini_result['item'], "description": flavor_text}

    return {
        "analysis": gemini_result,
        "flavor": flavor_text
    }
