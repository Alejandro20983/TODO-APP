import { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import "../styles/Login.css";

function Login() {
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
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>{mode === "login" ? "Iniciar Sesión" : "Registro"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.5rem", margin: "0.5rem" }}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.5rem", margin: "0.5rem" }}
          required
        />
        <div>
          <button type="submit" style={{ padding: "0.5rem 1rem", margin: "0.5rem" }}>
            {mode === "login" ? "Ingresar" : "Registrar"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ marginTop: "1rem" }}>
        {mode === "login" ? "Crear cuenta" : "Volver a iniciar sesión"}
      </button>
    </div>
  );
}

export default Login;
