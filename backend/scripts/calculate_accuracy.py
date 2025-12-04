import pandas as pd
import numpy as np
import joblib
import sys
import re
import os
import json
import tensorflow as tf

# --- Constants ---
WINDOW_SIZE = 50
STEP_SIZE = 10

def create_sequences(data, window_size=50):
    """
    Converts a 2D numpy array into 3D sequences for LSTM prediction.
    This version is for inference, so it doesn't handle labels.
    """
    X_seq = []
    # Create sequences using a sliding window
    for i in range(len(data) - window_size + 1):
        X_seq.append(data[i:i + window_size])
    
    # If no full sequences can be formed, return an empty array
    if not X_seq:
        return np.array([])
        
    return np.array(X_seq)

def calculate_accuracy(model_path, scaler_path, csv_path):
    # --- 1. Check if model and scaler files exist ---
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"Scaler file not found at: {scaler_path}")

    # --- 2. Load Model and Scaler ---
    model = tf.keras.models.load_model(model_path)
    scaler = joblib.load(scaler_path)

    # --- 3. Load and Preprocess User Data ---
    user_data = pd.read_csv(csv_path)
    user_data.columns = [re.sub(r'\s*\[.*?\]\s*|\.', '', col).strip() for col in user_data.columns]

    feature_columns = [
        'lsm6dsv16x_acc_x', 'lsm6dsv16x_acc_y', 'lsm6dsv16x_acc_z',
        'lsm6dsv16x_gyro_x', 'lsm6dsv16x_gyro_y', 'lsm6dsv16x_gyro_z'
    ]
    
    missing_cols = [col for col in feature_columns if col not in user_data.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")

    user_features = user_data[feature_columns].values
    
    # --- 4. Scale Features and Create Sequences ---
    # Apply the same scaling as during training
    scaled_features = scaler.transform(user_features)
    
    # Create 3D sequences
    sequences = create_sequences(scaled_features, WINDOW_SIZE)

    # If there are not enough data points to form a single sequence, return 0 accuracy
    if sequences.shape[0] == 0:
        return 0.0, [0] * len(user_data)

    # --- 5. Make Predictions ---
    # Predict the probability of "proper form" for each sequence
    sequence_predictions = model.predict(sequences, verbose=0)
    
    # The output is probabilities, convert to binary (0 or 1) based on a 0.5 threshold
    binary_sequence_predictions = (sequence_predictions > 0.5).astype(int).flatten()

    # --- 6. Map Sequence Predictions to Time Series ---
    # Create an array to hold the prediction for each original time step (frame)
    time_series_predictions = np.zeros(len(user_data), dtype=int)
    
    # To avoid complex averaging, we can use a "last-prediction-wins" approach for overlapping windows
    for i, seq_pred in enumerate(binary_sequence_predictions):
        start_index = i
        end_index = start_index + WINDOW_SIZE
        # Assign the sequence's prediction to all frames within that window
        time_series_predictions[start_index:end_index] = seq_pred

    # --- 7. Calculate Overall Accuracy ---
    # The overall accuracy is the mean of the per-frame predictions
    if len(time_series_predictions) > 0:
        accuracy = np.mean(time_series_predictions) * 100
    else:
        accuracy = 0.0
        
    accuracy = max(0, min(100, accuracy))

    return accuracy, time_series_predictions.tolist()

if __name__ == '__main__':
    try:
        exercise = sys.argv[1]
        csv_path = sys.argv[2]
        
        # --- Construct paths for LSTM model and Scaler ---
        model_name = f"{exercise}_lstm.h5"
        scaler_name = f"{exercise}_scaler.joblib"
        
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, '..', 'models', model_name)
        scaler_path = os.path.join(base_dir, '..', 'models', scaler_name)

        # Get accuracy and time series
        accuracy, time_series = calculate_accuracy(model_path, scaler_path, csv_path)
        
        output = {
            "overall_accuracy": accuracy,
            "time_series_predictions": time_series
        }
        
        print(json.dumps(output))
        sys.stdout.flush()

    except Exception as e:
        print(f"Python Error: {str(e)}", file=sys.stderr)
        sys.stderr.flush()
        sys.exit(1)
