import { useState, useEffect } from "react";
import "./App.css";

const fetchTodos = async (setTodos, showError) => {
  try {
    const res = await fetch("http://localhost:3001/todos");
    if (!res.ok) throw new Error("Failed to fetch todos.");
    const data = await res.json();
    setTodos(data);
  } catch {
    showError("Unable to connect to server.");
  }
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos(setTodos, showError);
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const showError = (text) => {
    setError(text);
    setTimeout(() => setError(null), 4000);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      });
      setNewTodo("");
      showMessage("Todo added!");
      fetchTodos(setTodos, showError);
    } catch {
      showError("Error adding todo.");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      showMessage("Todo updated!");
      fetchTodos(setTodos, showError);
    } catch {
      showError("Error updating todo.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3001/todos/${id}`, { method: "DELETE" });
      showMessage("Todo deleted!");
      fetchTodos(setTodos, showError);
    } catch {
      showError("Error deleting todo.");
    }
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingText }),
      });
      setEditingId(null);
      setEditingText("");
      showMessage("Changes saved!");
      fetchTodos(setTodos, showError);
    } catch {
      showError("Error saving changes.");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">📝 Todo List</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Add a todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => toggleTodo(todo.id, e.target.checked)}
            />
            {editingId === todo.id ? (
              <>
                <input
                  className="edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <button onClick={() => startEditing(todo.id, todo.text)}>
                  Edit
                </button>
              </>
            )}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
            >
              X
            </button>
          </li>
        ))}
      </ul>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
    </div>
  );
}
