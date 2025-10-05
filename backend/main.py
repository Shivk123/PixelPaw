from fastapi import FastAPI, Request
from pymongo import MongoClient
import os, requests
from dotenv import load_dotenv
from sentiment import analyze_sentiment

load_dotenv()
app = FastAPI()
client = MongoClient(os.getenv("MONGO_URI"))
db = client.pixelpaw
OLLAMA_API = os.getenv("OLLAMA_API")


@app.post("/chat")
async def chat(req: Request):
    data = await req.json()
    user_msg = data["message"]

    # 1️⃣ Sentiment
    mood = analyze_sentiment(user_msg)

    # 2️⃣ Generate pet reply
    prompt = f"You are {os.getenv('PET_NAME')}, a cute virtual pet. Respond kindly.\nUser: {user_msg}\nPet:"
    res = requests.post(OLLAMA_API, json={"model": "llama3", "prompt": prompt})
    reply = res.json().get("response", "Meow!")

    # 3️⃣ Save chat to DB
    db.chats.insert_one({"user": user_msg, "pet": reply, "mood": mood})
    return {"reply": reply, "mood": mood}
