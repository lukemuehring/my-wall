import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note";
import { auth } from "../../firebase";
import { v4 as uuid } from "uuid";

const getNotesQuery = `*[_type == "note"]{
      _id,
      title,
      content,
      position
    }`;
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
export function subscribeToNotes(onUpdate: INotesCallback) {
  // Initial fetch
  sanityClient.fetch<INote[]>(getNotesQuery).then(onUpdate);

  // Subscribe to real-time updates
  const subscription = sanityClient.listen(getNotesQuery).subscribe(() => {
    // Re-fetch when content changes
    console.log("updating in the subscription to notes");
    sanityClient.fetch<INote[]>(getNotesQuery).then((notes) => {
      console.log("Fetch result after change:", notes);
      onUpdate(notes);
    });
  });

  return () => subscription.unsubscribe();
}

// UPDATE
export async function updateNote(_id: string, updatedFields: Partial<INote>) {
  const res = await fetch("/api/notes", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id, updatedFields }),
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
