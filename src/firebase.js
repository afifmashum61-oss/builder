import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase dari project builder-386e1
const firebaseConfig = {
  apiKey: "AIzaSyB-o2XkhkcybfcW-jY3wB353ZuTB0pXoUY",
  authDomain: "builder-386e1.firebaseapp.com",
  projectId: "builder-386e1",
  storageBucket: "builder-386e1.firebasestorage.app",
  messagingSenderId: "105289752387",
  appId: "1:105289752387:web:918427e1847c3bb51559f6"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Cloud Firestore Database
export const db = getFirestore(app);

export default app;
