import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { fallbackSimplify } from "@/lib/aiFallback";
import { enforceUsageLimit } from "@/lib/monetization";

export async function POST(request: NextRequest) {
  let text = "";

  try {
    const usageCheck = enforceUsageLimit(request, "simplify");
    if (!usageCheck.allowed) {
      return NextResponse.json(usageCheck.payload, { status: usageCheck.status });
    }

    const body = await request.json();
    text = body?.text ?? "";

    // Check for API Token first
    if (!process.env.HUGGINGFACE_API_TOKEN) {
      return NextResponse.json({ 
        summary: fallbackSimplify(text), 
        fallback: true, 
        usage: usageCheck.usage 
      });
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

    const prompt = `You are a kind AI tutor. Rewrite the following study summary so a 12-year-old student can understand it easily. Keep the explanation accurate, friendly, and short. Return only simple bullet points.

Study Summary:
${text}

Simple version:`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 350,
        temperature: 0.6,
        top_p: 0.9,
      },
    });

    // Mistral often returns the prompt + the result; we strip the prompt out
    const summary = response.generated_text?.replace(prompt, "").trim();

    if (!summary) {
      return NextResponse.json({ 
        summary: fallbackSimplify(text), 
        fallback: true, 
        usage: usageCheck.usage 
      });
    }

    return NextResponse.json({ summary, fallback: false, usage: usageCheck.usage });
  } catch (error) {
    console.error("Simplify error. Falling back to local simplifier:", error);
    return NextResponse.json({ 
      summary: fallbackSimplify(text), 
      fallback: true 
    });
  }
}
