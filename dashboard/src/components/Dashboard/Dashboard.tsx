"use client";
import { useServerNotes } from "@/hooks/useServerNotes";
import { BASE_NOTE } from "@/lib/constants";
import { createNoteWithUser, deleteNote } from "@/lib/noteService";
import { INote } from "@/types/Note";
import { useEffect, useState } from "react";
import NoteCard from "../NoteCard/NoteCard";
import "./Dashboard.css";

export default function Dashboard() {
  const serverNotes = useServerNotes();
  const [localNotes, setLocalNotes] = useState<INote[]>([]);
  const [deletedNoteIds, setDeletedNoteIds] = useState<Set<string>>(new Set());

  // Set initial state directly to BASE_NOTE with initial position
  const [baseNote, setBaseNote] = useState<ReturnType<typeof BASE_NOTE> | null>(
    null
  );

  // Initialize base note on client side only to avoid hydration mismatch
  useEffect(() => {
    if (!baseNote) {
      setBaseNote(BASE_NOTE({ x: 100, y: 100, z: 1 }));
    }
  }, [baseNote]);

  // Creates the note, and replaces the base note in place with authorId
  const handleCreateNote = async (newNote: INote) => {
    // Save to server
    try {
      // optimistic add to local notes
      setLocalNotes((prev) => [...prev, newNote]);

      // Persist
      const createdNote: INote = await createNoteWithUser(newNote);

      // Remove the old note and add the new one with server-generated ID
      setLocalNotes((prev) => {
        // Remove the original note (with old ID)
        const filtered = prev.filter((n) => n._id !== newNote._id);
        // Add the new note with server-generated ID
        return [...filtered, createdNote];
      });
    } catch (err) {
      console.error("Failed to save new note:", err);

      // Remove the optimistic note on failure
      setLocalNotes((prev) => prev.filter((n) => n._id !== newNote._id));

      // Retry once after one second delay
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const retryNote = await createNoteWithUser(newNote);
        setLocalNotes((prev) => [...prev, retryNote]);
      } catch (retryErr) {
        console.error("Retry failed to save new note:", retryErr);
        alert("Failed to save new note. Please try again later.");
      }
    }
  };

  // Delete
  const handleDeleteNote = async (noteId: string) => {
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

  // Clean up localNotes when serverNotes are updated (for updates)
  useEffect(() => {
    setLocalNotes((prev) => {
      // Remove any local notes that now exist in serverNotes
      // But only if they have the same content (indicating the update was successful)
      return prev.filter((local) => {
        const serverNote = serverNotes.find(
          (server) => server._id === local._id
        );
        if (!serverNote) return true; // Keep if not found in server

        // Remove if server has the same or newer content
        // This prevents duplicates while preserving optimistic updates
        return false;
      });
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
  // Priority: serverNotes > localNotes (server is source of truth)
  const allNotes = [
    ...serverNotes.filter((note) => note._id && !deletedNoteIds.has(note._id)),
    ...localNotes.filter(
      (local) =>
        local._id &&
        !serverNotes.some((server) => server._id === local._id) &&
        !deletedNoteIds.has(local._id)
    ),
    ...(baseNote ? [baseNote] : []),
  ];

  console.log("localNotes", localNotes);
  console.log("serverNotes", serverNotes);
  console.log("allNotes", allNotes);

  const baseNoteCreated: boolean = !!baseNote?.authorId;

  return (
    <div className="dashboard-canvas">
      {/* Centered header */}
      <div className="flex justify-center py-8">
        <h2 className="text-6xl text-black">What's on your mind?</h2>
      </div>

      {/* Note container that starts in normal flow but can expand infinitely */}
      <div className="note-container">
        {/* all notes */}
        {allNotes.length === 0 && (
          <div className="flex justify-center py-8">
            <p className="text-xl text-gray-500">No notes found.</p>
          </div>
        )}
        {allNotes.map((note) => (
          <NoteCard
            note={note}
            key={note._id}
            onCreate={() => handleCreateNote(note)}
            onDelete={() => handleDeleteNote(note._id)}
          ></NoteCard>
        ))}
      </div>
    </div>
  );
}
