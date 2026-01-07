import { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import "../styles/login.css";

export default function Login() {
  const { login, register } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("familia");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [extra, setExtra] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      const err = await register({ email, password, role, name, extra });
      if (err) {
        setError(err.message || "Error al registrarse");
      } else {
        alert("Registro exitoso. Revisa tu correo para confirmar y luego inicia sesión.");
        setIsRegister(false);
      }
    } else {
      const err = await login({ email, password });
      if (err) {
        setError(err.message || "Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Registro" : "Iniciar sesión"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="familia">Familia</option>
              <option value="estudiante">Estudiante</option>
              <option value="empresa">Empresa</option>
            </select>
            <input
              type="text"
              placeholder={
                role === "familia"
                  ? "Número de hijos"
                  : role === "estudiante"
                  ? "Grado"
                  : "Sector"
              }
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              required
            />
          </>
        )}

        <button className="btn-submit" type="submit">
          {isRegister ? "Registrarse" : "Iniciar sesión"}
        </button>
      </form>

      <button className="btn-toggle" onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? "¿Ya tienes cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
