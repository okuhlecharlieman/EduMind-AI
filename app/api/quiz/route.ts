import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { fallbackQuiz, QuizQuestion } from "@/lib/aiFallback";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

function isValidQuestion(q: Question): boolean {
  return (
    !!q.question &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    typeof q.correctAnswer === "number" &&
    q.correctAnswer >= 0 &&
    q.correctAnswer <= 3 &&
    !!q.topic
  );
}

export async function POST(request: NextRequest) {
  let text = "";

  try {
    const body = await request.json();
    text = body?.text ?? "";

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (!process.env.HUGGINGFACE_API_TOKEN) {
      return NextResponse.json({ questions: fallbackQuiz(text), fallback: true });
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

    const prompt = `You are a quiz generator for students. Generate exactly 5 multiple choice questions based on the provided text. Each question must include a short topic label such as "Cell Biology" or "Fractions". Return the response as a valid JSON array with objects containing: question (string), options (array of 4 strings), correctAnswer (0-3 index of correct option), and topic (string). Return ONLY valid JSON, no markdown, no code blocks.

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

    const content = response.generated_text?.replace(prompt, "").trim() || "[]";
    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions = JSON.parse(cleanedContent) as QuizQuestion[];

    if (!Array.isArray(questions) || questions.length === 0 || questions.length > 5 || !questions.every(isValidQuestion)) {
      throw new Error("Invalid quiz format");
    }

    return NextResponse.json({ questions, fallback: false });
  } catch (error) {
    console.error("Quiz generation error. Falling back to local quiz generator:", error);
    return NextResponse.json({ questions: fallbackQuiz(text), fallback: true });
  }
}
