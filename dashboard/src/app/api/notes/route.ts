import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note"; // adjust path if needed
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

type SanityNote = INote & {
  _id: string;
  _type: "note";
};

// CREATE
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const note: INote = await req.json();
    const sanityNote: SanityNote = {
      ...note,
      _id: note._id ?? uuidv4(),
      _type: "note",
    };

    const createdNote: INote = await sanityClient.createIfNotExists(sanityNote);

    return NextResponse.json<INote>(createdNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}