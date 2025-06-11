import os
import pandas as pd
import requests
from zipfile import ZipFile
from io import BytesIO
import numpy as np

def download_liar_dataset():
    """Download the LIAR dataset."""
    print("Downloading LIAR dataset...")
    
    # Create dataset directory if it doesn't exist
    os.makedirs('dataset', exist_ok=True)
    
    # URL for the LIAR dataset
    url = "https://www.cs.ucsb.edu/~william/data/liar_dataset.zip"
    
    try:
        # Download the dataset
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Extract the zip file
        with ZipFile(BytesIO(response.content)) as zip_file:
            zip_file.extractall('dataset')
        
        print("Dataset downloaded and extracted successfully!")
        
    except Exception as e:
        print(f"Error downloading dataset: {str(e)}")
        return False
    
    return True

def preprocess_liar_dataset():
    """Preprocess the LIAR dataset."""
    print("Preprocessing LIAR dataset...")
    
    try:
        # Read the training data
        train_data = pd.read_csv('dataset/train.tsv', sep='\t', header=None)
        
        # Define column names
        columns = ['id', 'label', 'statement', 'subject', 'speaker', 'job_title', 
                  'state_info', 'party_affiliation', 'barely_true_counts', 
                  'false_counts', 'half_true_counts', 'mostly_true_counts', 
                  'pants_on_fire_counts', 'context']
        
        # Assign column names
        train_data.columns = columns
        
        # Map labels to binary (0 for true, 1 for false)
        label_map = {
            'true': 0,
            'mostly-true': 0,
            'half-true': 0,
            'barely-true': 1,
            'false': 1,
            'pants-fire': 1
        }
        
        # Convert labels to binary
        train_data['binary_label'] = train_data['label'].map(label_map)
        
        # Create a new dataframe with only the required columns
        processed_data = pd.DataFrame({
            'text': train_data['statement'],
            'label': train_data['binary_label']
        })
        
        # Save processed data
        processed_data.to_csv('dataset/processed_liar.csv', index=False)
        print("Dataset preprocessed and saved successfully!")
        
        # Print some statistics
        print("\nDataset Statistics:")
        print(f"Total samples: {len(processed_data)}")
        print(f"True news samples: {len(processed_data[processed_data['label'] == 0])}")
        print(f"Fake news samples: {len(processed_data[processed_data['label'] == 1])}")
        
    except Exception as e:
        print(f"Error preprocessing dataset: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    if download_liar_dataset():
        preprocess_liar_dataset() 