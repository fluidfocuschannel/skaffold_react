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
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setTodos(data)
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    }
  }

  async function addTodo(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const newTodo = await res.json()
      setTodos((prev) => [...prev, newTodo])
      setInput('')
    } catch (error) {
      console.error('Failed to add todo:', error)
      alert('Failed to add todo. Check console for details.')
    }
  }

  async function removeTodo(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Failed to remove todo:', error)
      alert('Failed to remove todo. Check console for details.')
    }
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
