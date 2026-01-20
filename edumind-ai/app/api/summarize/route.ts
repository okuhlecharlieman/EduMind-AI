import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a student study assistant. Generate clear, concise bullet-point summaries from study notes. Focus on key concepts and main ideas. Format as a numbered list of bullet points.",
        },
        {
          role: "user",
          content: `Please summarize the following study notes into key points and concepts:\n\n${text}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const summary =
      response.choices[0].message.content || "Unable to generate summary";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
