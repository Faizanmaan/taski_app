import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase for web
const app = initializeApp(firebaseConfig);


export const firebaseAuth = () => getAuth(app);
export const firebaseFirestore = () => getFirestore(app);

export default firebaseConfig;
