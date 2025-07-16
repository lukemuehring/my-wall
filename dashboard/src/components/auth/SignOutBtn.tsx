"use client";

import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

export default function SignOutBtn() {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <button onClick={handleSignOut} className="p-4 bg-amber-50">
      Sign Out
    </button>
  );
}
