import { INote } from "@/types/Note";
import { IPosition } from "@/types/Position";
import { v4 as uuid } from "uuid";

// A base note with no author Id
export const BASE_NOTE: (position: IPosition) => INote = (
  position: IPosition
) => {
  const newId = uuid();

  return {
    _id: newId,
    authorId: null,
    title: "",
    content: "",
    position: position,
    boardId: "1", // TODO BOARDS
    createdAt: "", // Empty string - will be set when note is actually created
  };
};
