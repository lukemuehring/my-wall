"use client";
import { useLiveNotes } from "@/hooks/useLiveNotes";
import { User } from "firebase/auth";
import NoteCard from "./NoteCard";
import { useState } from "react";
import { INote } from "@/types/Note";
import { createNote } from "@/lib/noteService";
import { v4 as uuid } from "uuid";
import { Button } from "@adobe/react-spectrum";

export default function Dashboard({ user }: { user: User | null }) {
  const liveNotes = useLiveNotes();
  const [localNotes, setLocalNotes] = useState<INote[]>([]);

  const handleCreateNote = async () => {
    if (!user) return;

    const newId = uuid();

    const newNote: INote = {
      _id: newId,
      title: "Untitled",
      content: "",
      position: { x: 100, y: 100, z: 1 },
      authorId: user.uid,
      boardId: "1", // todo implement boards
      createdAt: Date.now().toString(),
    };

    // 1. Show it immediately
    setLocalNotes((prev) => [...prev, newNote]);

    // 2. Save to server (background)
    try {
      await createNote(newNote);
    } catch (err) {
      console.error("Failed to save new note:", err);
      // optional: mark as unsynced, retry, or show error to user
    }
  };

  // Filter out duplicates (e.g. from liveNotes after sync)
  const allNotes = [
    ...localNotes.filter(
      (local) => !liveNotes.some((live) => live._id === local._id)
    ),
    ...liveNotes,
  ];

  return (
    <div className="relative w-full h-full bg-pink-50">
      <div className="flex align-center justify-center">
        <h2 className="text-6xl text-black">Dashboard</h2>
        <Button variant="accent" onPress={handleCreateNote}>
          Create Note
        </Button>
      </div>

      <div className="mt-10 p-6">
        {allNotes.length === 0 && <p>No notes found.</p>}
        {allNotes.map((note) => (
          <NoteCard note={note} key={note._id}></NoteCard>
        ))}
      </div>
    </div>
  );
}
