from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") 
supabase: Client = create_client(URL, KEY)

@app.post("/notes")
async def add_note(note: dict, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        user_id = user.user.id

        response = supabase.table("notes").insert({
            "content": note['content'],
            "user_id": user_id
        }).execute()
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.get("/diary")
async def get_diary(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
        
    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    user_id = user.user.id

    response = supabase.table("notes").select("*").eq("user_id", user_id).execute()
    return response.data