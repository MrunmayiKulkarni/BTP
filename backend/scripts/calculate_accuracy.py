import pandas as pd
import numpy as np
import joblib  # Use joblib as requested
import sys
import re
import os # Import os to check if file exists

def calculate_accuracy(model_path, csv_path):
    # Load the model using joblib
    model = joblib.load(model_path)

    # Load user's workout data
    user_data = pd.read_csv(csv_path)

    # Clean column names
    user_data.columns = [re.sub(r'\s*\[.*?\]\s*|\.', '', col).strip() for col in user_data.columns]

    # Extract the relevant columns for the model
    feature_columns = [
        'lsm6dsv16x_acc_x', 'lsm6dsv16x_acc_y', 'lsm6dsv16x_acc_z',
        'lsm6dsv16x_gyro_x', 'lsm6dsv16x_gyro_y', 'lsm6dsv16x_gyro_z'
    ]
    
    # Ensure all required columns are present
    missing_cols = [col for col in feature_columns if col not in user_data.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")

    user_features = user_data[feature_columns].values

    # Use the classifier to predict the form for each data point (1 for proper, 0 for improper)
    predictions = model.predict(user_features)

    # Calculate accuracy as the percentage of movements classified as 'proper' (label 1)
    if len(predictions) > 0:
        accuracy = np.mean(predictions) * 100
    else:
        accuracy = 0.0
    # Ensure accuracy is within 0-100 range
    accuracy = max(0, min(100, accuracy))

    return accuracy

if __name__ == '__main__':
    try:
        exercise = sys.argv[1]
        csv_path = sys.argv[2]
        
        # --- THIS IS THE FIX ---
        # Construct the model path directly from the exercise argument
        # REMOVED: model_key = exercise.lower().replace(' ', '_')
        model_path = f'models/{exercise}_best.joblib'
        
        # Check if the model file exists before trying to load it
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}. Check if the exercise name is correct.")

        accuracy = calculate_accuracy(model_path, csv_path)
        print(f"{accuracy:.2f}") # Print the accuracy
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1) # Exit with a non-zero status code to indicate failure