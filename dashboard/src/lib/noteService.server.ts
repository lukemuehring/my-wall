import { v4 as uuidv4 } from "uuid";

import { sanityClient } from "./sanityClient";
import { INote } from "@/types/Note";

type SanityNote = INote & {
  _id: string;
  _type: "note";
};

export async function createNoteInSanity(note: INote): Promise<INote> {
  const sanityNote: SanityNote = {
    ...note,
    _id: note._id ?? uuidv4(),
    _type: "note",
  };

  return sanityClient.createIfNotExists(sanityNote);
}
