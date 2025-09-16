"use client";
import UserIcon from "@spectrum-icons/workflow/User";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import { useUser } from "@/contexts/UserContext";

import { ActionButton, Item, Menu, MenuTrigger } from "@adobe/react-spectrum";

const provider = new GoogleAuthProvider();

export default function UserProfile() {
  const { user } = useUser();
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Signed in as:", result.user.displayName);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
    <div className="fixed top-4 right-4 z-100 w-[42px] h-[42px] flex items-center justify-center">
      <MenuTrigger>
        <ActionButton>
          <UserIcon />
        </ActionButton>
        <Menu
          onAction={(key) => {
            switch (key) {
              case "signout":
                handleSignOut();
                break;
              case "signin":
                handleSignIn();
                break;
              default:
                break;
            }
          }}
        >
          {user ? (
            <Item key="signout">Sign Out</Item>
          ) : (
            <Item key="signin">Sign in with Google</Item>
          )}
        </Menu>
      </MenuTrigger>
    </div>
  );
}
