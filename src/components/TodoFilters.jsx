function TodoFilters({ currentFilter, setFilter }) {
  const filters = ["Todas", "Completadas", "Pendientes"];

  return (
    <div className="filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={currentFilter === filter ? "active" : ""}
          onClick={() => setFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default TodoFilters;
