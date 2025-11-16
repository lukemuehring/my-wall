import { INote } from "@/types/Note";
import { IPosition } from "@/types/Position";

export const BASE_NOTE_ID: string = 'base_note';

// A base note with no author Id
export const BASE_NOTE: (position: IPosition) => INote = (
  position: IPosition
) => {
  return {
    _id: BASE_NOTE_ID,
    authorId: null,
    title: "BASE NOTE",
    content: "",
    position: position,
    boardId: "1",
    createdAt: "", 
  } as INote;
};

export const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
