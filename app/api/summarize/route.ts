import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { fallbackSummary } from "@/lib/aiFallback";

export async function POST(request: NextRequest) {
  let text = "";

  try {
    const body = await request.json();
    text = body?.text ?? "";

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (!process.env.HUGGINGFACE_API_TOKEN) {
      return NextResponse.json({ summary: fallbackSummary(text), fallback: true });
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

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

    const summary = response.generated_text?.replace(prompt, "").trim();

    if (!summary) {
      return NextResponse.json({ summary: fallbackSummary(text), fallback: true });
    }

    return NextResponse.json({ summary, fallback: false });
  } catch (error) {
    console.error("Summarize error. Falling back to local summarizer:", error);
    return NextResponse.json({ summary: fallbackSummary(text), fallback: true });
  }
}
