import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note";
import { auth } from "../../firebase";

type INotesCallback = (notes: INote[]) => void;

// CREATE
export async function createNote(note: INote): Promise<INote> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  const createdNote: INote = await res.json();
  return createdNote;
}

// CREATE WITH USER (automatically gets current user)
export async function createNoteWithUser(
  noteData: Omit<INote, "authorId">
): Promise<INote> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to create a note");
  }

  const noteWithUser: INote = {
    ...noteData,
    authorId: user.uid,
    createdAt: new Date().toISOString(), // Use ISO string for consistency
  };

  return createNote(noteWithUser);
}

// GET
export async function getNotes() {
  const res = await fetch('/api/notes', {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("Failed to get notes.");
  }
  return res.json();
}

// UPDATE
export async function updateNote(updatedNote: INote) {
  const res = await fetch(`/api/notes/${updatedNote._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updatedNote }),
  });
  if (!res.ok) {
    throw new Error("Failed to update note.");
  }
  return res.json();
}

// DELETE
export async function deleteNote(_id: string) {
  console.log("deleting note");

  const res = await fetch(`/api/notes/${_id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete note.");
  }

  return res.json();
}
