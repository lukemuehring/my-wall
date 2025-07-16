"use client";
import { INote } from "@/types/Note";
import { motion } from "framer-motion";

function NoteCard({ note }: { note: INote }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      className="w-48 h-48 bg-yellow-100 text-black rounded p-4 shadow"
    >
      <h3 className="text-xl font-semibold">{note.title}</h3>
      <p>{note.content}</p>
    </motion.div>
  );
}

export default NoteCard;
