// src/components/Register.jsx
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import "../styles/login.css";

export default function Register() {
  const { register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("familia");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = await register(email, password, role);
    if (err) setError(err.message);
  };

  return (
    <div className="login-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="familia">Familiar</option>
          <option value="estudiante">Estudiante</option>
          <option value="empresa">Empresa</option>
        </select>
        <button type="submit" className="btn-submit">Registrarse</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
