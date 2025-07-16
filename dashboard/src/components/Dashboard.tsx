"use client";
import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import NoteCard from "./NoteCard";

export default function Dashboard({ user }: { user: User | null }) {
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    // GROQ query to fetch all notes
    const query = `*[_type == "note"]{
      _id,
      title,
      content,
      position
    }`;

    sanityClient.fetch(query).then(setNotes).catch(console.error);
  }, []);

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
