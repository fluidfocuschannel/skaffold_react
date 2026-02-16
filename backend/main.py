from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store
todos: list[dict] = []
next_id = 1


class TodoCreate(BaseModel):
    text: str


class TodoResponse(BaseModel):
    id: int
    text: str


@app.get("/api/todos", response_model=list[TodoResponse])
def get_todos():
    return todos


@app.post("/api/todos", response_model=TodoResponse, status_code=201)
def add_todo(todo: TodoCreate):
    global next_id
    new_todo = {"id": next_id, "text": todo.text}
    todos.append(new_todo)
    next_id += 1
    return new_todo


@app.delete("/api/todos/{todo_id}", status_code=204)
def remove_todo(todo_id: int):
    global todos
    original_len = len(todos)
    todos = [t for t in todos if t["id"] != todo_id]
    if len(todos) == original_len:
        raise HTTPException(status_code=404, detail="Todo not found")
