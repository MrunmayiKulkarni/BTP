-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS fitness_app_db;

-- Use the created database
USE fitness_app_db;

-- Table for storing user authentication details
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing user profile details
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    weight DECIMAL(5, 2), -- Allows for values like 123.45
    height DECIMAL(5, 2), -- Allows for values like 123.45
    gender VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for storing daily user activities (updated to include energy)
CREATE TABLE IF NOT EXISTS daily_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_date DATE NOT NULL,
    calories INT,
    steps INT,
    energy INT, -- Added to match frontend and backend logic
    UNIQUE KEY (user_id, activity_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for storing workout sessions
CREATE TABLE IF NOT EXISTS workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_name VARCHAR(255) NOT NULL,
    workout_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for storing sets within a workout
CREATE TABLE IF NOT EXISTS workout_sets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id INT NOT NULL,
    set_number INT NOT NULL,
    reps INT,
    weight DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);


-- You can add some initial data for testing if you want. For example:
-- INSERT INTO users (email, password) VALUES ('test@example.com', 'hashed_password');
-- INSERT INTO user_profiles (user_id, name, age, weight, height, gender) VALUES (1, 'Test User', 30, 70.5, 175.0, 'Male');
