"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import UserProfile from "../components/auth/UserProfile";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <UserProfile user={user} />
      <Dashboard user={user} />
    </>
  );
}
