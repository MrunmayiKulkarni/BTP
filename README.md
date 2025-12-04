# Fitness Tracker Application

This project is a full-stack fitness tracking application built with a React frontend and a Node.js (Express) backend, using MySQL for data storage.

## How to Set Up and Run This Project

### Prerequisites

Before you begin, make sure you have the following installed on your system:

*   **Node.js and npm:** [Download and Install Node.js](https://nodejs.org/)
*   **MySQL Server:** [Download and Install MySQL](https://dev.mysql.com/downloads/mysql/)

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

    *   In the `backend` directory, create a new file named `.env`.
    *   Add your MySQL database credentials to the `.env` file like this:

        ```
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_mysql_password
        DB_NAME=fitness_app_db
        ```

    *   *Note: I've updated the setup to use a `.env` file. If you are still hardcoding credentials in `db.js`, you should update that file instead. Using environment variables is highly recommended.*

5.  **Start the Backend Server:**

    ```bash
    node server.js
    ```

    The backend should now be running on `http://localhost:3001`.

---

### Frontend Setup

1.  **Open a new terminal window.**

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
