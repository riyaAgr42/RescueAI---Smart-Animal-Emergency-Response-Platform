# RescueAI - Smart Animal Emergency Response Platform

RescueAI is a full-stack MERN web application built to help people quickly report injured or emergency animals and connect them with volunteers, NGOs, and rescue teams.

This project is designed as a real-time rescue coordination platform with role-based access, live case updates, AI-inspired report analysis, and a modern responsive UI.

## 1. Project Summary

### What this project does
- A user can report an injured or emergency animal.
- A volunteer can accept the rescue request and update the rescue status.
- An admin can monitor rescue cases and manage users.
- The system analyzes the report description and gives a smart severity summary.
- Socket.IO is used so rescue updates can be shared in real time.

### Main goal
The main goal of this project is to reduce rescue response time and make animal emergency reporting more organized, trackable, and technology-driven.

## 2. Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication
- bcryptjs
- Multer

### Database
- MongoDB Atlas
- Mongoose

## 3. Current Features

### Authentication
- User signup
- User login
- JWT token-based authentication
- Role-based route protection

### Rescue Case Management
- Create animal rescue reports
- Add description, image, live location, animal type, emergency level
- Case status flow:
  - `pending`
  - `accepted`
  - `en_route`
  - `at_clinic`
  - `completed`

### Volunteer Features
- Accept rescue requests
- Reject rescue requests
- Mark rescue as en route
- Mark rescue as completed
- Update volunteer location

### Animal Module
- Create animal records
- Add health updates
- Add doctor appointment details
- Change animal status

### Smart / AI-inspired Features
- Animal type inference from report context
- Severity prediction from rescue description
- Duplicate-risk style summary
- First-aid suggestions

### UI / UX
- Dark and light mode
- Emergency-focused dashboard
- Modern glassmorphism UI
- Responsive layout

## 4. Folder Structure

```txt
frontend/
  src/
    components/
    context/
    hooks/
    pages/
    services/

backend/
  src/
    config/
    middleware/
    models/
    routes/
    services/
    socket/
    utils/
```

## 5. Important Backend Modules

### Authentication
- [backend/src/routes/authRoutes.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/routes/authRoutes.js>)
- [backend/src/middleware/auth.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/middleware/auth.js>)
- [backend/src/models/User.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/models/User.js>)

### Rescue Cases
- [backend/src/routes/caseRoutes.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/routes/caseRoutes.js>)
- [backend/src/models/Case.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/models/Case.js>)
- [backend/src/services/caseAnalysisService.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/services/caseAnalysisService.js>)

### Volunteer Flow
- [backend/src/routes/volunteerRoutes.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/routes/volunteerRoutes.js>)

### Animals
- [backend/src/routes/animalRoutes.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/routes/animalRoutes.js>)
- [backend/src/models/Animal.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/models/Animal.js>)

### Server and Realtime
- [backend/src/server.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/server.js>)
- [backend/src/socket/registerSocketHandlers.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/backend/src/socket/registerSocketHandlers.js>)

## 6. Important Frontend Modules

- [frontend/src/App.jsx](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/frontend/src/App.jsx>)
- [frontend/src/context/AuthContext.jsx](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/frontend/src/context/AuthContext.jsx>)
- [frontend/src/hooks/useCases.js](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/frontend/src/hooks/useCases.js>)
- [frontend/src/pages/Dashboard.jsx](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/frontend/src/pages/Dashboard.jsx>)
- [frontend/src/pages/Report.jsx](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/frontend/src/pages/Report.jsx>)
- [frontend/src/pages/Volunteer.jsx](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/frontend/src/pages/Volunteer.jsx>)
- [frontend/src/pages/Animals.jsx](</c:/Full-Stack-Projects/RescueAI – Smart Animal Emergency Response Platform/frontend/src/pages/Animals.jsx>)

## 7. How the Project Works

### Basic flow
1. A user logs in.
2. The user creates an emergency animal report.
3. The backend stores the report and generates a smart AI-style summary.
4. The case appears in the dashboard.
5. A volunteer accepts the case.
6. The volunteer updates the rescue progress.
7. The case status changes in real time.

### Real-time flow
- When a case is created, updated, or deleted, the backend emits Socket.IO events.
- The frontend volunteer/dashboard pages listen for those events and refresh case data.

## 8. Current Environment Setup

