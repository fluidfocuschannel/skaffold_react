import { useState, useEffect } from 'react'
import TodoList from './TodoList.jsx'
import './App.css'

const API_URL = '/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const res = await fetch(API_URL)
    const data = await res.json()
    setTodos(data)
  }

  async function addTodo(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const newTodo = await res.json()
    setTodos((prev) => [...prev, newTodo])
    setInput('')
  }

  async function removeTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      <h1>Todo List</h1>
      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
          autoFocus
        />
        <button type="submit">Add</button>
      </form>
      <TodoList todos={todos} onRemove={removeTodo} />
    </div>
  )
}

export default App
