// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase.js";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión actual
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Registro con rol y tabla específica
  const registerWithRole = async (email, password, role, extraData) => {
    // 1. Crear usuario en Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;

    const auth_id = signUpData.user.id;

    // 2. Crear perfil general
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([{ auth_id, role }])
      .select()
      .single();
    if (profileError) throw profileError;

    const profile_id = profileData.id;

    // 3. Insertar datos específicos según rol
    if (role === "familia") {
      await supabase.from("familias").insert([{ profile_id, ...extraData }]);
    } else if (role === "estudiante") {
      await supabase.from("estudiantes").insert([{ profile_id, ...extraData }]);
    } else if (role === "empresa") {
      await supabase.from("empresas").insert([{ profile_id, ...extraData }]);
    }

    return signUpData.user;
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, registerWithRole }}>
      {children}
    </UserContext.Provider>
  );
};
