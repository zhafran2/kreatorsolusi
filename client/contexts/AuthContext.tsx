import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'hrd';
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user data from database
        try {
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: data.name || '',
              role: data.role || 'employee',
              employeeId: data.employeeId || '',
            });
            await AsyncStorage.setItem('userData', JSON.stringify({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: data.name || '',
              role: data.role || 'employee',
              employeeId: data.employeeId || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
        await AsyncStorage.removeItem('userData');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful:', userCredential.user.uid);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Login gagal';
      
      // Parse Firebase error codes
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User tidak ditemukan. Pastikan email sudah terdaftar di Firebase.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password salah.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Koneksi internet bermasalah. Periksa koneksi Anda.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userData');
    } catch (error: any) {
      throw new Error(error.message || 'Logout gagal');
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
