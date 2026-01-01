function TodoFilters({ currentFilter, setFilter, currentPriority, setPriorityFilter }) {
  const filters = ["Todas", "Completadas", "Pendientes"];
  const priorityFilters = ["Baja", "Media", "Alta"];

  return (
    <div className="filters" style={{ textAlign: "center", marginTop: "1rem" }}>
      {/* Filtros por estado */}
      {filters.map((filter) => (
        <button
          key={filter}
          className={currentFilter === filter ? "active" : ""}
          onClick={() => setFilter(filter)}
          style={{ marginRight: "0.3rem" }}
        >
          {filter}
        </button>
      ))}

      {/* Filtros por prioridad */}
      {priorityFilters.map((priority) => (
        <button
          key={priority}
          className={currentPriority === priority ? "active" : ""}
          onClick={() => setPriorityFilter(priority)}
          style={{ marginRight: "0.3rem" }}
        >
          {priority}
        </button>
      ))}
    </div>
  );
}

export default TodoFilters;
