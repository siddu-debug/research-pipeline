"""
Multi-Agent Research Pipeline — FastAPI Backend
Production-ready with dynamic CORS
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routes.research import router as research_router
from routes.reports import router as reports_router

app = FastAPI(title="Multi-Agent Research Pipeline", version="1.0.0")

# Allow both local dev and production Vercel URL
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", ""),   # set this in Render dashboard
    "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             # tighten after deploy if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(research_router, prefix="/api/research", tags=["Research"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])

os.makedirs("output", exist_ok=True)
app.mount("/output", StaticFiles(directory="output"), name="output")

@app.get("/")
def root():
    return {"status": "ok", "message": "Multi-Agent Research Pipeline API"}

@app.get("/health")
def health():
    return {"status": "healthy"}
