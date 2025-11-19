import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// SUMMARIZE: Generate a summary for a note
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id, content }: { id: string; content: string } = await req.json();

    if (!id || !content) {
      return NextResponse.json(
        { error: "Note ID and content are required" },
        { status: 400 }
      );
    }

    // Use OpenAI API for summarization
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
    Summarize your journal entry in 1-2 sentences.
    Highlight the main theme.
    If you express a desire for change, list clear action items as bullet points.
    Be concise and match the tone and style of the entry.
    Write as if speaking directly to the author.
    `;

    // Preprocessing content
    // Remove excessive whitespace
    let cleanContent = content.trim().replace(/\s+/g, " ");

    // Reduce length for token limits
    if (cleanContent.length > 2000) cleanContent = cleanContent.slice(0, 2000);

    // API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        { role: "user", content: cleanContent },
      ],
      max_tokens: 100,
      temperature: 0.5, // controls the randomness/creativity, 1.0 is most varied
    });

    const summary = completion.choices[0].message.content?.trim() || "";
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("Failed to summarize note:", error);
    return NextResponse.json(
      { error: "Failed to summarize note" },
      { status: 500 }
    );
  }
}
