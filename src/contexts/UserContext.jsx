import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import bcrypt from "bcryptjs";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);

      if (session?.user) {
        // Verifica roles al iniciar la sesión
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          await checkRoles(session.user.id, profileData.role);
        }
      }
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const checkRoles = async (userId, roleType) => {
    const { data: rolesData } = await supabase
      .from("roles")
      .select("*")
      .eq("user_id", userId);

    if (!rolesData || rolesData.length === 0) {
      // Redirigir a Roles si no hay roles
      navigate(`/roles?type=${roleType}`);
    } else {
      navigate("/dashboard");
    }
  };

  const login = async ({ email, password }) => {
    if (!email || !password) return { message: "Email y contraseña son obligatorios." };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { message: "Email o contraseña incorrectos." };

    setUser(data.session.user);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.session.user.id)
      .single();

    if (profileError || !profileData) return { message: "Error al obtener perfil del usuario." };

    await checkRoles(data.session.user.id, profileData.role);

    return null;
  };

  const register = async ({ email, password, role, name, extra }) => {
    if (!email || !password || !role || !name) return { message: "Todos los campos son obligatorios." };

    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { emailRedirectTo: window.location.origin }
    );

    if (error) return { message: error.message };
    if (!data.user) return { message: "Debes confirmar tu correo para completar el registro." };

    const password_hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      role,
      name,
      extra,
      password_hash,
    });

    if (upsertError) return { message: upsertError.message };

    setUser(data.user);

    // Redirigir a Roles directamente al registrar
    navigate(`/roles?type=${role}`);

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
