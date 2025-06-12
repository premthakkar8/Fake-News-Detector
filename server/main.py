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
    allow_origins=["http://localhost:3000"],
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

# Load model and vectorizer
try:
    model = joblib.load('model/fake_news_model.pkl')
    vectorizer = joblib.load('model/vectorizer.pkl')
    print("\n=== Model Loading Debug ===")
    print("Model type:", type(model))
    print("Vectorizer type:", type(vectorizer))
    print("Model loaded successfully!")
    print("=== End Model Loading Debug ===\n")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    print("Please make sure you have trained the model first using train_model.py")
    model = None
    vectorizer = None

@app.get("/")
async def root():
    return {"message": "Welcome to Fake News Detection API"}

@app.post("/classify", response_model=PredictionResponse)
async def classify_news(news: NewsItem):
    try:
        if model is None or vectorizer is None:
            print("ERROR: Model or vectorizer is None!")
            raise HTTPException(
                status_code=500,
                detail="Model not loaded. Please train the model first."
            )

        # Combine title and content for analysis
        text = f"{news.title} {news.content}"
        print(f"\n=== Debug Information ===")
        print(f"Input text: {text[:200]}...")  # Print first 200 chars
        
        # Transform the text using the vectorizer
        text_vector = vectorizer.transform([text])
        print("Text vectorized successfully")
        
        # Get prediction and probability
        prediction = model.predict(text_vector)[0]
        probabilities = model.predict_proba(text_vector)[0]
        print(f"Raw prediction: {prediction}")
        print(f"Raw probabilities: {probabilities}")
        
        # Get confidence score (probability of the predicted class)
        confidence = float(probabilities[1] if prediction else probabilities[0])
        # Convert to percentage (0-100)
        confidence_percentage = round(confidence * 100, 2)
        print(f"Final confidence: {confidence_percentage}%")
        
        # Generate explanation with percentage
        explanation = (
            f"This news article is classified as {'fake' if prediction else 'real'} "
            f"with {confidence_percentage}% confidence. "
            f"The model analyzed the text content and title to make this determination."
        )
        
        result = {
            "is_fake": bool(prediction),
            "confidence": confidence_percentage,  # Now returns 0-100 value
            "explanation": explanation
        }
        print(f"Returning result: {result}")
        print("=== End Debug Information ===\n")
        return result
        
    except Exception as e:
        print(f"ERROR in classification: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)