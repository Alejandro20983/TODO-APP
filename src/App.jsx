import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import TodoFilters from "./components/TodoFilters.jsx";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [darkMode, setDarkMode] = useState(false);
  const[priorityFilter, setPriorityFilter] = useState("Todas");

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

  // Agregar tarea con prioridad
  const addTodo = (task, priority = "low") => {
    const newTodo = {
      id: Date.now(),
      task,
      completed: false,
      priority, // low, medium, high
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newTask) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, task: newTask } : todo))
    );
  };

  // Filtrado por completadas/pendientes
  const filteredTodos = todos.filter((todo) => {
    if (filter === "Completadas") return todo.completed;
    if (filter === "Pendientes") return !todo.completed;

    if(priorityFilter === "Baja" && todo.priority !== "low") return false;
    if(priorityFilter === "Media" && todo.priority !== "medium") return false;
    if(priorityFilter === "Alta" && todo.priority !== "high") return false;
    return true;
  });

  // Ordenar: pendientes arriba
  const sortedTodos = filteredTodos.sort((a, b) => a.completed - b.completed);

  // Contadores
  const pendingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <h1>Mi To-Do App</h1>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Total: {totalCount} | Pendientes: {pendingCount} | Completadas: {completedCount}
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
      <TodoFilters currentFilter={filter} setFilter={setFilter} currentPriority={priorityFilter} setPriorityFilter={setPriorityFilter} />
      {/* Pasar sortedTodos a TodoList */}
      <TodoList
        todos={sortedTodos}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
      />
    </div>
  );
}

export default App;
