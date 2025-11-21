"use client";
import { isEqual } from "@/lib/constants";
import { INote } from "@/types/Note";
import { ActionButton, Button, TextArea } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
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
        onUpdate(debouncedUpdatedNote);
      } else {
        onCreate(debouncedUpdatedNote);
      }
    }
  }, [debouncedUpdatedNote]);
  // #endregion UPDATE

  const pointerOffset = useRef({ x: 0, y: 0 });
  function handleDragStart(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    // Bring note to front
    const newMaxZIndex = onBringToFront();
    // debug 
    //console.log("Bringing to front, new z-index:", updatedNote.position);
    setField("position", {
      x: updatedNote.position.x,
      y: updatedNote.position.y,
      z: newMaxZIndex,
    });

    // Calculate pointer offset within the note card
    const cardRect = event.currentTarget.getBoundingClientRect();
    pointerOffset.current = {
      x: event.clientX - cardRect.left,
      y: event.clientY - cardRect.top,
    };
  }

  // update the position relative to container div and pointer offset
  function handleDragEnd(info: { point: { x: number; y: number } }) {
    let offsetX = 0;
    let offsetY = 0;
    if (containerRef && containerRef.current) {
      const noteContainer = containerRef.current.getBoundingClientRect();
      offsetX = noteContainer.left;
      offsetY = noteContainer.top;
    }
    // debug 
    // console.log("info.point:", info.point);
    // console.log("container offset:", offsetX, offsetY);
    // console.log(
    //   "pointer offset",
    //   pointerOffset.current.x,
    //   pointerOffset.current.y
    // );

    // console.log("-=-=-=-=-=-=-");
    // console.log("Final position:", {
    //   x: info.point.x - offsetX - pointerOffset.current.x,
    //   y: info.point.y - offsetY - pointerOffset.current.y,
    // });

    // info.point - absolute position of pointer in viewport
    // offset - note container position in viewport in x and y
    // pointer offset - where we clicked in the note card, relative to top-left

    // the framer motion translate is always relative to the original position
    // my positon is the top left corner, relative to the note container.

    setField("position", {
      x: info.point.x - offsetX - pointerOffset.current.x,
      y: info.point.y - offsetY - pointerOffset.current.y,
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
      onMouseDown={(e) => handleDragStart(e)} // event name may need to be updated for mobile
      onDragEnd={(_, info) => handleDragEnd(info)}
      initial={{
        x: updatedNote.position.x,
        y: updatedNote.position.y,
      }}
      style={{
        position: "absolute",
        zIndex: updatedNote.position.z,
      }}
      className="flex flex-col w-fit text-black cursor-move rounded p-8 shadow bg-white border-gray-300 border-[1px]"
    >
      {/* DEBUG*/}
      {/* <div className="absolute left-2 top-2 text-xs bg-gray-100 px-2 py-1 rounded shadow z-10">
        <span>
          left: {updatedNote.position.x}, top: {updatedNote.position.y}
        </span>
        <br />
      </div> */}

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
