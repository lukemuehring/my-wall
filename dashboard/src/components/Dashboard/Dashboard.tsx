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
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize base note
  useEffect(() => {
    if (!baseNote) {
      setBaseNote(BASE_NOTE(maxZIndex));
    }
  }, [baseNote]);

  // Creates the note, and replaces the base note in place with authorId
  const handleCreateNote = async (newNote: INote) => {
    setLoading(true);
    try {
      const createdNote: INote = await createNoteWithUser(newNote);
      await handleGetNotes();
    } catch (err) {
      console.error("Dashboard: unable to create note.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBaseNote = async () => {
    let maxZ = handleBringToFront();
    handleCreateNote(BASE_NOTE(maxZ));
  };

  // Get - Next API service call
  const handleGetNotes = async () => {
    console.log("Dashboard: fetching notes...");
    setLoading(true);
    try {
      let notes: INote[] = await getNotes();
      notes = notes
        .filter((n: INote) => !n.updatedAt)
        .concat(
          notes
            .filter((n: INote) => n.updatedAt)
            .sort(
              (a: INote, b: INote) =>
                new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime()
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
    } catch (err) {
      console.error("Dashboard: unable to get notes.", err);
    } finally {
      setLoading(false);
    }
  };

  // Update - Next API service call
  const handleUpdateNote = async (updatedNote: INote) => {
    setLoading(true);
    try {
      await updateNote(updatedNote);
    } catch (err) {
      console.error("Dashboard: unable to update note.", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDeleteNote = async (noteId: string) => {
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

    setLoading(true);
    try {
      await deleteNote(noteId);
    } catch (err) {
      console.error("Dashboard: unable to delete note", err);
      // Revert local delete
      setNotes((prev) => (prev ? [...prev, noteToDelete] : null));
    } finally {
      setLoading(false);
    }
  };

  // Initial GET - fetch notes only once on mount
  useEffect(() => {
    handleGetNotes();
  }, []);

  // Summarize note
  const handleSummarize = async (note: INote) => {
    setLoading(true);
    try {
      const summary = await summarizeNote(note);
      const updatedNote = { ...note, summary };
      console.log("summary", summary);
      await handleUpdateNote(updatedNote); //todo - updates saved on server wont be reflected in UI, it's not two ways.
    } catch (error) {
      console.error("Failed to summarize note:", error);
    } finally {
      setLoading(false);
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
    <div className="dashboard-canvas" style={{ position: "relative" }}>
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
      <div className={`dashboard-loading-bar${loading ? " active" : ""}${loading ? " running" : " paused"}`} />
      <div className="note-container" ref={containerRef}>
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
