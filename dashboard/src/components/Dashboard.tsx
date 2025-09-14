"use client";
import { useServerNotes } from "@/hooks/useServerNotes";
import { User } from "firebase/auth";
import NoteCard from "./NoteCard";
import { useState, useEffect } from "react";
import { INote } from "@/types/Note";
import { createNote, deleteNote } from "@/lib/noteService";
import { v4 as uuid } from "uuid";
import { Button } from "@adobe/react-spectrum";

export default function Dashboard({ user }: { user: User | null }) {
  const serverNotes = useServerNotes();
  const [localNotes, setLocalNotes] = useState<INote[]>([]);
  const [deletedNoteIds, setDeletedNoteIds] = useState<Set<string>>(new Set());

  const handleCreateNote = async () => {
    if (!user) return;

    const newId = uuid();

    const newNote: INote = {
      _id: newId,
      title: "Untitled",
      content: "",
      position: { x: 100, y: 100, z: 1 },
      authorId: user.uid,
      boardId: "1", // TODO BOARDS
      createdAt: Date.now().toString(),
    };

    // 1. Show it immediately
    setLocalNotes((prev) => [...prev, newNote]);

    // 2. Save to server (background)
    try {
      await createNote(newNote);
    } catch (err) {
      console.error("Failed to save new note:", err);
      // Revert local create
      setLocalNotes((prev) => prev.filter((note) => note._id !== newNote._id));
    }
  };

  // Delete
  const handleDeleteNote = async (noteId: string | undefined) => {
    if (!noteId) {
      return;
    }
    const noteToDelete = localNotes.find((note) => note._id === noteId);

    // Remove immediately from localNotes and mark as deleted
    setLocalNotes((prev) => prev.filter((note) => note._id !== noteId));
    setDeletedNoteIds((prev) => new Set(prev).add(noteId));

    try {
      await deleteNote(noteId);
    } catch (err) {
      console.error("Failed to delete note:", err);
      // Revert local delete
      if (noteToDelete) {
        setLocalNotes((prev) => [...prev, noteToDelete]);
        setDeletedNoteIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(noteId);
          return newSet;
        });
      }
    }
  };

  // Clean up deleted note IDs when server confirms deletion
  useEffect(() => {
    setDeletedNoteIds((prev) => {
      const newSet = new Set(prev);
      // Remove IDs that are no longer in serverNotes (confirmed deleted)
      prev.forEach((deletedId) => {
        if (!serverNotes.some((note) => note._id === deletedId)) {
          newSet.delete(deletedId);
        }
      });
      return newSet;
    });
  }, [serverNotes]);

  /**
   * The Flow:
   * Delete clicked → Note disappears immediately (optimistic)
   * Server processes delete → May take time
   * Subscription fires → Might return stale data initially
   * Stale data filtered out → Note stays hidden
   * Server confirms deletion → Note removed from serverNotes
   * Cleanup effect runs → deletedNoteIds cleaned up
  console.log("localNotes", localNotes);
  console.log("serverNotes", serverNotes);
  console.log("deletedNoteIds", deletedNoteIds);
   *
   * 
   */

  // Filter out duplicates and deleted notes
  const allNotes = [
    ...localNotes.filter(
      (local) => !serverNotes.some((live) => live._id === local._id)
    ),
    ...serverNotes.filter((note) => note._id && !deletedNoteIds.has(note._id)),
  ];

  return (
    <div className="relative w-full h-full bg-pink-50">
      <div className="flex align-center justify-center">
        <h2 className="text-6xl text-black">What's on your mind?</h2>
        <Button variant="accent" onPress={handleCreateNote}>
          Create Note
        </Button>
      </div>

      <div className="mt-10 p-6">
        {allNotes.length === 0 && <p>No notes found.</p>}
        {allNotes.map((note) => (
          <NoteCard
            note={note}
            key={note._id}
            onDelete={() => handleDeleteNote(note._id)}
          ></NoteCard>
        ))}
      </div>
    </div>
  );
}
