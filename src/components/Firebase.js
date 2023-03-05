// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3cMxyX-lnEpt66TmWBZ9UU8mZUJQdOrU",
  authDomain: "edelweiss-2599a.firebaseapp.com",
  databaseURL: "https://edelweiss-2599a-default-rtdb.firebaseio.com",
  projectId: "edelweiss-2599a",
  storageBucket: "edelweiss-2599a.appspot.com",
  messagingSenderId: "378896901264",
  appId: "1:378896901264:web:31510b8f6354c281e66415",
  measurementId: "G-PVL9KK9E7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export default db;