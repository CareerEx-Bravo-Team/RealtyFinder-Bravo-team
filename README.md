# RealtyFinder-Bravo-team
Internship



📦 Monorepo Workflow Overview

Our project follows a monorepo structure, meaning both frontend and backend code live in a single repository.
This makes it easier to manage, version, and deploy everything together.

🗂 Folder Structure

project-root/
│
├── backEnd/        # Server-side (Node.js, Express, APIs, DB logic)
│   ├── src/        
│   │   ├── config/        # Environment & database configuration
│   │   ├── controllers/   # Functions that handle API requests
│   │   ├── middlewares/   # Request validation, authentication, etc.
│   │   ├── models/        # Database schemas (Mongoose)
│   │   ├── routes/        # API route definitions
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # App entry point
│   ├── package.json
│   └── ...
│
├── frontEnd/       # Client-side (React, Next.js, or other UI framework)
│   ├── src/
│   │   ├── components/    # Reusable UI parts
│   │   ├── pages/         # Screens or routes
│   │   ├── services/      # API calls to backend
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── package.json    # (optional) Root-level config for monorepo tooling
└── README.md



🔄 How a Request Flows

When a user interacts with the frontend, here’s how the request moves:

1. User Action in Frontend

Example: User clicks "Login" on the React UI.

The frontend calls a function from services/api.js (or similar).

2. Frontend → Backend API Call

The frontend sends an HTTP request (e.g., POST /api/auth/login) to the backend server.

This request usually goes to something like:


    http://localhost:5000/api/auth/login  (development)
    https://api.ourapp.com/api/auth/login (production)


3. Backend Route Matches Request

The backend routes/auth.js matches /api/auth/login and sends the request to the controller.

4. Controller Handles Logic

Example: authController.login()

Validates input, checks database via models, and runs authentication logic.

5. Database Operations (if needed)

The model (Mongoose schema) queries MongoDB or other databases to fetch/save data.

6. Response Sent Back to Frontend

The controller sends JSON (success, error, or data) back to the frontend.

7. Frontend Updates UI

React updates the UI based on the response (e.g., redirects to dashboard or shows error).




🚀 Development Workflow
Backend

    cd backEnd
    npm install
    npm run dev   # Start backend API server


Frontend

    cd frontEnd
    npm install
    npm start     # Start frontend development server


Both Running Together (optional)
If using concurrently or a workspace tool:


    npm run dev   # Runs frontend & backend in parallel
