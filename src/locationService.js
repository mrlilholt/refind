// filepath: src/locationService.js
import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const locationsCollection = collection(db, "locations");

export const addLocation = async (locationData) => {
  try {
    const docRef = await addDoc(locationsCollection, locationData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding location:", error);
    throw error;
  }
};

export const getUserLocations = async (userId) => {
  try {
    const q = query(locationsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};