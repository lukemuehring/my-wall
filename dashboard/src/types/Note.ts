import { IPosition } from "./Position";

export interface INote {
  _id: string;
  authorId: string | null;
  title: string;
  content: string;
  position: IPosition;
  boardId: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  summary?: string;
}
