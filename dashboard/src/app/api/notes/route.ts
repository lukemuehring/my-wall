import { createNoteInSanity } from "@/lib/noteService.server"; // server-side function
import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note"; // adjust path if needed
import { NextRequest, NextResponse } from "next/server";

// POST: Create a new note
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: INote = await req.json();
    const createdNote: INote = await createNoteInSanity(body);

    return NextResponse.json<INote>(createdNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing note
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      _id,
      updatedFields,
    }: { _id: string; updatedFields: Partial<INote> } = await req.json();

    if (!_id || !updatedFields) {
      return NextResponse.json(
        { error: "Missing _id or updatedFields" },
        { status: 400 }
      );
    }

    console.log("updating note with payload", updatedFields, "for id", _id);

    const result: INote = await sanityClient
      .patch(_id)
      .set(updatedFields)
      .commit();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}
