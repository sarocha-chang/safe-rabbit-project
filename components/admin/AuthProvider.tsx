"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase-auth";

export type AdminRole = "owner" | "demo";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  role: AdminRole | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  isAdmin: false,
  role: null,
  loading: true,
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(logoutTimer);
      setLoading(true);

      if (currentUser) {
        const token = await currentUser.getIdTokenResult();
        const expiresAt =
          new Date(token.authTime).getTime() + SESSION_DURATION_MS;
        const remaining = expiresAt - Date.now();

        if (remaining <= 0) {
          await signOut(auth);
          return;
        }

        logoutTimer = setTimeout(() => signOut(auth), remaining);
      }

      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, "admins", currentUser.uid));
        setIsAdmin(adminDoc.exists());
        setRole(adminDoc.exists() ? (adminDoc.data().role ?? null) : null);
      } catch {
        setIsAdmin(false);
        setRole(null);
      }

      setLoading(false);
    });

    return () => {
      clearTimeout(logoutTimer);
      unsubscribe();
    };
  }, []);

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
