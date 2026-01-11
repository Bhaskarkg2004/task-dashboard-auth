# Frontend Developer Intern Assignment

## Overview
This is a Scalable Web App with Authentication & Dashboard built with React (Vite) and Node.js (Express) + MongoDB.

## Features
- **Frontend**: React, TailwindCSS, React Hook Form, Lucide React.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Authentication**: JWT-based, Protected Routes (Login/Register/Logout).
- **Dashboard**: CRUD operations for Tasks with Search and Filter.
- **Profile**: View and Update User Profile.

## How to Run

### Prerequisite
- Ensure MongoDB is running on `mongodb://localhost:27017`.

### Server
```bash
cd server
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

## API Endpoints
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)
- `GET /api/tasks` - Get all tasks (Protected)
- `POST /api/tasks` - Create task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

## Scalability Notes
- **Modular Structure**: The code is separated into routes, controllers (logic inside routes for now, can be separated), and models.
- **Environment Variables**: Configuration is managed via `.env`.
- **Stateless Auth**: JWT allows for horizontal scaling of the backend.
- **Component Reusability**: React components are small and focused.
