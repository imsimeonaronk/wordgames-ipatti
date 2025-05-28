// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCtlApQuDrrnqg53pn6oQN97t7BT9oFe_4",
    authDomain: "katral-ipatti-23cb0.firebaseapp.com",
    projectId: "katral-ipatti-23cb0",
    storageBucket: "katral-ipatti-23cb0.firebasestorage.app",
    messagingSenderId: "1010859957138",
    appId: "1:1010859957138:web:c6ffb5adfc2bc27874bf4b",
    measurementId: "G-RQD8BKVLSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);