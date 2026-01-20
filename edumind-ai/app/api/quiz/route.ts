import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

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
            "You are a quiz generator for students. Generate exactly 5 multiple choice questions based on the provided text. Each question should have 4 answer options. Return the response as a valid JSON array with objects containing: question (string), options (array of 4 strings), and correctAnswer (0-3 index of correct option). Return ONLY valid JSON, no markdown, no code blocks.",
        },
        {
          role: "user",
          content: `Generate 5 multiple choice questions from these study notes:\n\n${text}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content || "[]";
    
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
