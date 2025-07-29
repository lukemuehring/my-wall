import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note";

const getNotesQuery = `*[_type == "note"]{
      _id,
      title,
      content,
      position
    }`;
type INotesCallback = (notes: INote[]) => void;

// CREATE
export async function createNote(note: Omit<INote, "_id">): Promise<INote> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  return res.json();
}

// GET
export function subscribeToNotes(onUpdate: INotesCallback) {
  // Initial fetch
  sanityClient.fetch<INote[]>(getNotesQuery).then(onUpdate);

  // Subscribe to real-time updates
  const subscription = sanityClient.listen(getNotesQuery).subscribe(() => {
    // Re-fetch when content changes
    sanityClient.fetch<INote[]>(getNotesQuery).then(onUpdate);
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
  const res = await fetch(`/api/notes/${_id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete note.");
  }

  return res.json();
}
