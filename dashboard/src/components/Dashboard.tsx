"use client";
import { User } from "firebase/auth";

export default function Dashboard({ user }: { user: User | null }) {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
