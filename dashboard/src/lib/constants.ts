import { INote } from "@/types/Note";

export const BASE_NOTE_ID: string = "base_note";

// A base note with no author Id
export const BASE_NOTE: (z: number) => INote = (z) => {
  return {
    _id: BASE_NOTE_ID,
    authorId: null,
    title: "BASE NOTE",
    content: "",
    position: { x: 100, y: 100, z: z },
    boardId: "1",
    createdAt: "",
  } as INote;
};

export const isEqual = (a: any, b: any) =>
  JSON.stringify(a) === JSON.stringify(b);
