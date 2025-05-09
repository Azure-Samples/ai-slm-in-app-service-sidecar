import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path

from app.models.product import Product
from app.api.fashion_assistant import router as fashion_router

# Load environment variables from .env file if present
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)

# Set base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize templates
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

app = FastAPI(
    title="Fashion Assistant API",
    description="FastAPI server for the Fashion Assistant application using SLM",
    version="1.0.0",
)

# Mount static files directory
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

# Include the fashion assistant router
app.include_router(fashion_router, prefix="/api")

@app.get("/")
async def root(request: Request):
    """Serve the main HTML page with products"""
    products = Product.get_all_products()
    return templates.TemplateResponse("index.html", {"request": request, "products": products})

if __name__ == "__main__":
    # For development purposes
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
