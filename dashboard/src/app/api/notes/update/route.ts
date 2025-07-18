import { sanityClient } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { _id, updatedFields } = await req.json();

    if (!_id || !updatedFields) {
      return NextResponse.json(
        { error: "Missing _id or updatedFields" },
        { status: 400 }
      );
    }

    const result = await sanityClient.patch(_id).set(updatedFields).commit();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}
