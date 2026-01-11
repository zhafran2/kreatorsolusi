import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration from environment variables
// Pastikan file .env sudah dibuat dan diisi dengan nilai yang sesuai
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log environment variables (hanya di development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Firebase Config Check:');
  console.log('API Key:', firebaseConfig.apiKey ? '✓ Ada' : '✗ Tidak ada');
  console.log('Project ID:', firebaseConfig.projectId ? '✓ Ada' : '✗ Tidak ada');
  console.log('Database URL:', firebaseConfig.databaseURL ? '✓ Ada' : '✗ Tidak ada');
}

// Validasi bahwa semua environment variables sudah diisi
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  const errorMsg = 'Firebase configuration tidak lengkap. Pastikan file .env sudah dibuat dan diisi dengan semua nilai yang diperlukan.';
  console.error('❌ Firebase Config Error:', errorMsg);
  console.error('Environment variables:', {
    apiKey: !!firebaseConfig.apiKey,
    projectId: !!firebaseConfig.projectId,
    databaseURL: !!firebaseConfig.databaseURL,
  });
  throw new Error(errorMsg);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
