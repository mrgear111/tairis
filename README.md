# Tairis

Doctor-Free First Aid Decision Tree

## Overview
Tairis is a web-based application designed to guide users through basic first-aid steps in emergency situations, without needing a doctor immediately. The app uses an interactive decision-tree structure, where users answer simple questions and receive step-by-step first-aid instructions tailored to their situation.

## Features
- Interactive decision tree for emergency first-aid
- Step-by-step guidance based on user responses
- User-friendly and fast interface
- Built with React (frontend), Express.js (backend), Prisma & MySQL (database)

## Getting Started

### Prerequisites
- Node.js & npm
- MySQL (for backend database)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/mrgear111/tairis.git
   cd tairis
   ```
2. Install dependencies for frontend and backend:
   ```sh
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up your MySQL database and update the connection string in `backend/prisma/schema.prisma`.
4. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Start the backend server:
   ```sh
   node server.js
   ```
6. Start the frontend:
   ```sh
   cd ../frontend
   npm run dev
   ```

## Project Structure
```
/README.md                # Project overview
/backend/                 # Express.js backend & Prisma ORM
  /src/
    /routes/             # API route definitions
    /controllers/        # Business logic
    /middleware/         # Custom middleware
    server.js            # Main server file
  /prisma/
    schema.prisma        # Database schema
  package.json
  .env.example
/frontend/                # React + Vite frontend
```

## License
MIT