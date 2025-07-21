// Simple Firebase connection test
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBK8zkDOT2G27AhyhJ9--418GSgfBtDUZo",
  authDomain: "gncipl-week-2-a8c06.firebaseapp.com",
  projectId: "gncipl-week-2-a8c06",
  storageBucket: "gncipl-week-2-a8c06.firebasestorage.app",
  messagingSenderId: "1082103193809",
  appId: "1:1082103193809:web:b31b250d0b463e0911e5f0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      message: 'Firebase connection successful',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Firebase connection test successful!');
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
  }
}

testConnection();