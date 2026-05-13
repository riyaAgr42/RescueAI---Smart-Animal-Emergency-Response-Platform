# RescueAI – Smart Animal Emergency Response Platform

Full-stack MERN web app with Tailwind UI to report injured animals, coordinate volunteers, and track rescues in real time.

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Multer/Cloudinary uploads, Socket.io
- Frontend: React (Vite), Tailwind CSS, React Router, Axios, socket.io-client

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string

### Backend
```bash
cd backend
cp .env.example .env            # fill values
npm install
npm run dev                     # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env            # update API URLs if needed
npm install
npm run dev                     # starts on http://localhost:5173
```

## Environment Variables
Backend `.env`:
- `PORT` – API port (default 5000)
- `MONGO_URI` – Mongo connection string
- `JWT_SECRET` – secret for signing tokens
- `CLIENT_URL` – frontend origin for CORS
- `CLOUDINARY_*` – optional for remote image storage

Frontend `.env`:
- `VITE_API_URL` – e.g., `http://localhost:5000/api`
- `VITE_API_SOCKET` – e.g., `http://localhost:5000`

## Features Implemented
- Landing, auth (signup/login), user dashboard with filters
- Report animal with photo upload + auto geolocation
- AI-inspired priority inference from description keywords
- Volunteer dashboard to accept/complete rescues (Mark as Rescued)
- Admin panel to view cases and manage users
- Real-time case updates via Socket.io
- Dark mode toggle, responsive Tailwind UI, soft green palette
- Map embed (OpenStreetMap) for locations

## API Overview
- `POST /api/auth/register` – create user (role user/volunteer)
- `POST /api/auth/login` – login and receive JWT
- `GET /api/auth/users` – admin-only list
- `POST /api/cases` – create case (multipart, fields: description, latitude, longitude, image)
- `GET /api/cases` – list (query: status, priority)
- `GET /api/cases/:id` – single case
- `PUT /api/cases/:id` – update status/assignment (volunteer/admin)
- `DELETE /api/cases/:id` – delete (admin)
- `POST /api/volunteer/accept/:id` – accept case
- `POST /api/volunteer/complete/:id` – mark rescued

## Notes
- Local uploads land in `backend/uploads`; enable Cloudinary for production.
- Socket events emitted: `case:new`, `case:update`, `case:delete`.
- Tailwind design tuned for hackathon-ready modern look; adjust colors in `tailwind.config.js`.
