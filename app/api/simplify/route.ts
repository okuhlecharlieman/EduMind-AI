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
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const prompt = `You are a kind AI tutor. Rewrite the following study summary so a 12-year-old student can understand it easily. Keep the explanation accurate, friendly, and short. Return only simple bullet points.\n\nStudy Summary:\n${text}\n\nSimple version:`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 350,
        temperature: 0.6,
        top_p: 0.9,
      },
    });

    const summary = response.generated_text?.replace(prompt, "").trim() || "Unable to simplify summary";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Simplify error:", error);
    return NextResponse.json({ error: "Failed to simplify summary" }, { status: 500 });
  }
}
