import { IPosition } from "./Position";

export interface INote {
  _id: string; // when is this undefined?
  _createdAt?: string; // is this needed?  Sanity system field for creation datetime, optional

  title: string;
  content: string;
  position: IPosition;
  authorId: string | null;
  boardId: string;
  createdAt: string; // ISO datetime string
}
