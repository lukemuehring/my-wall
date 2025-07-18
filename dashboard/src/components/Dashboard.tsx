"use client";
import { useLiveNotes } from "@/hooks/useLiveNotes";
import { User } from "firebase/auth";
import NoteCard from "./NoteCard";

export default function Dashboard({ user }: { user: User | null }) {
  const notes = useLiveNotes();

  return (
    <div className="relative w-full h-full bg-pink-50">
      <div className="flex align-center justify-center">
        <h2 className="text-6xl text-black">Dashboard</h2>
      </div>

      <div className="mt-10 p-6">
        {notes.length === 0 && <p>No notes found.</p>}
        {notes.map((note) => (
          <NoteCard note={note} key={note._id}></NoteCard>
        ))}
      </div>
    </div>
  );
}
