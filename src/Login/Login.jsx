import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUser({ uid: user.uid, email: user.email, role: userDoc.data().role });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: "0.5rem", margin: "0.5rem" }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: "0.5rem", margin: "0.5rem" }}
      />
      <br />
      <button type="submit" style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>Ingresar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default Login;
