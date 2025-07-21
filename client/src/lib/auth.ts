import { db } from './firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs, Firestore } from 'firebase/firestore';
import type { User, InsertUser } from '@shared/schema';
import { userSchema } from '@shared/schema';

// Simple password hashing (in production, use bcrypt on backend)
function hashPassword(password: string): string {
  return btoa(password + 'salt'); // Base64 encoding for demo
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function registerUser(userData: InsertUser): Promise<User | null> {
  if (!db) {
    throw new Error('Firebase not initialized. Please provide configuration.');
  }
  
  try {
    // Check if user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userData.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('User with this email already exists');
    }

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hash password
    const hashedPassword = hashPassword(userData.password);
    
    const user: User = {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      contactNo: userData.contactNo,
      createdAt: new Date(),
    };

    // Save user to Firestore
    await setDoc(doc(db, 'users', userId), {
      ...user,
      createdAt: user.createdAt.toISOString(),
    });

    // Initialize user scores
    await setDoc(doc(db, 'userScores', userId), {
      id: userId,
      userId: userId,
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      scores: {
        webDevelopment: null,
        ai: null,
        dataScience: null,
      },
      lastUpdated: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  if (!db) {
    throw new Error('Firebase not initialized. Please provide configuration.');
  }
  
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Invalid email or password');
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    if (!verifyPassword(password, userData.password)) {
      throw new Error('Invalid email or password');
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      contactNo: userData.contactNo,
      createdAt: new Date(userData.createdAt),
    };

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = localStorage.getItem('userId');
  if (!userId || !db) return null;

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      localStorage.removeItem('userId');
      return null;
    }

    const userData = userDoc.data();
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      contactNo: userData.contactNo,
      createdAt: new Date(userData.createdAt),
    };
  } catch (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('userId');
    return null;
  }
}
