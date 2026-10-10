/**
 * إعداد وربط منصة مستشارك القانوني مع Firebase
 * قاعدة بيانات Firestore والتخزين السحابي
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore (connecting to designated databaseId if present)
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
