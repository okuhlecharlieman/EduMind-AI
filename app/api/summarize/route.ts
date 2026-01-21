import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.HUGGINGFACE_API_TOKEN) {
      return NextResponse.json(
        { error: "HuggingFace API token not configured" },
        { status: 500 }
      );
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const prompt = `You are a student study assistant. Generate a clear, concise bullet-point summary from the following study notes. Focus on key concepts and main ideas. Format as a numbered list of bullet points.

Study Notes:
${text}

Summary (bullet points only):`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    const summary = response.generated_text
      ?.replace(prompt, "")
      .trim() || "Unable to generate summary";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
