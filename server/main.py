from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Fake News Detection API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class NewsItem(BaseModel):
    title: str
    content: str

# Define response model
class PredictionResponse(BaseModel):
    is_fake: bool
    confidence: float
    explanation: Optional[str] = None

# Load model and vectorizer (to be implemented)
# model = joblib.load('model/fake_news_model.pkl')
# vectorizer = joblib.load('model/vectorizer.pkl')

@app.get("/")
async def root():
    return {"message": "Welcome to Fake News Detection API"}

@app.post("/classify", response_model=PredictionResponse)
async def classify_news(news: NewsItem):
    try:
        # Combine title and content for analysis
        text = f"{news.title} {news.content}"
        
        # TODO: Implement actual model prediction
        # For now, return mock response
        return {
            "is_fake": False,
            "confidence": 0.95,
            "explanation": "This is a mock response. Model implementation pending."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 