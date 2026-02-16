function TodoList({ todos, onRemove }) {
  if (todos.length === 0) {
    return <p className="empty">No todos yet. Add one above!</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className="todo-item">
          <span>{todo.text}</span>
          <button className="remove-btn" onClick={() => onRemove(todo.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList
