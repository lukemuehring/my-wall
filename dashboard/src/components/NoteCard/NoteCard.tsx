"use client";
import { isEqual } from "@/lib/constants";
import { INote } from "@/types/Note";
import { ActionButton, TextArea } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";

function NoteCard({
  note,
  onCreate,
  onUpdate,
  onDelete,
}: {
  note: INote;
  onCreate: (noteToCreate: INote) => Promise<void>;
  onUpdate: (noteToUpdate: INote) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [noteTouched, setNoteTouched] = useState<boolean>(false);
  const [updatedNote, setUpdatedNote] = useState(note);
  const [debouncedUpdatedNote, setDebouncedUpdatedNote] = useState(note);

  // Call Create note callback, if touched for first time and no author id.
  useEffect(() => {
    if (!note.authorId && noteTouched) {
      onCreate(note);
      console.log("create for note", note, noteTouched);
    }
  }, [noteTouched]);

  // Updates to fields -> set updatedNote
  const setField = (field: keyof INote, value: any) => {
    if (!noteTouched) {
      setNoteTouched(true);
    }

    setUpdatedNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Debounce set updatedNote calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedUpdatedNote(updatedNote);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [updatedNote]);

  // Call Update note callback
  useEffect(() => {
    if (!isEqual(debouncedUpdatedNote, note)) {
      console.log(
        "NoteCard: debounced update note and note are not equal, we call onupdate."
      );
      onUpdate(debouncedUpdatedNote);
    }
  }, [debouncedUpdatedNote]);

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
      className="relative flex flex-col w-fit text-black cursor-move rounded p-8 shadow"
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
      <div className="text-2xl font-semibold">{updatedNote.title}</div>
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
