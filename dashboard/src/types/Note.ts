import { IPosition } from "./Position";

export interface INote {
  _id?: string; // Sanity document ID, optional because it may not be present before fetching
  _createdAt?: string; // Sanity system field for creation datetime, optional
  title: string;
  content: string;
  position: IPosition;
  authorId: string;
  boardId: string;
  createdAt: string; // ISO datetime string
}
