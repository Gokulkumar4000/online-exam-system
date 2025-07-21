import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import type { User, InsertUser } from '@shared/schema';

export async function registerUser(userData: InsertUser): Promise<User | null> {
  if (!db || !auth) {
    throw new Error('Firebase not initialized. Please check your configuration.');
  }
  
  try {
    console.log('Creating Firebase Auth user for:', userData.email);
    
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const firebaseUser = userCredential.user;
    
    console.log('Firebase Auth user created successfully:', firebaseUser.uid);
    
    // Create user profile in Firestore
    const user: User = {
      id: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      password: '', // Don't store password in Firestore since Firebase Auth handles it
      contactNo: userData.contactNo,
      createdAt: new Date(),
    };

    // Save user profile to Firestore
    console.log('Saving user profile to Firestore...');
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...user,
      createdAt: user.createdAt.toISOString(),
    });
    console.log('User profile saved successfully');

    // Initialize user scores
    console.log('Initializing user scores...');
    await setDoc(doc(db, 'userScores', firebaseUser.uid), {
      id: firebaseUser.uid,
      userId: firebaseUser.uid,
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
    console.log('User scores initialized successfully');

    return user;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  if (!db || !auth) {
    throw new Error('Firebase not initialized. Please check your configuration.');
  }

  try {
    console.log('Attempting to sign in user:', email);
    
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    console.log('Firebase Auth sign in successful:', firebaseUser.uid);
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    const user: User = {
      ...userData,
      createdAt: new Date(userData.createdAt),
    } as User;

    console.log('User profile loaded successfully');
    return user;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later');
    }
    
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!db || !auth) {
    return null;
  }

  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    const user: User = {
      ...userData,
      createdAt: new Date(userData.createdAt),
    } as User;

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase not initialized');
  }

  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}