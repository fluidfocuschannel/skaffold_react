# Todo App - React + FastAPI Scaffold

A full-stack todo application with a **React 19** frontend and **FastAPI** backend.

## Project Structure

```
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main app with add/remove logic
│   │   ├── TodoList.jsx   # Todo list component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── backend/           # FastAPI backend
│   ├── main.py            # API endpoints (GET, POST, DELETE)
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## Quick Start

### Option 1: Docker Compose (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Run manually

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint           | Description      |
|--------|--------------------|------------------|
| GET    | `/api/todos`       | List all todos   |
| POST   | `/api/todos`       | Add a new todo   |
| DELETE  | `/api/todos/{id}` | Remove a todo    |
