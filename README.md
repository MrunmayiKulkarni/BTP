# Gym Tracker Pro

Gym Tracker Pro is a full-stack web application designed to help users monitor their workouts, track their fitness progress, and achieve their health goals. It features a user-friendly interface for logging exercises, viewing workout history, and visualizing progress over time.

## Key Features

- **User Authentication:** Secure user registration and login functionality.
- **Workout Logging:** Easily log workout details, including exercises, sets, reps, and weight.
- **Exercise Form Correction:** Provides real-time feedback on exercise form using machine learning models.
- **Workout History:** View a detailed history of all completed workouts.
- **Progress Visualization:** Interactive charts to visualize workout volume, exercise progress, and weekly activity.
- **Personalized Profile:** Manage your profile and track your fitness journey.

## Technology Stack

- **Frontend:**
  - React
  - Tailwind CSS
  - Recharts for charting
- **Backend:**
  - Node.js with Express
  - MySQL for the database
  - JWT for authentication
- **Machine Learning:**
  - Python with TensorFlow/Keras for exercise form analysis

---

## How to Set Up and Run This Project

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js and npm:** [Download Node.js](https://nodejs.org/)
- **MySQL Server:** [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Python:** [Download Python](https://www.python.org/downloads/) (for the machine learning features)

---

### Backend Setup

1.  **Navigate to the Backend Directory:**
    ```bash
    cd BTP/backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up the MySQL Database:**
    - Run the `schema.sql` script to automatically create the database and tables. You will be prompted for your MySQL root password.
      ```bash
      mysql -u root -p < schema.sql
      ```

4.  **Configure Database Connection:**
    - Open `backend/db.js`.
    - Update the `createConnection` object with your MySQL credentials:
      ```javascript
      const pool = mysql.createPool({
        host: 'localhost',
        user: 'your_username', // <-- Replace with your MySQL username
        password: 'your_password', // <-- Replace with your MySQL password
        database: 'fitness_app_db', 
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
        });
      ```

5.  **Start the Backend Server:**
    ```bash
    node server.js
    ```
    The backend will run on `http://localhost:3001`.

---

### Frontend Setup

1.  **Open a new terminal.**

2.  **Navigate to the Frontend Directory:**
    ```bash
    cd BTP/frontend
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Start the Frontend Application:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`. You can now sign up and start tracking your fitness!
