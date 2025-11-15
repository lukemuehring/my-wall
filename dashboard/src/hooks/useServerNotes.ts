import { useState, useEffect } from "react";
import { INote } from "@/types/Note";
import { subscribeToNotes } from "@/lib/noteService";

export function useServerNotes(): INote[] | null {
  const [notes, setNotes] = useState<INote[] | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToNotes(setNotes);
    return () => unsubscribe();
  }, []);

  return notes;
}
