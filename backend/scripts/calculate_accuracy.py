import pandas as pd
import numpy as np
import joblib
import sys
import re
import os
import json # <-- Make sure json is imported

def calculate_accuracy(model_path, csv_path):
    # --- 1. Check if model file exists ---
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")

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

    # --- 2. Return both accuracy and the predictions list ---
    # Convert numpy array to a standard python list for JSON serialization
    time_series_predictions = predictions.tolist()
    
    return accuracy, time_series_predictions

if __name__ == '__main__':
    try:
        exercise = sys.argv[1]
        csv_path = sys.argv[2]
        
        # Construct model path
        model_name = f"{exercise}_best.joblib"
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', model_name)

        # Get accuracy and time series
        accuracy, time_series = calculate_accuracy(model_path, csv_path)
        
        # --- 3. Create a dictionary and print it as a JSON string ---
        output = {
            "overall_accuracy": accuracy,
            "time_series_predictions": time_series
        }
        
        # Print the JSON object as a single line
        print(json.dumps(output))
        
        sys.stdout.flush()

    except Exception as e:
        # Print any error to stderr so python-shell can catch it
        print(f"Python Error: {str(e)}", file=sys.stderr)
        sys.stderr.flush()
        sys.exit(1) # Exit with a non-zero code to indicate failure