"use client";
import { updateNote } from "@/lib/noteService";
import { INote } from "@/types/Note";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Simple deep comparison fallback
const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

function NoteCard({ note }: { note: INote }) {
  const [updatedNote, setUpdatedNote] = useState(note);
  const [debouncedNote, setDebouncedNote] = useState(note);

  // Update a field in the note
  const setField = (field: keyof INote, value: any) => {
    setUpdatedNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Debounce the updated note object
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedNote(updatedNote);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [updatedNote]);

  // Update the note if it changed
  useEffect(() => {
    if (!isEqual(debouncedNote, note) && debouncedNote._id) {
      updateNote(debouncedNote._id, debouncedNote);
    }
  }, [debouncedNote]);

  return (
    <motion.div
      key={note._id}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setField("position", { x: info.point.x, y: info.point.y });
      }}
      style={{
        x: updatedNote.position?.x ?? 0,
        y: updatedNote.position?.y ?? 0,
      }}
      className="w-48 bg-yellow-100 text-black cursor-move rounded p-4 shadow"
    >
      <textarea
        className="text-xl font-semibold w-full bg-yellow-200 mb-2 resize-none focus:outline-none"
        value={updatedNote.title}
        onChange={(e) => setField("title", e.target.value)}
      />
      <textarea
        className="w-full h-40 p-2 bg-yellow-200 border rounded resize-none"
        value={updatedNote.content}
        onChange={(e) => setField("content", e.target.value)}
      />
    </motion.div>
  );
}

export default NoteCard;
