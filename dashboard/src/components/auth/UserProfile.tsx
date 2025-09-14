"use client";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "../../../firebase";
import SignOutBtn from "./SignOutBtn";
import UserIcon from "@spectrum-icons/workflow/User";
import { useState } from "react";
import {
  ActionButton,
  Button,
  Item,
  Menu,
  MenuTrigger,
} from "@adobe/react-spectrum";

const provider = new GoogleAuthProvider();

export default function UserProfile({ user }: { user: User | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="fixed top-4 right-4 z-100 w-[42px] h-[42px] flex items-center justify-center">
      <MenuTrigger>
        <ActionButton>
          <UserIcon />
        </ActionButton>
        <Menu onAction={(key) => alert(key)}>
          <Item key="cut">Cut</Item>
          <Item key="copy">Copy</Item>
          <Item key="paste">Paste</Item>
          <Item key="replace">Replace</Item>
        </Menu>
      </MenuTrigger>
      {menuOpen && (
        <div className="absolute top-0 right-0">
          {user ? (
            <div>
              <p>Welcome, {user.displayName}</p>
              <SignOutBtn />
            </div>
          ) : (
            <div>
              <button onClick={handleSignIn} style={{ padding: "8px 16px" }}>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
