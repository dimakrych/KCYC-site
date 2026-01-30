import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Ваші реальні дані з консолі Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5kP-GtujwXoEtT5oqXwAsPSV7DOKuHgI",
  authDomain: "kcyc-site.firebaseapp.com",
  projectId: "kcyc-site",
  storageBucket: "kcyc-site.firebasestorage.app",
  messagingSenderId: "290863961590",
  appId: "1:290863961590:web:cea1942d8d03bc84e263d7",
  measurementId: "G-0Q3R03CYK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);