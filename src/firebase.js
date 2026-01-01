// Importar funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyAqR7yJ3n89ze4swyoanIZ8stK83wOeqhc",
  authDomain: "my-todo-app-93631.firebaseapp.com",
  projectId: "my-todo-app-93631",
  storageBucket: "my-todo-app-93631.firebasestorage.app",
  messagingSenderId: "473899860114",
  appId: "1:473899860114:web:4664ada31f4a412a10a64b",
  measurementId: "G-MNNZSW3904"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar servicios para usar en tu app
export const auth = getAuth(app);      // Para login / registro
export const db = getFirestore(app);   // Para base de datos Firestore
export default app;
