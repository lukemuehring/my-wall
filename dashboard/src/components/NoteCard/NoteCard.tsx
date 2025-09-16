"use client";
import { updateNote } from "@/lib/noteService";
import { INote } from "@/types/Note";
import { ActionButton } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { TextArea } from "@adobe/react-spectrum";

// Simple deep comparison fallback
const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

function NoteCard({
  note,
  onCreate,
  onDelete,
}: {
  note: INote;
  onCreate: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [inputRegistered, setInputRegistered] = useState<boolean>(false);
  const [updatedNote, setUpdatedNote] = useState(note);
  const [debouncedNote, setDebouncedNote] = useState(note);

  // Create note if input for the first time and no author id.
  useEffect(() => {
    if (inputRegistered && !note.authorId) {
      onCreate();
    }
  }, [inputRegistered]);

  // Updates to fields -> set updatedNote
  const setField = (field: keyof INote, value: any) => {
    if (!inputRegistered) {
      setInputRegistered(true);
    }

    setUpdatedNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // updatedNote debouncer effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedNote(updatedNote);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [updatedNote]);
  // debounced note API call effect
  useEffect(() => {
    if (!isEqual(debouncedNote, note) && debouncedNote._id) {
      console.log("updating from NoteCard", debouncedNote, note);

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
      className="relative flex flex-col text-black cursor-move rounded p-8 shadow"
    >
      <div className="absolute top-2 right-2">
        <ActionButton
          aria-label="Delete Note"
          isQuiet={true}
          onPress={onDelete}
        >
          <Delete />
        </ActionButton>
      </div>
      {note._id}
      {/* TITLE */}
      {/* <TextArea´
        // className="text-xl font-semibold w-full bg-yellow-200 mb-2 resize-none focus:outline-none"
        value={updatedNote.title}
        aria-label="enter the title of your note"
        onChange={(value) => setField("title", value)}
      /> */}
      {/* CONTENT TEXTAREA */}
      <TextArea
        autoFocus
        value={updatedNote.content}
        onChange={(value) => setField("content", value)}
        aria-label="enter what's on your mind"
        width={650}
        UNSAFE_className="journal-textarea"
      />
    </motion.div>
  );
}

export default memo(NoteCard, (prevProps: any, nextProps: any) => {
  // Re-render only if the note actually changes
  return isEqual(prevProps.note, nextProps.note);
});
