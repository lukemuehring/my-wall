"use client";
import { updateNote } from "@/lib/noteService";
import { INote } from "@/types/Note";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function NoteCard({ note }: { note: INote }) {
  const [content, setContent] = useState(note.content);
  const [debouncedContent, setDebouncedContent] = useState(note.content);

  // Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedContent(content);
    }, 500);

    return () => clearTimeout(timeout);
  }, [content]);

  // Update
  useEffect(() => {
    if (debouncedContent !== note.content) {
      if (note._id) {
        updateNote(note._id, { content: debouncedContent });
      }
    }
  }, [debouncedContent]);

  return (
    <motion.div
      key={note._id}
      drag
      dragMomentum={false}
      style={{
        x: note.position?.x ?? 0,
        y: note.position?.y ?? 0,
      }}
      className="w-48 bg-yellow-100 text-black cursor-move rounded p-4 shadow"
    >
      <h3 className="text-xl font-semibold">{note.title}</h3>

      <textarea
        className="w-full h-40 p-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </motion.div>
  );
}

export default NoteCard;
