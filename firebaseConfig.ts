import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();

// Експортуємо сервіси для використання в інших файлах
export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();
