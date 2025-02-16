// filepath: src/auth.js
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};