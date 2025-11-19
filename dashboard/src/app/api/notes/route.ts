import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note"; // adjust path if needed
import { NextRequest, NextResponse } from "next/server";

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

const getNotesQuery = `*[_type == "note"]{
      _id,  
      title,
      content,
      position,
      authorId,
      boardId,
      createdAt,
      updatedAt,
      summary
    }`;

// READ
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const notes = await sanityClient.fetch<INote[]>(getNotesQuery);
    console.log("next API found notes", notes)
    return NextResponse.json<INote[]>(notes, { status: 201 });
  } catch (error) {
    console.error("Failed to get notes:", error);
    return NextResponse.json(
      { error: "Failed to get notes." },
      { status: 500 }
    );
  }
}
