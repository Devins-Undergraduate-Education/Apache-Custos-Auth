# Apache Custos Authentication

This project demonstrates how to integrate a **frontend** and **backend** application with **Apache Custos** for authentication purposes. The application allows users to log in via Custos and displays their user information upon successful authentication.

## Table of Contents

- [Quickstart](#quickstart)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Project Details](#project-details)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Important Notes](#important-notes)
- [Custos Integration Details](#custos-integration-details)


## Quickstart 

> **These instructions assume all necessary files and dependencies are installed. This is intended to be a quick-reference guide for frontend and backend startup. For first time users, it is highly recommended to skip this step and proceed below.**

### Backend

```node server.js```

### Frontend

```npm start```

## Prerequisites

- **Node.js** and **npm** installed on your system.
- **Apache Custos** client credentials:
  - `CLIENT_ID`
  - `REDIRECT_URI` (must match the one registered with Custos)
  - `CUSTOS_BASE_URL` (e.g., `https://api.playground.usecustos.org`)

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**

   ```
   cd custos-auth-backend
   ```
   
2. **Install dependencies:**
   ```npm install```

3. **Create a `.env` file:**
   Create a `.env` file in the `backend/` directory with the following content:
   
   ```
   CLIENT_ID=your-client-id
   REDIRECT_URI=http://localhost:8081/callback
   CUSTOS_BASE_URL=https://api.playground.usecustos.org
   ```
   
   Replace `your-client-id` with your actual Custos client ID.
   Ensure the `REDIRECT_URI` matches exactly with the one registered in Custos.

4. **Start the backend server:**
   ```node server.js```
   The backend server will run on `http://localhost:8081`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```cd custos-auth-frontend```
   
2. **Install dependencies:**
   ```npm install```

3. **Start the frontend application:**
   ```npm start```
   The frontend application will run on `http://localhost:3000`

## Running the Application

1. **Access the frontend application:**
   Open your web browser and navigate to `http://localhost:3000`

2. **Initiate the login process:**
   Click the "**Login** button to be redirected to the Custos authentication page.

3. **Authenticate with Custos:**
   Enter your Custos user credentials to log in.

4. **View user information:**
   After successful authentication, you will be directed to the dashboard displaying your name and email.

## Project Details

### Backend

**Technologies Used:**
- Node.js
- Express.js
- Axios
- express-session
- dotenv

**Key Files:**
- `server.js`: Main server file handling authentication routes
- `.env`: Enviroment variables (not committed to version control)

### Frontend

**Technologies Used:**
- React
- react-router-dom

**Key Files:**
- `src/App.ks`: Main application component with routing
- `src/Login.js`: Component with login button
- `src/Dashboard.js`: Component displaying user information

**Routes**
- `/`: Login page
- `/dashboard`: Dashboard displaying user info

## Environment Variables

### Backend

Create a `.env` file in the `custos-auth-backend/` directory with the following variables:
  ```
  CLIENT_ID=your-client-id
  REDIRECT_URI=http://localhost:8081/callback
  CUSTOS_BASE_URL=https://api.playground.usecustos.org
  ```
  - **CLIENT_ID:** Your Custos client ID
  - **REDIRECT_URI:** Must match exactly with the one registered in Custos
  - **CUSTOS_BASE_URL:** The base URL for the Custos API

## Important Notes

### Environment Variables:

Ensure that your `.env` file is **not** committed to the repository. It's included in `.gitignore` to prevent exposing sensitive information.

### Custos Client Registration

If you haven't registered your application with Custos, you'll need to do so to obtain your `CLIENT_ID` and set up the `REDIRECT_URI`.

### HTTPS Considerations:

For development purposes, the application runs over HTTP. For production environments, make sure to use HTTPS to secure user data.

### Dependency Installation:

Make sure to run `npm install` in both the `custos-auth-frontend` and `custos-auth-backend` directories to install all required dependencies.

## Custos Integration Details

### Initiate User Authentication

**Purpose:** Redirects the user to Custos to begin the authentication process.

**Endpoint:** `GET /api/v1/identity-management/authorize`

**Location in Code:** `server.js` within the `/login` route

### Exchange Authorization Code for Tokens

**Purpose:** Exchanges the received authorization code for access and refresh tokens.

**Endpoint:** `POST /api/v1/identity-management/token`

**Location in Code:** `server.js` within the `/callback` route

### Retrieve User Information

**Purpose:** Fetches the authenticated user's profile details such as name and email.

**Endpoint:** `GET /api/v1/user-management/userinfo`

**Location in Code:** `server.js` within the `/callback` route

### Fetch User Group Memberships

**Purpose:** Obtains the groups or roles assigned to the user for authorization purposes.

**Endpoint:** `GET /api/v1/group-management/users/{userId}/group-memberships`

**Location in Code:** `server.js` within the `/callback` route

### Revoke Refresh Token and Logout User

**Purpose:** Revokes the user's refresh token to invalidate their session and logs them out securely.

**Endpoint:** `POST /api/v1/identity-management/user/logout`

**Location in Code:** `server.js` within the `/logout` route
