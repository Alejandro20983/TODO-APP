import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";
import bcrypt from "bcryptjs"; // <-- Importamos bcrypt

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) return { message: "Email y contraseña son obligatorios." };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { message: "Email o contraseña incorrectos." };
    }

    setUser(data.session.user);
    return null;
  };

  const register = async ({ email, password, role, name, extra }) => {
    if (!email || !password || !role || !name) {
      return { message: "Todos los campos son obligatorios." };
    }

    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { emailRedirectTo: window.location.origin }
    );

    if (error) return { message: error.message };

    if (!data.user) return { message: "Debes confirmar tu correo para completar el registro." };

    // Crear hash de contraseña
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      role,
      name,
      extra,
      password_hash, // Guardamos el hash seguro
    });

    if (upsertError) return { message: upsertError.message };

    setUser(data.user);
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
