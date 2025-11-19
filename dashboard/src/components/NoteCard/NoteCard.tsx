"use client";
import { isEqual } from "@/lib/constants";
import { INote } from "@/types/Note";
import { ActionButton, Button, TextArea } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import "./Notecard.css";

function NoteCard({
  note,
  containerRef,
  onBringToFront,
  onCreate,
  onUpdate,
  onDelete,
  onSummarize,
}: {
  note: INote;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onBringToFront: () => number;
  onCreate: (noteToCreate: INote) => Promise<void>;
  onUpdate: (noteToUpdate: INote) => Promise<void>;
  onDelete: () => Promise<void> | void;
  onSummarize: (note: INote) => void;
}) {
  const [noteTouched, setNoteTouched] = useState<boolean>(false);
  const [updatedNote, setUpdatedNote] = useState(note);
  const [debouncedUpdatedNote, setDebouncedUpdatedNote] = useState(note);

  // CREATE
  // useEffect(() => {
  //   if (!note.authorId && noteTouched) {
  //     onCreate(note);
  //     console.log("create for note", note, noteTouched);
  //   }
  // }, [noteTouched]);

  // #region CREATE | UPDATE
  const setField = (field: keyof INote, value: any) => {
    if (!noteTouched) {
      setNoteTouched(true);
    }
    setUpdatedNote((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
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
      if (note.authorId) {
        console.log("NoteCard UPDATE", debouncedUpdatedNote);
        onUpdate(debouncedUpdatedNote);
      } else {
        console.log("NoteCard creating", debouncedUpdatedNote);
        onCreate(debouncedUpdatedNote);
      }
    }
  }, [debouncedUpdatedNote]);
  // #endregion UPDATE

  function handleDragStart() {
    const newMaxZIndex = onBringToFront();
    console.log("new max zindex", newMaxZIndex);
    setField("position", {
      x: updatedNote.position.x,
      y: updatedNote.position.y,
      z: newMaxZIndex,
    });
  }

  // update the position relative to container div
  function handleDragEnd(info: { point: { x: number; y: number } }) {
    let offsetX = 0;
    let offsetY = 0;
    if (containerRef && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      offsetX = rect.left;
      offsetY = rect.top;
    }
    setField("position", {
      x: info.point.x - offsetX,
      y: info.point.y - offsetY,
      z: updatedNote.position.z,
    });
  }

  return (
    <motion.div
      key={note._id}
      drag
      whileDrag={{
        scale: 1.01,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      }}
      dragMomentum={false}
      onMouseDown={() => handleDragStart()}
      onDragEnd={(_, info) => handleDragEnd(info)}
      style={{
        position: "absolute",
        left: updatedNote.position.x,
        top: updatedNote.position.y,
        zIndex: updatedNote.position.z,
      }}
      className="relative flex flex-col w-fit text-black cursor-move rounded p-8 shadow bg-white border-gray-300 border-[1px]"
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
      {/* METADATA */}
      {note._id}
      <div className="mt-4">
        <div>Updated Note position:</div>({updatedNote.position.x},{" "}
        {updatedNote.position.y}, {updatedNote.position.z})
      </div>
      <div className="mt-4">
        <div> Note position:</div>({note.position.x}, {note.position.y},{" "}
        {note.position.z})
      </div>

      {/* TITLE */}
      <TextArea
        value={updatedNote.title}
        defaultValue="Type the note title."
        aria-label="Type the note title."
        isQuiet={true}
        onChange={(value) => setField("title", value)}
        UNSAFE_className="journal-header"
      />
      {/* SUMMARY */}
      {updatedNote.summary && (
        <div className="w-[650px] mb-4">{updatedNote.summary}</div>
      )}
      {/* CONTENT TEXTAREA */}
      <TextArea
        autoFocus
        value={updatedNote.content}
        onChange={(value) => setField("content", value)}
        aria-label="Type what's on your mind."
        width={650}
        UNSAFE_className="journal-textarea"
      />
      <div className="ai-buttons">
        {updatedNote.content && (
          <Button
            variant="secondary"
            style="outline"
            onPress={() => onSummarize(updatedNote)}
          >
            <span className="font-normal">summarize</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default memo(NoteCard, (prevProps: any, nextProps: any) => {
  // Re-render only if the note actually changes
  return isEqual(prevProps.note, nextProps.note);
});
