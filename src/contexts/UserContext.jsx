import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: currentUser.uid, email: currentUser.email, role: userDoc.data().role });
        } else {
          // Usuario logueado pero no existe en Firestore, creamos por defecto
          await setDoc(doc(db, "users", currentUser.uid), { role: "user" });
          setUser({ uid: currentUser.uid, email: currentUser.email, role: "user" });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const register = async (email, password, role = "user") => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), { role });
  };
  const logout = () => signOut(auth);

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
