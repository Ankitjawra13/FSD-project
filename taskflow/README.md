# TaskFlow – Full Stack Task Manager
Stack: HTML/CSS/JS frontend, Node.js + Express REST API, MongoDB (Mongoose), deployed on Vercel.

## API
GET /api/tasks | POST /api/tasks | PATCH /api/tasks/:id | DELETE /api/tasks/:id | GET /api/health

## Run locally
npm install; copy .env.example to .env and set MONGODB_URI; npm start -> http://localhost:3000

## Deploy (Vercel)
1. Create a free MongoDB Atlas cluster, allow access from 0.0.0.0/0, copy the connection string.
2. Push this folder to GitHub.
3. On vercel.com: New Project -> import repo -> add env var MONGODB_URI -> Deploy.
4. Open the live URL and test /api/health.
