import { useState } from "react";
import {auth, db} from "./firebase.js";
import {createUserWithEmailAndPasword} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";

function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState ("estudiante");// Estado especifico para el rol
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPasword(auth, email, password);
            const user = userCredential.user;

            //Guardamos los roles y email en firestone
            await setDoc(doc(db, "users", user.uid),{email, role});
            console.log("Usuario registrado con rol:", role);
        }catch(err){
            setError("Error al registrar al usuario: " + err.message);
        }
    };
    return(
        <form onSubmit={handleSubmit} style={{textAlign:"center", marginTop:"2rem"}}>
            <h2>Registro</h2>
            <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{padding:"0.5rem",margin:"0.5rem"}}/>

            <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{padding:"0.5rem", margin:"0.5rem"}}/>
            <select 
            value={role} onChange={(e) => setRole(e.target.value)} 
            style={{padding:"0.5rem", margin:"0.5rem"}}>
                <option value="Familiar">Familiar</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Empresa">Empresa</option>
            </select>
            <br/>
            <button type="submit" 
            style={{padding:"0.5rem 1rem", margin:"0.5rem"}}>Registrar</button>
            {error && <p style={{color:"red"}}>{error}</p>}
        </form>
    );
}

export default Register;