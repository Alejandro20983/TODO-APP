import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import TodoFilters from "./components/TodoFilters.jsx";
import Login from "./components/Login.jsx";
import { supabase } from "./supabase";
import { useUser } from "./contexts/UserContext.jsx";
import "./styles/global.css";

function App() {
  const { user, loading, logout } = useUser(); 
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [darkMode, setDarkMode] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("Todas");

  // Cargar tareas en tiempo real
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`todos_user_${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` },
        (payload) => {
          fetchTodos();
        }
      )
      .subscribe();

    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setTodos(data);
    };

    fetchTodos();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Guardar tema en localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setDarkMode(storedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTodo = async (task, priority = "low") => {
    if (!user) return;
    await supabase.from("tasks").insert({ task, completed: false, priority, user_id: user.id });
  };

  const toggleComplete = async (id, completed) => {
    await supabase.from("tasks").update({ completed: !completed }).eq("id", id);
  };

  const deleteTodo = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
  };

  const editTodo = async (id, newTask) => {
    await supabase.from("tasks").update({ task: newTask }).eq("id", id);
  };

  // Filtrado y orden
  const filteredTodos = todos.filter((todo) => {
    if (filter === "Completadas" && !todo.completed) return false;
    if (filter === "Pendientes" && todo.completed) return false;
    if (priorityFilter === "Baja" && todo.priority !== "low") return false;
    if (priorityFilter === "Media" && todo.priority !== "medium") return false;
    if (priorityFilter === "Alta" && todo.priority !== "high") return false;
    return true;
  });

  const sortedTodos = filteredTodos.sort((a, b) => a.completed - b.completed);

  // Contadores
  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando usuario...</p>;
  if (!user) return <Login />;

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <h1>Mi To-Do App</h1>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Total: {totalCount} | Pendientes: {pendingCount} | Completadas: {completedCount}
      </p>

      {/* Botones */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ padding: "0.5rem 1rem", borderRadius: "5px", cursor: "pointer", marginRight: "1rem" }}
        >
          Cambiar a {darkMode ? "Claro" : "Oscuro"}
        </button>
        <button onClick={logout} style={{ padding: "0.5rem 1rem", borderRadius: "5px", cursor: "pointer" }}>
          Cerrar sesión
        </button>
      </div>

      <TodoInput addTodo={addTodo} />
      <TodoFilters
        currentFilter={filter}
        setFilter={setFilter}
        currentPriority={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      <TodoList
        todos={sortedTodos}
        toggleComplete={(id) => {
          const todo = todos.find((t) => t.id === id);
          toggleComplete(id, todo.completed);
        }}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
      />
    </div>
  );
}

export default App;
