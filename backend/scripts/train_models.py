
import os
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib

import re
# Define base paths
base_data_path = '/home/sahil/BTP/BTP/Machine Learning/training_data/'
models_output_path = '/home/sahil/BTP/BTP/backend/models/'

# Ensure the output directory for models exists
os.makedirs(models_output_path, exist_ok=True)

# Get the list of exercise directories
try:
    exercise_folders = [f for f in os.listdir(base_data_path) if os.path.isdir(os.path.join(base_data_path, f))]
except FileNotFoundError:
    print(f"Error: The directory '{base_data_path}' was not found.")
    exit()

print(f"Found exercises: {exercise_folders}")

# Loop through each exercise folder
for exercise in exercise_folders:
    print(f"--- Processing exercise: {exercise} ---")
    exercise_path = os.path.join(base_data_path, exercise)
    
    proper_form_path = os.path.join(exercise_path, 'proper_form')
    improper_form_path = os.path.join(exercise_path, 'improper_form')

    all_data_frames = []

    # Process proper form data
    if os.path.exists(proper_form_path):
        for filename in os.listdir(proper_form_path):
            if filename.endswith('.csv'):
                file_path = os.path.join(proper_form_path, filename)
                try:
                    df = pd.read_csv(file_path)
                    df['form'] = 1  # Label for proper form
                    all_data_frames.append(df)
                except Exception as e:
                    print(f"Could not read or process file {filename}: {e}")
    else:
        print(f"Warning: 'proper_form' directory not found for {exercise}")

    # Process improper form data
    if os.path.exists(improper_form_path):
        for filename in os.listdir(improper_form_path):
            if filename.endswith('.csv'):
                file_path = os.path.join(improper_form_path, filename)
                try:
                    df = pd.read_csv(file_path)
                    df['form'] = 0  # Label for improper form
                    all_data_frames.append(df)
                except Exception as e:
                    print(f"Could not read or process file {filename}: {e}")
    else:
        print(f"Warning: 'improper_form' directory not found for {exercise}")

    # Combine all data for the current exercise
    if not all_data_frames:
        print(f"No data found for exercise: {exercise}. Skipping.")
        continue

    combined_df = pd.concat(all_data_frames, ignore_index=True)

    # Clean column names to be consistent with the prediction script
    combined_df.columns = [re.sub(r'\s*\[.*?\]\s*|\.', '', col).strip() for col in combined_df.columns]

    # Prepare data for training
    # Drop the time column as it's not a useful feature
    features = combined_df.drop(columns=['Time [s]', 'form'])
    feature_columns = [
        'lsm6dsv16x_acc_x', 'lsm6dsv16x_acc_y', 'lsm6dsv16x_acc_z',
        'lsm6dsv16x_gyro_x', 'lsm6dsv16x_gyro_y', 'lsm6dsv16x_gyro_z'
    ]

    features = combined_df[feature_columns]
    target = combined_df['form']

    # Initialize and train the Decision Tree model
    print(f"Training model for {exercise}...")
    model = DecisionTreeClassifier(random_state=42)
    model.fit(features, target)

    # Save the trained model
    model_filename = f"{exercise}_best.joblib"
    model_save_path = os.path.join(models_output_path, model_filename)
    joblib.dump(model, model_save_path)

    print(f"Model for {exercise} trained and saved to {model_save_path}")

print("\nAll models have been trained and saved.")
