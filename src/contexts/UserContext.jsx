// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase.js";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar usuario al cargar la app
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Registro
  const register = async (email, password, type) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    const userId = data.user.id;

    // Crear registro en la tabla correspondiente según el tipo
    if (type === "familia") {
      await supabase.from("familia").insert([{ id: userId, email }]);
    } else if (type === "estudiante") {
      await supabase.from("estudiantes").insert([{ id: userId, email }]);
    } else if (type === "empresa") {
      await supabase.from("empresas").insert([{ id: userId, email }]);
    }

    setUser(data.user);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
