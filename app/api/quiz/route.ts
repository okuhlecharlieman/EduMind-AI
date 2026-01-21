import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

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

    const prompt = `You are a quiz generator for students. Generate exactly 5 multiple choice questions based on the provided text. Each question should have 4 answer options. Return the response as a valid JSON array with objects containing: question (string), options (array of 4 strings), and correctAnswer (0-3 index of correct option). Return ONLY valid JSON, no markdown, no code blocks.

Study Notes:
${text}

JSON Quiz:`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    const content = response.generated_text
      ?.replace(prompt, "")
      .trim() || "[]";
    
    // Parse the JSON response
    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const questions: Question[] = JSON.parse(cleanedContent);

    // Validate quiz structure
    if (
      !Array.isArray(questions) ||
      questions.length === 0 ||
      questions.length > 5
    ) {
      throw new Error("Invalid quiz format");
    }

    for (const q of questions) {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== "number" ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
      ) {
        throw new Error("Invalid question format");
      }
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
