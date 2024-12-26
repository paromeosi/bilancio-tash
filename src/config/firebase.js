import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB8Nz1eHJgrPq9EyryfEMDv1SypOLOlkdw",
  authDomain: "bilancio-cfc1d.firebaseapp.com",
  projectId: "bilancio-cfc1d",
  storageBucket: "bilancio-cfc1d.firebasestorage.app",
  messagingSenderId: "997048353108",
  appId: "1:997048353108:web:ae40a2ff06b2b208f0c8c1",
  measurementId: "G-GEWCNRP6CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;