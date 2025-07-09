"use client";
import Image from "next/image";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

const provider = new GoogleAuthProvider();

export default function Home() {
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Signed in as:", result.user.displayName);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        hello world
        <button onClick={handleSignIn} style={{ padding: "8px 16px" }}>
          Sign in with Google
        </button>
      </main>
    </div>
  );
}
