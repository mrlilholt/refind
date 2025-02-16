// filepath: src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXzEjQ_XA982EWzp6uUil4nP_XmKggl30",
  authDomain: "re-find-bed8a.firebaseapp.com",
  projectId: "re-find-bed8a",
  storageBucket: "re-find-bed8a.firebasestorage.app",
  messagingSenderId: "114167544984",
  appId: "1:114167544984:web:b8b84e949ab18789c5a4ed",
  measurementId: "G-V7MYSMKXXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);  // Optional: only if you need analytics

// Export Firebase services for use in your components
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);