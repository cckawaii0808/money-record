import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";

export const isMockMode = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 只有在非假資料模式且資料齊全時才初始化
const isConfigComplete = firebaseConfig.apiKey && firebaseConfig.projectId;

const app = (!isMockMode && isConfigComplete) ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

// Mock implementations for easy testing without errors
export const mockAuth = {
  onAuthStateChanged: (cb: any) => {
    cb({ uid: 'mock-user' });
    return () => {};
  },
  signInWithPopup: async () => ({ user: { uid: 'mock-user' } }),
  signOut: async () => {},
  currentUser: { uid: 'mock-user' }
};

// Re-export Firebase Auth functions for use in composables
export { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

if (!isMockMode && !isConfigComplete) {
  console.error("Firebase API Key or Project ID is missing. Please check your .env file.");
}
