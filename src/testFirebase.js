import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

async function testFirestoreConnection() {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    console.log("Conexión exitosa a Firestore!");
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error al conectar con Firestore:", error);
  }
}

testFirestoreConnection();
