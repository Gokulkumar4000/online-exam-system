import { initializeApp } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only initialize Firebase if we have the required config
let app;
let db;
let auth;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Enable offline persistence
    enableNetwork(db).catch((error) => {
      console.warn('Firebase network enable failed:', error);
    });
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase configuration missing. Please provide environment variables.');
}

export { db, auth };
