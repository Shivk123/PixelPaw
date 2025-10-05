from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from pymongo import MongoClient
import os, requests
from datetime import datetime
from dotenv import load_dotenv
from sentiment import analyze_sentiment
from fallback_chat import get_fallback_response
from character_actions import extract_actions_from_response, update_stats_from_sentiment, get_action_response

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# MongoDB setup
# ------------------------
client = MongoClient(os.getenv("MONGO_URI"))
db = client.pixelpaw

# ------------------------
# Config
# ------------------------
PET_NAME = os.getenv("PET_NAME", "Pixel")
OLLAMA_API = os.getenv("WEBUI_API", "http://localhost:11434/api/generate")

# ------------------------
# Models for FastAPI
# ------------------------
class ChatMessage(BaseModel):
    message: str
    petType: str
    petName: str
    model: str = "llama3.2:1b"

class Query(BaseModel):
    prompt: str
    model: str = "llama3.2:1b"

class Conversation(BaseModel):
    id: str
    messages: List[Dict[str, str]] = []

conversations: Dict[str, Conversation] = {}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PixelPaw Backend"}

# ------------------------
# Generate a single reply (PixelPaw chat)
# ------------------------
@app.post("/chat")
async def chat(query: ChatMessage):
    user_msg = query.message
    print(f"[DEBUG] User message: {user_msg}")

    # 1️⃣ Sentiment analysis
    mood = analyze_sentiment(user_msg)
    print(f"[DEBUG] Sentiment: {mood}")

    # 2️⃣ Get current stats for updates
    try:
        pet_data = db.pets.find_one({"name": query.petName})
        current_stats = pet_data.get("stats", {
            "happiness": 70, "curiosity": 65, "obedience": 55, "energy": 80,
            "angry": 0, "sad": 0, "level": 1, "xp": 0, "xpToNextLevel": 100
        }) if pet_data else {
            "happiness": 70, "curiosity": 65, "obedience": 55, "energy": 80,
            "angry": 0, "sad": 0, "level": 1, "xp": 0, "xpToNextLevel": 100
        }
    except Exception as e:
        print(f"[ERROR] Failed to get current stats: {e}")
        current_stats = {"happiness": 70, "curiosity": 65, "obedience": 55, "energy": 80, "angry": 0, "sad": 0, "level": 1, "xp": 0, "xpToNextLevel": 100}

    # 3️⃣ Send prompt to Ollama generate API
    prompt = f"You are {query.petName}, a cute and emotionally aware {query.petType} virtual pet. Use *action* format for physical actions (like *wags tail* or *purrs*). Respond kindly and naturally as a {query.petType} would.\nUser: {user_msg}\n{query.petName}:"

    try:
        payload = {
            "model": query.model,
            "prompt": prompt,
            "stream": False
        }
        response = requests.post(OLLAMA_API, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        print(f"[DEBUG] Ollama response: {data}")

        reply = data.get("response", "").strip()
        if not reply:
            reply = "*tilts head* I didn't quite understand that. Could you try again?"

    except Exception as e:
        print(f"[ERROR] Ollama request failed: {e}")
        print("[INFO] Using fallback chat system")
        reply = get_fallback_response(query.petName, query.petType, user_msg)

    # 4️⃣ Extract actions and update stats
    actions = extract_actions_from_response(reply)
    updated_stats = update_stats_from_sentiment(current_stats, mood, user_msg)
    
    # 5️⃣ Save updated stats
    try:
        db.pets.update_one(
            {"name": query.petName},
            {"$set": {"stats": updated_stats, "lastUpdated": datetime.utcnow()}},
            upsert=True
        )
    except Exception as e:
        print(f"[ERROR] Failed to update stats: {e}")

    # 6️⃣ Save chat in MongoDB
    try:
        db.chats.insert_one({
            "user": user_msg, 
            "pet": reply, 
            "mood": mood,
            "actions": actions,
            "petName": query.petName,
            "petType": query.petType,
            "timestamp": datetime.utcnow()
        })
    except Exception as e:
        print(f"[ERROR] MongoDB save failed: {e}")

    return {"reply": reply, "mood": mood, "actions": actions, "stats": updated_stats}

# ------------------------
# Pet Stats API
# ------------------------
@app.get("/pet/{pet_name}/stats")
async def get_pet_stats(pet_name: str):
    try:
        pet_data = db.pets.find_one({"name": pet_name})
        if not pet_data:
            return {
                "happiness": 70,
                "curiosity": 65,
                "obedience": 55,
                "energy": 80,
                "angry": 0,
                "sad": 0,
                "level": 1,
                "xp": 0,
                "xpToNextLevel": 100
            }
        return pet_data.get("stats", {
            "happiness": pet_data.get("happiness", 70),
            "curiosity": 65,
            "obedience": 55,
            "energy": 80,
            "angry": 0,
            "sad": 0,
            "level": pet_data.get("level", 1),
            "xp": pet_data.get("xp", 0),
            "xpToNextLevel": 100
        })
    except Exception as e:
        print(f"[ERROR] Failed to get pet stats: {e}")
        return {"happiness": 70, "curiosity": 65, "obedience": 55, "energy": 80, "angry": 0, "sad": 0, "level": 1, "xp": 0, "xpToNextLevel": 100}

@app.post("/pet/{pet_name}/stats")
async def update_pet_stats(pet_name: str, stats: dict):
    try:
        db.pets.update_one(
            {"name": pet_name},
            {"$set": {"stats": stats, "lastUpdated": datetime.utcnow()}},
            upsert=True
        )
        return {"success": True}
    except Exception as e:
        print(f"[ERROR] Failed to update pet stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to update stats")

# ------------------------
# Journal API
# ------------------------
@app.post("/journal")
async def save_journal_entry(entry: dict):
    try:
        entry["timestamp"] = datetime.utcnow()
        result = db.journal.insert_one(entry)
        return {"id": str(result.inserted_id), "success": True}
    except Exception as e:
        print(f"[ERROR] Failed to save journal entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to save journal entry")

@app.get("/journal")
async def get_journal_entries():
    try:
        entries = list(db.journal.find().sort("timestamp", -1).limit(50))
        for entry in entries:
            entry["_id"] = str(entry["_id"])
        return entries
    except Exception as e:
        print(f"[ERROR] Failed to get journal entries: {e}")
        return []

# ------------------------
# Conversation tracking endpoints
# ------------------------
@app.post("/conversation/start")
async def start_conversation(conv_id: str):
    if conv_id in conversations:
        raise HTTPException(status_code=400, detail="Conversation ID already exists")
    conversations[conv_id] = Conversation(id=conv_id)
    return {"message": f"Conversation {conv_id} started"}

@app.post("/conversation/{conv_id}/message")
async def add_message(conv_id: str, query: Query):
    if conv_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation = conversations[conv_id]
    conversation.messages.append({"role": "user", "content": query.prompt})

    # Generate reply using Ollama
    prompt = f"You are {PET_NAME}, a cute and emotionally aware virtual pet. Respond kindly.\nUser: {query.prompt}\n{PET_NAME}:"

    try:
        response = requests.post(
            OLLAMA_API, json={"model": query.model, "prompt": prompt}, timeout=60
        )
        response.raise_for_status()
        generated_text = response.json().get("response", "").strip()
        if not generated_text:
            generated_text = "Meow! I didn't quite get that."
        conversation.messages.append({"role": "assistant", "content": generated_text})
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500, detail=f"Error communicating with Ollama: {str(e)}"
        )

    # Save chat in MongoDB
    mood = analyze_sentiment(query.prompt)
    db.chats.insert_one({"user": query.prompt, "pet": generated_text, "mood": mood})

    return {"generated_text": generated_text, "mood": mood}

@app.get("/conversation/{conv_id}")
async def get_conversation(conv_id: str):
    if conv_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversations[conv_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)