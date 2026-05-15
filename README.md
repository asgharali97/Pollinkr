# Pollinkr

Pollinkr is a full-stack poll creation and response collection platform built for a hackathon. It allows users to create polls, share public poll links, collect responses, view analytics, and publish final results.

The project is built with the MERN stack and TypeScript. The frontend and backend are maintained in one repository.

## Features

- User authentication with access and refresh tokens stored in httpOnly cookies
- Protected creator dashboard
- Create polls with title, description, expiry date, and response mode
- Support for anonymous and authenticated response modes
- Multiple poll questions per poll
- Single-option questions
- Mandatory and optional question validation
- Public poll links for respondents
- One response per authenticated user for authenticated polls
- Basic duplicate protection for anonymous polls using request fingerprinting
- Poll expiry handling
- Creator analytics dashboard
- Question-wise summaries and option counts
- Public result publishing after poll completion
- Real-time analytics updates with Socket.io

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Zustand
- React Hook Form
- Zod
- Socket.io Client
- Tailwind CSS

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Zod
- JWT
- bcryptjs
- Socket.io

### Development Database

- MongoDB via Docker Compose

## Repository Structure

```txt
Pollinkr/
  backend/
    src/
      config/
      middleware/
      modules/
      routes/
      sockets/
      types/
      utils/
    package.json
    tsconfig.json

  front-end/
    src/
      components/
      pages/
      store/
      lib/
    package.json
    vite.config.ts

  compose.yml
  README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd Pollinkr
```

### 2. Start MongoDB

```bash
docker compose up -d
```

The local MongoDB URI is:

```txt
mongodb://pollinkr:pollinkr_dev_password@localhost:27017/pollinkr?authSource=admin
```

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://pollinkr:pollinkr_dev_password@localhost:27017/pollinkr?authSource=admin
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
FINGERPRINT_SECRET=replace-with-a-long-random-secret
```

Run the backend:

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

### 4. Frontend setup

```bash
cd front-end
npm install
```

Create a `.env` file inside `front-end` if needed:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Backend Scripts

From the `backend` directory:

```bash
npm run dev
npm run build
npm start
```

## Frontend Scripts

From the `front-end` directory:

```bash
npm run dev
npm run build
npm run preview
```

## API Overview

Base URL:

```txt
http://localhost:5000/api
```

### Auth

```txt
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

Authentication uses httpOnly cookies:

- `pollinkr_access`
- `pollinkr_refresh`

### Creator Poll Routes

Protected routes:

```txt
POST /polls
GET  /polls
GET  /polls/:id
PATCH /polls/:id
POST /polls/:id/close
POST /polls/:id/publish-results
GET  /polls/:id/analytics
```

### Public Poll Routes

```txt
GET  /public/polls/:shareId
POST /public/polls/:shareId/responses
```

## Poll Lifecycle

Polls can have the following statuses:

- `draft`
- `active`
- `expired`
- `published`

Draft polls are not open for responses. Active polls accept responses until they expire or are manually closed. Expired polls stop accepting responses. Published polls expose final results publicly through the poll link.

## Response Rules

- Questions support single-option selection only.
- Mandatory questions must be answered.
- Optional questions may be skipped.
- Authenticated polls require login before response submission.
- Authenticated respondents can submit once per poll.
- Anonymous polls use request fingerprinting to reduce duplicate submissions.

## Analytics

Poll creators can view:

- Total responses
- Question-wise response totals
- Option counts
- Participation rate
- Live response updates through Socket.io

After results are published, public visitors can view summaries through the same poll link.

## Deployment Notes

Recommended deployment:

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas

Backend environment variables required in production:

```env
NODE_ENV=production
CLIENT_ORIGIN=<frontend-deployment-url>
MONGODB_URI=<mongodb-atlas-uri>
JWT_ACCESS_SECRET=<long-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<long-random-secret>
JWT_REFRESH_EXPIRES_IN=7d
FINGERPRINT_SECRET=<long-random-secret>
```

Frontend environment variables required in production:

```env
VITE_API_URL=<backend-url>/api
VITE_SOCKET_URL=<backend-url>
```

## Current Status

The application includes backend authentication, poll management, public response collection, analytics, real-time updates, and frontend wiring for the main user flows.

## License

This project was built as a hackathon submission.
