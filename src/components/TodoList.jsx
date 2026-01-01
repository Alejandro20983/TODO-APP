import { useState } from "react";
import "../styles/priority.css"; // Asegúrate que el archivo se llame así

function TodoList({ todos, toggleComplete, deleteTodo, editTodo }) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.task);
  };

  const handleSave = (id) => {
    editTodo(id, editingText);
    setEditingId(null);
    setEditingText("");
  };

  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`${todo.completed ? "completed" : ""} ${
            todo.priority ? `todo-priority-${todo.priority}` : ""
          }`}
        >
          {editingId === todo.id ? (
            <>
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{ flex: 1, marginRight: "0.5rem", padding: "0.3rem" }}
              />
              <button onClick={() => handleSave(todo.id)}>Guardar</button>
            </>
          ) : (
            <>
              <span
                onClick={() => toggleComplete(todo.id)}
                className={todo.completed ? "completed" : ""}
                onDoubleClick={() => handleEdit(todo)}
              >
                {todo.task}
              </span>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                🗑️
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
