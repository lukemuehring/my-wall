"use client";
import { BASE_NOTE } from "@/lib/constants";
import {
  createNoteWithUser,
  deleteNote,
  getNotes,
  summarizeNote,
  updateNote,
} from "@/lib/noteService";
import { INote } from "@/types/Note";
import { Button } from "@adobe/react-spectrum";
import { useEffect, useRef, useState } from "react";
import NoteCard from "../NoteCard/NoteCard";
import "./Dashboard.css";

export default function Dashboard() {
  const [notes, setNotes] = useState<INote[] | null>(null);
  const [maxZIndex, setMaxZIndex] = useState<number>(0);
  const [baseNote, setBaseNote] = useState<INote | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize base note
  useEffect(() => {
    if (!baseNote) {
      setBaseNote(BASE_NOTE(maxZIndex));
    }
  }, [baseNote]);

  // Creates the note, and replaces the base note in place with authorId
  const handleCreateNote = async (newNote: INote) => {
    // Save to server
    try {
      const createdNote: INote = await createNoteWithUser(newNote);
      handleGetNotes();
    } catch {
      console.log("create didnt work lol");
    }
  };

  const handleCreateBaseNote = async () => {
    let maxZ = handleBringToFront();
    handleCreateNote(BASE_NOTE(maxZ));
  };

  // Get - Next API service call
  const handleGetNotes = async () => {
    // Sort notes by last update ascending for z-index.
    let notes: INote[] = await getNotes();
    notes = notes
      .filter((n: INote) => !n.updatedAt)
      .concat(
        notes
          .filter((n: INote) => n.updatedAt)
          .sort(
            (a: INote, b: INote) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          )
      );
    notes = notes.map((note: INote, idx: number) => ({
      ...note,
      position: {
        ...note.position,
        z: idx + 1,
      },
    }));
    setMaxZIndex(notes.length + 1);
    setNotes(notes);
  };

  // Update - Next API service call
  const handleUpdateNote = async (updatedNote: INote) => {
    console.log("updating from dashboard");
    updateNote(updatedNote);
  };

  // Delete
  const handleDeleteNote = async (noteId: string) => {
    console.log("handleDelete in Dashboard.");
    if (!notes) {
      return;
    }
    const noteToDelete = notes.find((note) => note._id === noteId);
    if (!noteToDelete) {
      return;
    }

    // Remove immediately from local notes and mark as deleted
    setNotes((prev) => {
      return prev ? prev.filter((note) => note._id !== noteId) : null;
    });

    try {
      await deleteNote(noteId);
    } catch (err) {
      console.error("Failed to delete note:", err);
      // Revert local delete
      setNotes((prev) => (prev ? [...prev, noteToDelete] : null));
    }
  };

  // Initial GET
  if (!notes) {
    handleGetNotes();
  }

  // Summarize note
  const handleSummarize = async (note: INote) => {
    try {
      const summary = await summarizeNote(note);
      const updatedNote = { ...note, summary };
      console.log("summary", summary);
      await handleUpdateNote(updatedNote); //todo - updates saved on server wont be reflected in UI, it's not two ways.
    } catch (error) {
      console.error("Failed to summarize note:", error);
    }
  };

  function clearBaseNoteFields() {
    if (baseNote) {
      baseNote.title = "";
      baseNote.content = "";
    }
  }

  // Handler to bring a note to the front (increment maxZIndex and return new value)
  function handleBringToFront() {
    let newZ: number = 0;
    setMaxZIndex((prev) => {
      newZ = prev + 1;
      return newZ;
    });
    return newZ;
  }

  return (
    <div className="dashboard-canvas">
      {/* Centered header */}
      <div className="flex flex-col items-center justify-center py-8">
        <h2 className="text-6xl text-black mb-4">What's on your mind?</h2>
        <div>
          <Button
            variant="secondary"
            style="outline"
            onPress={() => handleCreateBaseNote()}
          >
            <span className="font-normal">New Note</span>
          </Button>
        </div>
      </div>

      <div className="note-container" ref={containerRef}>
        {/* Debug: show note titles and first 50 chars of content
      <pre
        style={{
          background: "#f5f5f5",
          padding: "1em",
          marginTop: "2em",
          borderRadius: "6px",
          fontSize: "0.9em",
          overflowX: "auto",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        {Array.isArray(notes)
          ? notes
              .map(
                (n, i) =>
                  `${i + 1}. ${n.title || "(no title)"}\n   ${
                    n.content ? n.content.slice(0, 50) : ""
                  }${n.content && n.content.length > 50 ? "..." : ""}
              ${new Date(n.updatedAt).toLocaleString()}
              z-index: ${n.position.z}\n`
              )
              .join("")
          : "No notes."}
      </pre> */}
        {/* all notes */}
        {(() => {
          if (notes === null) {
            return (
              <div className="flex justify-center py-8">
                <p className="text-xl text-gray-500">Loading notes...</p>
              </div>
            );
          } else if (notes.length === 0) {
            return (
              <div className="flex justify-center py-8">
                <p className="text-xl text-gray-500">No notes found.</p>
                {baseNote && (
                  <NoteCard
                    note={baseNote}
                    key={baseNote._id}
                    containerRef={containerRef}
                    onBringToFront={handleBringToFront}
                    onCreate={(note: INote) => handleCreateNote(note)}
                    onUpdate={(note: INote) => handleUpdateNote(note)}
                    onDelete={() => clearBaseNoteFields()}
                    onSummarize={(note: INote) => handleSummarize(note)}
                  ></NoteCard>
                )}
              </div>
            );
          } else {
            return notes.map((note) => (
              <NoteCard
                note={note}
                key={note._id}
                containerRef={containerRef}
                onBringToFront={handleBringToFront}
                onCreate={(note: INote) => handleCreateNote(note)}
                onUpdate={(note: INote) => handleUpdateNote(note)}
                onDelete={() => handleDeleteNote(note._id)}
                onSummarize={(note: INote) => handleSummarize(note)}
              ></NoteCard>
            ));
          }
        })()}
      </div>
    </div>
  );
}
