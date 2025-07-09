"use client";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "../../../firebase";
import SignOutBtn from "./SignOutBtn";

const provider = new GoogleAuthProvider();

export default function UserProfile({ user }: { user: User | null }) {
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Signed in as:", result.user.displayName);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (user) {
    return (
      <div>
        <p>Welcome, {user.displayName}</p>
        <SignOutBtn></SignOutBtn>
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={handleSignIn} style={{ padding: "8px 16px" }}>
          Sign in with Google
        </button>
      </div>
    );
  }
}
