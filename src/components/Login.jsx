// src/components/Login.jsx
import { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import "../styles/login.css";

export default function Login() {
  const { login, register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login o register
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{mode === "login" ? "Iniciar Sesión" : "Registro"}</h2>
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
        <button type="submit" className="btn-submit">
          {mode === "login" ? "Ingresar" : "Registrar"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="btn-toggle"
      >
        {mode === "login" ? "Crear cuenta" : "Volver a iniciar sesión"}
      </button>
    </div>
  );
}
