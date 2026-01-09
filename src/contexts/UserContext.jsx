import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { message: "Email o contraseña incorrectos." };
    }

    setUser(data.session.user);
    return null;
  };

  const register = async ({ email, password, role, name, extra }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { message: error.message };
    if (!data.user) return { message: "No se pudo crear el usuario." };

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      role,
      name,
      extra,
    });

    if (profileError) return { message: profileError.message };

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
