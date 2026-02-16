# Copilot Instructions for Skaffold React Todo App

## Project Architecture

This is a full-stack React + FastAPI todo application with:
- **Frontend**: React 19 with Vite, served on port 3000
- **Backend**: FastAPI with in-memory todo storage, served on port 8000  
- **Deployment**: Docker Compose orchestrates both services

### Key Integration Point
Vite proxy (in [vite.config.js](frontend/vite.config.js)) routes all `/api` requests to the FastAPI backend at `http://localhost:8000`. Frontend code uses relative `/api/*` URLs that work identically in development and production.

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

## Development Workflow

### Starting the Application

**Recommended - Docker Compose (includes both services):**
```bash
docker-compose up --build
```
Access frontend at `http://localhost:3000` and backend API docs at `http://localhost:8000/docs`.

**Manual setup (for debugging individual services):**
```bash
# Terminal 1: Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev
```

## React Component Patterns

### Data Flow with Hooks
- **Setup**: `useEffect()` runs once on mount to fetch initial todos
- **Form handling**: `addTodo()` validates input, POSTs to backend, updates state optimistically
- **Deletions**: `removeTodo()` sends DELETE request, updates state to filter out todo

Example from [App.jsx](frontend/src/App.jsx):
```javascript
async function addTodo(e) {
  e.preventDefault()
  const text = input.trim()
  if (!text) return // Simple validation
  
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  const newTodo = await res.json()
  setTodos((prev) => [...prev, newTodo]) // Optimistic update
  setInput('')
}
```

### Component Structure
- **App** (container): Manages todos state, API calls, form input. Defines `API_URL` constant.
- **TodoList** (presentational): Receives `todos` array and `onRemove()` callback. Renders empty state or list of items.

Pass data down (as props), callbacks up (to parent). No state lifting beyond App.

## FastAPI Backend Patterns

### API Structure
All endpoints are under `/api` namespace using Pydantic models for validation:

```python
class TodoCreate(BaseModel):
    text: str  # Required, validated by FastAPI

class TodoResponse(BaseModel):
    id: int
    text: str
```

### Endpoints
- `GET /api/todos` → Returns all todos as `list[TodoResponse]`
- `POST /api/todos` → Creates todo from `TodoCreate`, returns 201 with `TodoResponse`
- `DELETE /api/todos/{todo_id}` → Returns 204 if successful, 404 if not found

### CORS Configuration
[main.py](backend/main.py) allows requests exclusively from `http://localhost:3000` during development. Do not modify `allow_origins` without considering deployment environments.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Restrict as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Critical Implementation Details

1. **In-Memory Storage**: Todos are stored in a Python list that resets on backend restart. This is intentional for this scaffold—persistence would require a database.

2. **ID Generation**: Backend tracks `next_id` globally. When modifying CRUD logic, ensure ID uniqueness.

3. **Error Handling**: 
   - Frontend assumes successful responses; consider adding try-catch for network errors
   - Backend returns 404 for missing todos (delete a non-existent todo)

4. **Dependencies**:
   - Minimal: React, React-DOM, FastAPI, Uvicorn, Pydantic
   - No state management (Redux, Zustand), no ORM, no form libraries
   - Keep it simple—only add dependencies if multiple components need shared state

## Adding Features

### New API Endpoint Example
1. Define input/output Pydantic model in [backend/main.py](backend/main.py)
2. Add route with appropriate HTTP method and `/api` prefix
3. Frontend fetches relative to `/api` (Vite proxy handles routing)

### New React Component
1. Create as functional component in [frontend/src/](frontend/src/)
2. Accept props for data and callbacks
3. Use `fetch()` for API calls, same pattern as [App.jsx](frontend/src/App.jsx)

## Docker Considerations

Services communicate via container networking:
- Frontend container reaches backend at `http://backend:8000` (inside compose network)
- For development, `localhost:8000` works from host machine
- Volumes mount code for live reload—changes don't require rebuild
