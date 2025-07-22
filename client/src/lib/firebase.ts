import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, enableNetwork, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK8zkDOT2G27AhyhJ9--418GSgfBtDUZo",
  authDomain: "gncipl-week-2-a8c06.firebaseapp.com",
  projectId: "gncipl-week-2-a8c06",
  storageBucket: "gncipl-week-2-a8c06.firebasestorage.app",
  messagingSenderId: "1082103193809",
  appId: "1:1082103193809:web:b31b250d0b463e0911e5f0",
  measurementId: "G-ERXSNLNLFS"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | undefined;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Initialize Analytics only if supported (not in server environments)
  isSupported().then((supported) => {
    if (supported && app) {
      analytics = getAnalytics(app);
    }
  });
  
  // Enable offline persistence
  enableNetwork(db).catch((error) => {
    console.warn('Firebase network enable failed:', error);
  });
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { db, auth, analytics };
