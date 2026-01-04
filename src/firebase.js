import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqR7yJ3n89ze4swyoanIZ8stK83wOeqhc",
  authDomain: "my-todo-app-93631.firebaseapp.com",
  projectId: "my-todo-app-93631",
  storageBucket: "my-todo-app-93631.firebasestorage.app",
  messagingSenderId: "473899860114",
  appId: "1:473899860114:web:4664ada31f4a412a10a64b",
  measurementId: "G-MNNZSW3904"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
