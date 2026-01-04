// src/components/Login.jsx
import { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import "../styles/login.css";

export default function Login() {
  const { login, register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // 'login' o 'register'
  const [userType, setUserType] = useState("familia"); // familia, estudiante, empresa
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, userType);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error");
    }
  };

  return (
    <div className="login-container">
      <h2>{mode === "login" ? "Iniciar Sesión" : "Registro"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
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

        {mode === "register" && (
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="familia">Familia</option>
            <option value="estudiante">Estudiante</option>
            <option value="empresa">Empresa</option>
          </select>
        )}

        <button type="submit" className="btn-submit">
          {mode === "login" ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <button
        className="btn-toggle"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </div>
  );
}
