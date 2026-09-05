import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface UserData {
  email: string;
  name: string;
  role: "admin" | "member";
  houseId: string;
  gender: "male" | "female" | "none";
  characterClass: "warrior" | "archer" | "knight" | "mage" | "none";
  createdAt: unknown;
  updatedAt: unknown;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: (uid?: string) => Promise<UserData | null>;
}

const ADMIN_EMAILS = new Set([
  "aryanraiavengers@gmail.com",
  "harsh@codeblooded.com",
  "ishant@codeblooded.com",
  "suraj@codeblooded.com",
  "mridul@codeblooded.com",
]);

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUserData = async (uid?: string) => {
    const userId = uid || user?.uid;
    if (!userId) return null;

    const snapshot = await getDoc(doc(db, "users", userId));
    const data = snapshot.exists() ? (snapshot.data() as UserData) : null;
    setUserData(data);
    return data;
  };

  const ensureProfile = async (firebaseUser: User) => {
    const profileRef = doc(db, "users", firebaseUser.uid);
    const snapshot = await getDoc(profileRef);

    if (snapshot.exists()) {
      return snapshot.data() as UserData;
    }

    const role: UserData["role"] = ADMIN_EMAILS.has((firebaseUser.email || "").toLowerCase())
      ? "admin"
      : "member";

    const profile = {
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "Unnamed Member",
      role,
      houseId: "",
      gender: "none" as const,
      characterClass: "none" as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(profileRef, profile);
    return profile as UserData;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);
      setUser(firebaseUser);

      try {
        if (firebaseUser) {
          const data = await refreshUserData(firebaseUser.uid);
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (authError) {
        console.error("Failed to load CodeBlooded profile:", authError);
        setError("We could not load your realm profile. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const profile = await ensureProfile(result.user);
      setUser(result.user);
      setUserData(profile);
    } catch (authError) {
      console.error("Login failed:", authError);
      setError("Authentication failed. Please try again.");
      throw authError;
    }
  };

  const logout = async () => {
    setError(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, error, login, logout, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
