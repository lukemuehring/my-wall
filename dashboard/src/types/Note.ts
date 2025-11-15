import { IPosition } from "./Position";

export interface INote {
  _id: string;
  authorId: string | null;
  title: string;
  content: string;
  position: IPosition;
  boardId: string;
  createdAt: string; // ISO datetime string

  _createdAt?: string; // is this needed?  Sanity system field for creation datetime, optional
}
