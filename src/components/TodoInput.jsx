import { useState } from "react";

function TodoInput({ addTodo}){
    const [task, setTask] = useState ("");
    const [priority, setPriority] = useState("0");

    const handleSubmit = (e) => {
        e.preventDefault();
        if(task.trim() === "") return;// Evita generar tareas vacías
        addTodo(task, priority);
        setTask("");//Limpia el campo de entrada después de agregar la tarea
        setPriority("low");
    };


return (
    <form onSubmit={handleSubmit} style={{textAlign:"center", marginTop:"2rem"}}>
        <input
            type="text"
            placeholder="Escribe una nueva tareas..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{padding:"0.5rem", width:"250px"}}
        />
       <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ marginLeft: "0.5rem", padding: "0.5rem" }}>
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
        <button type="submit" style={{padding:"0.5rem 1rem", marginLeft:"0.5rem"}}>
            Agregar
        </button>
    </form>
);
}
export default TodoInput;