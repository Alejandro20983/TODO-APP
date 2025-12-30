import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import TodoFilters from "./components/TodoFilters.jsx";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [darkMode, setDarkMode] = useState(false);

  // Cargar tareas y tema desde localStorage al iniciar
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) setTodos(JSON.parse(storedTodos));

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setDarkMode(storedTheme === "dark");
  }, []);

  // Guardar tareas en localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Guardar tema en localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTodo = (task) => {
    const newTodo = { id: Date.now(), task, completed: false };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "Completadas") return todo.completed;
    if (filter === "Pendientes") return !todo.completed;
    return true;
  });

  const editTodo = (id, newTask) => {
    setTodos(
      todos.map(todo => todo.id === id ? {...todo, task: newTask}: todo)
    );
  };

  const sortedTodos = filteredTodos.sort((a, b) => a.completed - b.completed);
  const pedingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;


  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <h1>Mi To-Do App</h1>
      <p style={{textAlign:"center", marginTop:"1rem"}}>
        Total: {totalCount} | Pendientes: {pedingCount} | Completados: {completedCount}
      </p>

      {/* Botón para cambiar tema */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ padding: "0.5rem 1rem", borderRadius: "5px", cursor: "pointer" }}
        >
          Cambiar a {darkMode ? "Claro" : "Oscuro"}
        </button>
      </div>

      <TodoInput addTodo={addTodo} />
      <TodoFilters currentFilter={filter} setFilter={setFilter} />
      <TodoList 
      todos={filteredTodos} 
      toggleComplete={toggleComplete} 
      deleteTodo={deleteTodo}
      editTodo={editTodo} 
      todo={sortedTodos}
      />
    </div>
  );
}

export default App;
