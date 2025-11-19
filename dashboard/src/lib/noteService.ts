import { INote } from "@/types/Note";
import { v4 } from "uuid";
import { auth } from "../../firebase";

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

  const newGuid = v4();
  const noteWithUser: INote = {
    ...noteData,
    _id: newGuid,
    authorId: user.uid,
    createdAt: new Date().toISOString(), // Use ISO string for consistency
    updatedAt: new Date().toISOString(),
  };

  return createNote(noteWithUser);
}

// GET
export async function getNotes() {
  const res = await fetch("/api/notes", {
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
export async function deleteNote(id: string) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete note.");
  }

  return res.json();
}

// SUMMARIZE
export async function summarizeNote(note: INote): Promise<string> {
  const res = await fetch(`/api/notes/${note._id}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: note._id, content: note.content }),
  });

  if (!res.ok) {
    throw new Error("Failed to summarize note.");
  }

  const data = await res.json();
  return data.summary;
}
