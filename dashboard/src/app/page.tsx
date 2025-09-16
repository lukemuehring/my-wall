"use client";
import UserProfile from "../components/auth/UserProfile";
import Dashboard from "../components/Dashboard/Dashboard";

export default function Home() {
  return (
    <div className="relative">
      <UserProfile />
      <Dashboard />
    </div>
  );
}
