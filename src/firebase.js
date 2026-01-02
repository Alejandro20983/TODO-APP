// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY", // Reemplaza con tu API Key real
  authDomain: "my-todo-app-93631.firebaseapp.com",
  projectId: "my-todo-app-93631",
  storageBucket: "my-todo-app-93631.appspot.com",
  messagingSenderId: "473899860114",
  appId: "1:473899860114:web:4664ada31f4a412a10a64b",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
