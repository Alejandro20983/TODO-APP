// src/components/Roles.jsx
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { supabase } from "../supabase";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/roles.css";

export default function Roles() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [rolesList, setRolesList] = useState([]);
  const [roleInput, setRoleInput] = useState("");
  const [error, setError] = useState("");
  const [userRoleType, setUserRoleType] = useState(""); // 'familia' o 'empresa'

  // Traer rol desde tabla profiles o desde query params si venimos del registro
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get("type");

    if (typeParam) {
      setUserRoleType(typeParam); // Usar tipo desde URL (registro reciente)
      return;
    }

    const fetchUserRole = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("Error fetching user role:", error);
        navigate("/login");
      } else {
        setUserRoleType(data.role);
      }
    };

    fetchUserRole();
  }, [user, navigate, location.search]);

  // Configurar roles predeterminados según tipo
  useEffect(() => {
    if (!userRoleType) return;

    if (userRoleType === "familia") {
      setRolesList([
        { role_name: "madre", display_name: "" },
        { role_name: "padre", display_name: "" },
      ]);
    } else if (userRoleType === "empresa") {
      setRolesList([
        { role_name: "supervisor", display_name: "" },
        { role_name: "gerente", display_name: "" },
      ]);
    }
  }, [userRoleType]);

  const handleChange = (index, value) => {
    const updatedRoles = [...rolesList];
    updatedRoles[index].display_name = value;
    setRolesList(updatedRoles);
  };

  const handleAddRole = () => {
    if (!roleInput) return;
    setRolesList([
      ...rolesList,
      { role_name: roleInput.toLowerCase(), display_name: "" },
    ]);
    setRoleInput("");
  };

  const handleSubmit = async () => {
    setError("");
    if (rolesList.some((r) => !r.display_name)) {
      setError("Todos los roles deben tener un nombre asignado.");
      return;
    }

    const { error: insertError } = await supabase.from("roles").insert(
      rolesList.map((r) => ({
        ...r,
        user_id: user.id,
        can_assign_tasks:
          userRoleType === "empresa" &&
          (r.role_name === "supervisor" || r.role_name === "gerente"),
      }))
    );

    if (insertError) {
      setError("Error al guardar roles: " + insertError.message);
    } else {
      alert("Roles guardados correctamente");
      navigate("/dashboard");
    }
  };

  return (
    <div className="roles-container">
      <h2>
        {userRoleType === "familia"
          ? "Asignar roles familiares"
          : "Asignar cargos de empresa"}
      </h2>

      {rolesList.map((r, index) => (
        <div key={index} className="role-item">
          <label>{r.role_name}</label>
          <input
            type="text"
            placeholder="Nombre"
            value={r.display_name}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}

      {userRoleType === "empresa" && (
        <div className="add-role">
          <input
            type="text"
            placeholder="Nuevo cargo"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
          />
          <button onClick={handleAddRole}>Agregar cargo</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button className="btn-submit" onClick={handleSubmit}>
        Guardar roles
      </button>
    </div>
  );
}
