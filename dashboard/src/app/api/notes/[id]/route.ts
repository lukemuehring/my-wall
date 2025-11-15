import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";
import { INote } from "@/types/Note";

// UPDATE
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { updatedNote }: { updatedNote: INote } = await req.json();
    // Validate request
    if (!updatedNote || !updatedNote._id || params.id !== updatedNote._id) {
      return NextResponse.json(
        { error: "_id and Note are required, and must match request." },
        { status: 400 }
      );
    }

    console.log("Next API: UpdateNote - calling Sanity with payload", updatedNote);
    const result: INote = await sanityClient
      .patch(updatedNote._id)
      .set(updatedNote)
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

// DELETE: Delete a note by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id: noteId } = await params;

  if (!noteId) {
    return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
  }

  try {
    await sanityClient.delete(noteId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
