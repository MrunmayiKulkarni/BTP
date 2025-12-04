import os
import pandas as pd
import numpy as np
import joblib
import logging
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# --- Configuration ---
# Adjust these paths if running on Google Colab (e.g., '/content/drive/MyDrive/...')
TRAINING_DATA_DIR = "/home/sahil/BTP/BTP/Machine Learning/training_data"
MODEL_DIR = "/home/sahil/BTP/BTP/backend/models"

# LSTM Hyperparameters
WINDOW_SIZE = 50   # 50 frames (approx 1.5 - 2 seconds of motion)
STEP_SIZE = 10     # Overlap window by moving 10 frames at a time
EPOCHS = 20
BATCH_SIZE = 32

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

def create_sequences(df, label, window_size=50, step_size=10):
    """
    Converts a dataframe into 3D sequences (Samples, Time Steps, Features).
    """
    X_seq, y_seq = [], []
    # Exclude non-feature columns
    feature_cols = [c for c in df.columns if c not in ["Time [s]", "label", "temp_file_id"]]
    data = df[feature_cols].values
    
    # Sliding window
    for i in range(0, len(data) - window_size, step_size):
        X_seq.append(data[i:i + window_size])
        y_seq.append(label)
        
    return np.array(X_seq), np.array(y_seq)

def train_lstm_for_exercise(exercise_name):
    logging.info(f"--- Starting LSTM training for: {exercise_name} ---")
    
    proper_path = os.path.join(TRAINING_DATA_DIR, exercise_name, "proper_form")
    improper_path = os.path.join(TRAINING_DATA_DIR, exercise_name, "improper_form")
    
    # 1. Load Data
    all_dfs = []
    
    for path, label in [(proper_path, 1), (improper_path, 0)]:
        if not os.path.exists(path):
            logging.warning(f"Path not found: {path}. Skipping.")
            continue
            
        for file in os.listdir(path):
            if file.endswith(".csv"):
                df = pd.read_csv(os.path.join(path, file))
                df['label'] = label
                df['temp_file_id'] = file # Prevent windowing across separate files
                all_dfs.append(df)
    
    if not all_dfs:
        logging.error(f"No data found for {exercise_name}. Skipping.")
        return

    # 2. Fit Scaler (Crucial for LSTM convergence)
    full_dataset = pd.concat(all_dfs, ignore_index=True)
    feature_cols = [c for c in full_dataset.columns if c not in ["Time [s]", "label", "temp_file_id"]]
    
    scaler = StandardScaler()
    scaler.fit(full_dataset[feature_cols])
    
    # Save Scaler (Needed for inference later)
    os.makedirs(MODEL_DIR, exist_ok=True)
    scaler_path = os.path.join(MODEL_DIR, f"{exercise_name}_scaler.joblib")
    joblib.dump(scaler, scaler_path)
    logging.info(f"Scaler saved to {scaler_path}")

    # 3. Create Sequences
    X_list, y_list = [], []
    
    for df in all_dfs:
        # Normalize this file's data
        df[feature_cols] = scaler.transform(df[feature_cols])
        
        # Create sliding windows
        seq_x, seq_y = create_sequences(df, df['label'].iloc[0], WINDOW_SIZE, STEP_SIZE)
        if len(seq_x) > 0:
            X_list.append(seq_x)
            y_list.append(seq_y)

    if not X_list:
        logging.error(f"Not enough data to create sequences for {exercise_name} (Check Window Size).")
        return

    X = np.concatenate(X_list)
    y = np.concatenate(y_list)
    
    # 4. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=True)
    
    # 5. Build Model
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
        Dropout(0.2),
        LSTM(32, return_sequences=False),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(optimizer=Adam(learning_rate=0.001), loss='binary_crossentropy', metrics=['accuracy'])
    
    # 6. Train
    model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1)
    
    # 7. Evaluate and Save
    loss, acc = model.evaluate(X_test, y_test, verbose=0)
    logging.info(f"Final Accuracy for {exercise_name}: {acc*100:.2f}%")
    
    model_path = os.path.join(MODEL_DIR, f"{exercise_name}_lstm.h5")
    model.save(model_path)
    logging.info(f"Model saved to {model_path}\n")

if __name__ == "__main__":
    # Automatically find all exercise folders
    if os.path.exists(TRAINING_DATA_DIR):
        exercises = [d for d in os.listdir(TRAINING_DATA_DIR) if os.path.isdir(os.path.join(TRAINING_DATA_DIR, d))]
        
        print(f"Found {len(exercises)} exercises: {exercises}")
        
        for exercise in exercises:
            train_lstm_for_exercise(exercise)
            
        print("All exercises processed.")
    else:
        print(f"Error: Directory '{TRAINING_DATA_DIR}' not found.")