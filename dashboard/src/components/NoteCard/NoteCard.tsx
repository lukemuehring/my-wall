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

  // CREATE
  useEffect(() => {
    if (!note.authorId && noteTouched) {
      onCreate(note);
      console.log("create for note", note, noteTouched);
    }
  }, [noteTouched]);

  // #region UPDATE
  const setField = (field: keyof INote, value: any) => {
    if (!noteTouched) {
      setNoteTouched(true);
    }

    if (note.authorId) {
      setUpdatedNote((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  // debounce updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedUpdatedNote(updatedNote);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [updatedNote]);
  // Call Update note callback
  useEffect(() => {
    if (!isEqual(debouncedUpdatedNote, note)) {
      console.log("NoteCard UPDATE", debouncedUpdatedNote);
      onUpdate(debouncedUpdatedNote);
    }
  }, [debouncedUpdatedNote]);
  // #endregion UPDATE

  return (
    <motion.div
      key={note._id}
      drag
      whileDrag={{
        scale: 1.01,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      }}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setField("position", {
          x: note.position.x + info.offset.x,
          y: note.position.y + info.offset.y,
        });
      }}
      style={{
        x: updatedNote.position.x,
        y: updatedNote.position.y,
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
      <div className="mt-4">
        <div>Updated Note position:</div>({updatedNote.position.x},{" "}
        {updatedNote.position.y})
      </div>
      <div className="mt-4">
        <div> Note position:</div>({note.position.x}, {note.position.y})
      </div>
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
