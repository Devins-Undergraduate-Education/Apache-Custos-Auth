# Apache Custos Authentication

This project demonstrates how to integrate a **frontend** and **backend** application with **Apache Custos** for authentication purposes. The application allows users to log in via Custos and displays their user information upon successful authentication.

## Table of Contents

- [Project Structure](#project-structure)
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
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## Prerequisites

- **Node.js** and **npm** installed on your system.
- **Apache Custos** client credentials:
  - `CLIENT_ID`
  - `REDIRECT_URI` (must match the one registered with Custos)
  - `CUSTOS_BASE_URL` (e.g., `https://api.playground.usecustos.org`)

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend```
   
2. **Install dependencies:**
   ```npm install```

3. **Create a ``.env`` file:**
   Create a ``.env`` file in the ``backend/`` directory with the following content:
   ```CLIENT_ID=your-client-id
      REDIRECT_URI=http://localhost:8081/callback
      CUSTOS_BASE_URL=https://api.playground.usecustos.org```
   Replace ``your-client-id`` with your actual Custos client ID. 














