import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOUnSBHR8ImPtmkh3wC687aF4h9pOxfiQ",
  authDomain: "velvet-e4eca.firebaseapp.com",
  projectId: "velvet-e4eca",
  storageBucket: "velvet-e4eca.firebasestorage.app",
  messagingSenderId: "95320855283",
  appId: "1:95320855283:web:0a9d0845c7a2768a5a1d86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for better user experience
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;