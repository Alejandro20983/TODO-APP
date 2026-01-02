import { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import "../styles/login.css";

function Login() {
  const { login, register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // 'login' o 'register'
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // Mensajes informativos

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
        setInfo("Registro exitoso. Ahora puedes iniciar sesión.");
        setMode("login"); // Cambia automáticamente a login tras registrarse
      }
    } catch (err) {
      console.error(err);
      // Manejo de errores más amigable
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("El correo ya está registrado. Por favor, inicia sesión.");
          setMode("login");
          break;
        case "auth/user-not-found":
          setError("Usuario no encontrado. Regístrate primero.");
          setMode("register");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta. Intenta de nuevo.");
          break;
        case "auth/invalid-email":
          setError("Correo inválido. Verifica tu email.");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;
        default:
          setError(err.message);
      }
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
        <div>
          <button type="submit" className="btn-submit">
            {mode === "login" ? "Ingresar" : "Registrar"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}
      </form>
      <button
        className="btn-toggle"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError("");
          setInfo("");
        }}
      >
        {mode === "login" ? "Crear cuenta" : "Volver a iniciar sesión"}
      </button>
    </div>
  );
}

export default Login;
