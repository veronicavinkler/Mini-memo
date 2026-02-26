from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os

app = FastAPI()

# Enable CORS so your Vite app (Vercel) can talk to this API (Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Setup
URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(URL, KEY)

@app.post("/notes")
def add_note(note: dict, authorization: str = Header(None)):
    token = authorization.replace("Bearer ", "")
    supabase.postgrest.auth(token)
    response = supabase.table("notes").insert({"content": note['content']}).execute()
    return response.data

@app.get("/diary")
def get_diary():
    response = supabase.table("diary").select("*").execute()
    return response.data

from pydantic import BaseModel

class AuthSchema(BaseModel):
    email: str
    password: str

@app.post("/signup")
def signup(data: AuthSchema):
    try:
        res = supabase.auth.sign_up({"email": data.email, "password": data.password})
        return {"message": "Success! Please check your email for a confirmation link."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
def login(data: AuthSchema):
    try:
        res = supabase.auth.sign_in_with_password({"email": data.email, "password": data.password})
        
        return {
            "access_token": res.session.access_token,
            "user": res.user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid credentials")