# Fitness Tracker Application

This project is a full-stack fitness tracking application with a React frontend and a Node.js (Express) backend.

## How to Set Up and Run This Project

### Prerequisites

Before you begin, make sure you have the following installed on your system:
*   **Node.js and npm:** [Download here](https://nodejs.org/)
*   **MySQL Server:** [Download here](https://dev.mysql.com/downloads/mysql/)

---

### Backend Setup

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up the MySQL Database:**
    *   Log in to your local MySQL server (e.g., `mysql -u root -p`).
    *   Create the database by running this SQL command:
        ```sql
        CREATE DATABASE fitness_app_db;
        ```
    *   Run the initialization script to create the `users` table. From the `backend` directory, run this command in your terminal (it will ask for your MySQL password):
        ```bash
        mysql -u root -p fitness_app_db < init.sql
        ```

4.  **Configure Database Connection:**
    *   In the `backend` directory, open the `db.js` file.
    *   Update the `user`, `password`, and `database` fields with your MySQL credentials.

5.  **Start the Backend Server:**
    ```bash
    node server.js
    ```
    The backend should now be running on `http://localhost:3001`.

---

### Frontend Setup

1.  **Open a new terminal.**

2.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Start the Frontend Application:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`. You should now be able to sign up and log in.
