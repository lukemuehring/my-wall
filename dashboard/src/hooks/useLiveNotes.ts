import { useState, useEffect } from "react";
import { INote } from "@/types/Note";
import { subscribeToNotes } from "@/lib/noteService";

export function useLiveNotes(): INote[] {
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToNotes(setNotes);
    return () => unsubscribe();
  }, []);

  return notes;
}
