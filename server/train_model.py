import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os
import seaborn as sns
import matplotlib.pyplot as plt

def load_and_preprocess_data(file_path):
    """Load and preprocess the dataset."""
    print(f"Loading data from {file_path}...")
    df = pd.read_csv(file_path)
    return df

def plot_confusion_matrix(y_true, y_pred):
    """Plot confusion matrix."""
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.savefig('model/confusion_matrix.png')
    plt.close()

def train_model():
    """Train the fake news detection model."""
    # Create model directory if it doesn't exist
    os.makedirs('model', exist_ok=True)
    
    # Load and preprocess data
    df = load_and_preprocess_data('dataset/processed_liar.csv')
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['label'], test_size=0.2, random_state=42
    )
    
    print("\nTraining data shape:", X_train.shape)
    print("Testing data shape:", X_test.shape)
    
    # Create and fit the vectorizer
    print("\nCreating and fitting TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=5000,
        stop_words='english',
        ngram_range=(1, 2)
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Train the model
    print("\nTraining Logistic Regression model...")
    model = LogisticRegression(
        max_iter=1000,
        C=1.0,
        class_weight='balanced'
    )
    model.fit(X_train_vec, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test_vec)
    
    # Print evaluation metrics
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Plot confusion matrix
    plot_confusion_matrix(y_test, y_pred)
    print("\nConfusion matrix plot saved as 'model/confusion_matrix.png'")
    
    # Save the model and vectorizer
    joblib.dump(model, 'model/fake_news_model.pkl')
    joblib.dump(vectorizer, 'model/vectorizer.pkl')
    print("\nModel and vectorizer saved successfully!")

if __name__ == "__main__":
    train_model() 