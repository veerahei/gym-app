// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQf-ShhRdIn3HDY4GcNLznovsFE7IT8as",
    authDomain: "gymapp-9790e.firebaseapp.com",
    databaseURL: "https://gymapp-9790e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gymapp-9790e",
    storageBucket: "gymapp-9790e.firebasestorage.app",
    messagingSenderId: "1001063481083",
    appId: "1:1001063481083:web:1c1ae65bb7db3bfa927a5e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