### Backend `.env`
Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
Example:

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_SOCKET=http://localhost:5000
```

## 9. Current Known Issue

At the moment, the backend has a safe fallback mode:
- if MongoDB is unavailable, the server still starts
- API routes return `503 Service Unavailable`
- this avoids full backend crash during development

This is why the frontend may show:

```txt
Database is currently unavailable. Start MongoDB Atlas or fix MONGO_URI, then retry.
```

## 10. How to Run

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 11. Interview Questions and Simple Answers

### 1. What is RescueAI?
RescueAI is a MERN stack web application for reporting animal emergencies, assigning volunteers, and tracking rescue progress in real time.

### 2. Why did you build this project?
I wanted to solve a real-world problem. Many injured animals do not get help on time. This project makes rescue reporting and coordination faster and more organized.

### 3. Which technologies did you use?
I used React and Tailwind on the frontend, Node.js and Express on the backend, MongoDB for the database, and Socket.IO for real-time updates.

### 4. Why did you choose the MERN stack?
I chose MERN because it is good for full-stack JavaScript development. It allows me to use JavaScript in both frontend and backend, which makes development easier and faster.

### 5. What is the main feature of this project?
The main feature is emergency animal reporting with real-time rescue coordination between users, volunteers, and admins.

### 6. How does authentication work in your project?
When a user logs in, the backend verifies the credentials and creates a JWT token. That token is sent with future requests to protect private routes and APIs.

### 7. How did you implement role-based access control?
Each user has a role like `user`, `volunteer`, or `admin`. Protected backend routes check the role before allowing access. The frontend also protects pages based on role.

### 8. How does real-time communication work here?
I used Socket.IO. When a rescue case is created or updated, the backend emits an event. The frontend listens for that event and refreshes the case list.

### 9. What happens when a user reports an animal?
The report form sends the case data to the backend. The backend validates the input, saves the case, adds AI-style analysis, and then shares the case with connected clients.

### 10. What AI features are included?
This version includes AI-inspired analysis such as animal type detection from the report context, severity prediction, duplicate-risk style summary, and first-aid suggestions.

### 11. How do you store rescue case information?
I store it in MongoDB using Mongoose models. Each case contains description, location, image URL, status, priority, AI analysis, creator, and assigned volunteer.

### 12. Why did you use Mongoose?
Mongoose helps define clear schemas, validate data, and interact with MongoDB in a structured way.

### 13. How did you secure passwords?
Passwords are hashed using `bcryptjs` before saving them to the database.

### 14. Why did you use JWT instead of sessions?
JWT is simple for API-based applications. It works well with React frontend and Express backend because the frontend can store the token and send it with each request.

### 15. What does the volunteer module do?
It allows volunteers to accept rescue cases, mark themselves en route, complete the rescue, and update location for better coordination.

### 16. What is the purpose of the animal module?
The animal module helps store rescued animal details, health updates, and appointment information after the rescue step.

### 17. How did you design the UI?
I designed it with an emergency-focused style using navy blue, royal blue, orange, glassmorphism cards, and a responsive dashboard layout.

### 18. What challenges did you face?
- MongoDB connection issues during development
- dark mode text contrast problems
- handling backend downtime without breaking the frontend
- keeping real-time and normal API flows organized

### 19. How did you solve the backend crash problem?
I changed the backend so it can still start even if MongoDB is unavailable. Instead of crashing, it returns `503` responses with a clear message.

### 20. What is one thing you would improve next?
I would add a real AI model integration, live map tracking, push notifications, forgot password, and a full production deployment setup.

### 21. What makes this project different from a basic CRUD app?
This is not only CRUD. It includes role-based access, real-time events, emergency workflow management, AI-style rescue analysis, and a more realistic multi-user system.

### 22. How do you explain the project architecture simply?
The frontend handles UI and user interaction. The backend handles APIs, business logic, auth, and sockets. MongoDB stores data. Socket.IO keeps rescue data updated in real time.

### 23. What happens if the database is down?
The backend still starts, but API routes return `503 Service Unavailable` with a clear message. This helps the frontend fail gracefully instead of breaking completely.

### 24. What did you personally learn from this project?
I learned how to structure a MERN app, protect routes, build role-based flows, handle real-time updates, design a better UI, and debug frontend-backend integration issues.

## 12. Short Self-Introduction for Interview

You can say this:

> I built RescueAI, a MERN stack animal emergency rescue platform. In this project, users can report injured animals, volunteers can accept rescue cases, and admins can monitor everything. I implemented JWT authentication, role-based protection, real-time case updates using Socket.IO, and AI-inspired rescue analysis. I also designed a modern responsive UI and handled backend failure cases gracefully.

## 13. Short Project Explanation for Mentor

You can explain it in simple language like this:

> RescueAI is a smart rescue management system for animal emergencies. A user reports an injured animal with details like image, description, and location. The backend stores the report and creates a smart severity summary. Volunteers can accept the case and update the rescue progress. Admins can monitor everything from the dashboard. The frontend is built in React, the backend is built in Express, data is stored in MongoDB, and real-time updates are handled with Socket.IO.

## 14. Final Note

This project is already a strong full-stack academic/interview project because it shows:
- real-world problem solving
- MERN architecture
- auth and security basics
- role-based logic
- real-time communication
- smart feature integration
- UI/UX thinking

If you want next, I can also create:
- a separate `INTERVIEW_QA.md`
- a `PROJECT_EXPLANATION.md`
- a `MENTOR_PRESENTATION.md`
- or a `README` section with viva questions only
