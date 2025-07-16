"use client";
import { INote } from "@/types/Note";
import { motion } from "framer-motion";

function NoteCard({ note }: { note: INote }) {
  return (
    <motion.div
      key={note._id}
      drag
      dragMomentum={false}
      style={{
        x: note.position?.x ?? 0,
        y: note.position?.y ?? 0,
      }}
      className="w-48 h-48 bg-yellow-100 text-black rounded p-4 shadow"
    >
      <h3 className="text-xl font-semibold">{note.title}</h3>
      <p>{note.content}</p>
    </motion.div>
  );
}

export default NoteCard;
