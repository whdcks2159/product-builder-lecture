'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

interface UserProfile {
  uid: string;
  email: string;
  nickname: string;
  createdAt: unknown;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import Firebase only on client
    let unsub: (() => void) | undefined;
    (async () => {
      const { getFirebaseAuth, getFirebaseDb } = await import('@/lib/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');

      unsub = onAuthStateChanged(getFirebaseAuth(), async (u) => {
        setUser(u);
        if (u) {
          const snap = await getDoc(doc(getFirebaseDb(), 'users', u.uid));
          if (snap.exists()) setProfile(snap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    })();
    return () => { unsub?.(); };
  }, []);

  async function signup(email: string, password: string, nickname: string) {
    const { getFirebaseAuth, getFirebaseDb } = await import('@/lib/firebase');
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

    const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
    await updateProfile(cred.user, { displayName: nickname });
    const userDoc: UserProfile = { uid: cred.user.uid, email, nickname, createdAt: serverTimestamp() };
    await setDoc(doc(getFirebaseDb(), 'users', cred.user.uid), userDoc);
    setProfile(userDoc);
  }

  async function login(email: string, password: string) {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }

  async function logout() {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const { signOut } = await import('firebase/auth');
    await signOut(getFirebaseAuth());
  }

  async function resetPassword(email: string) {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(getFirebaseAuth(), email);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
