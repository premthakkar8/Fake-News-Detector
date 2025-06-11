# Fake News Detection API

This is the backend API for the Fake News Detection application. It provides endpoints for classifying news articles as real or fake using machine learning.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the API

Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## Endpoints

- `GET /`: Welcome message
- `POST /classify`: Classify a news article
  - Request body:
    ```json
    {
        "title": "Article title",
        "content": "Article content"
    }
    ```
  - Response:
    ```json
    {
        "is_fake": boolean,
        "confidence": float,
        "explanation": string
    }
    ```

## Training the Model

To train the model:
```bash
python train_model.py
```

The trained model and vectorizer will be saved in the `model/` directory.

## Environment Variables

Create a `.env` file in the server directory with the following variables:
```
API_KEY=your_api_key_here
MODEL_PATH=model/fake_news_model.pkl
VECTORIZER_PATH=model/vectorizer.pkl
``` 