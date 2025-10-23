// Firebase Configuration
// Replace these placeholder values with your actual Firebase project configuration
// Get these values from Firebase Console > Project Settings > General > Your apps

import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCOUnSBHR8ImPtmkh3wC687aF4h9pOxfiQ",
  authDomain: "velvet-e4eca.firebaseapp.com",
  projectId: "velvet-e4eca",
  storageBucket: "velvet-e4eca.firebasestorage.app",
  messagingSenderId: "95320855283",
  appId: "1:95320855283:web:0a9d0845c7a2768a5a1d86",
  measurementId: "G-7E1MPVQ72B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only if measurementId is provided)
let analytics = null;
if (firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };

// Export Firebase functions for compatibility
    export {
    createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
    signOut,
    updateProfile
  } from 'firebase/auth';

export {
  addDoc, collection, deleteDoc, doc,
  getDoc, getDocs, limit, orderBy, query, setDoc,
  updateDoc, where
} from 'firebase/firestore';

export { getAuth, getFirestore, initializeApp };

export default app;