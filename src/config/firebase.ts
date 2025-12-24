import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbrkIR2ESmgRbzfjSWkBehjEYOpCupAzU",
  authDomain: "taski-app-786.firebaseapp.com",
  projectId: "taski-app-786",
  storageBucket: "taski-app-786.firebasestorage.app",
  messagingSenderId: "25460966938",
  appId: "1:25460966938:web:03ac08e5def58602f173a3",
  measurementId: "G-GFBV9SVSWB"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with persistence
let auth;
try {
  if (typeof getReactNativePersistence === 'function') {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } else {
    auth = getAuth(app);
  }
} catch (e) {
  console.warn("Firebase Auth Persistence initialization failed:", e);
  auth = getAuth(app);
}

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '25460966938-m9v2v9n0b49ftsbmq453uvg65jpb135t.apps.googleusercontent.com', // Replace with your actual Web Client ID
  offlineAccess: true,
});

export const firebaseAuth = () => auth;
export const firebaseFirestore = () => getFirestore(app);
export const firebaseStorage = () => getStorage(app);
export { GoogleSignin };

export default firebaseConfig;
