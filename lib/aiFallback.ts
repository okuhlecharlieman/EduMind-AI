export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function extractKeywords(text: string, max = 8): string[] {
  const stopwords = new Set([
    "the","a","an","and","or","but","if","then","than","that","this","those","these","is","are","was","were","be","been","being","to","of","in","on","for","with","by","as","at","from","it","its","their","there","they","them","you","your","we","our","i","me","my","he","she","his","her","not","can","could","should","would","will","about","into","over","under","after","before","during"
  ]);

  const freq = new Map<string, number>();
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .forEach((word) => {
      if (word.length < 4 || stopwords.has(word)) return;
      freq.set(word, (freq.get(word) || 0) + 1);
    });

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

export function fallbackSummary(text: string): string {
  const sentences = splitSentences(text);
  const keywords = extractKeywords(text, 5);

  if (sentences.length === 0) {
    return "1. Add more study notes so I can summarize key ideas.";
  }

  const selected = sentences.slice(0, 4);
  const bullets = selected.map((sentence, i) => `${i + 1}. ${sentence}`);

  if (keywords.length > 0) {
    bullets.push(`${bullets.length + 1}. Key terms to review: ${keywords.join(", ")}.`);
  }

  return bullets.join("\n");
}

export function fallbackSimplify(text: string): string {
  const sentences = splitSentences(text).slice(0, 4);
  if (sentences.length === 0) {
    return "• Add a summary first, then I can simplify it for younger learners.";
  }

  return sentences
    .map((sentence) => `• ${sentence.replace(/\b(utilize|approximately|demonstrate|facilitate)\b/gi, "use")}`)
    .join("\n");
}

export function fallbackQuiz(text: string): QuizQuestion[] {
  const sentences = splitSentences(text);
  const keywords = extractKeywords(text, 12);

  const baseTopics = keywords.length > 0 ? keywords : ["concept", "idea", "topic", "review", "practice"];

  const questions: QuizQuestion[] = Array.from({ length: 5 }, (_, idx) => {
    const topic = baseTopics[idx % baseTopics.length];
    const clueSentence = sentences[idx % Math.max(sentences.length, 1)] || text.slice(0, 120) || "the study notes";

    const correct = `It connects to ${topic}.`;
    const distractors = [
      `It is unrelated to ${topic}.`,
      "It is only a date with no concept.",
      "It means you can ignore this part."
    ];

    return {
      question: `Q${idx + 1}: Which statement best matches this notes point: \"${clueSentence.slice(0, 90)}${clueSentence.length > 90 ? "..." : ""}\"?`,
      options: [correct, ...distractors],
      correctAnswer: 0,
      topic: topic[0].toUpperCase() + topic.slice(1),
    };
  });

  return questions;
}
