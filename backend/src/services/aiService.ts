import { GoogleGenerativeAI } from "@google/generative-ai";
import { IQuestionType } from "../models/Assignment";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export interface ParsedQuestion {
  questionNumber: number;
  text: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
}

export interface ParsedSection {
  title: string;
  instruction: string;
  questions: ParsedQuestion[];
}

export interface ParsedPaper {
  subject: string;
  sections: ParsedSection[];
  totalMarks: number;
  totalQuestions: number;
}

// Build structured prompt
const buildPrompt = (
  questionTypes: IQuestionType[],
  additionalInstructions: string,
  title: string
): string => {
  const questionDetails = questionTypes
    .map(
      (qt) =>
        `- ${qt.type}: ${qt.numberOfQuestions} questions, ${qt.marks} marks each`
    )
    .join("\n");

  const totalQuestions = questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions,
    0
  );
  const totalMarks = questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions * qt.marks,
    0
  );

  return `You are an expert teacher creating a question paper. Generate a structured question paper based on the following requirements.

Assignment Title: ${title}
Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}

Question Types Required:
${questionDetails}

Additional Instructions: ${additionalInstructions || "None"}

IMPORTANT: Respond with ONLY a valid JSON object. No extra text, no markdown, no backticks.

The JSON must follow this exact structure:
{
  "subject": "subject name based on title",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "questionNumber": 1,
          "text": "question text here",
          "difficulty": "Easy",
          "marks": 2
        }
      ]
    }
  ],
  "totalMarks": ${totalMarks},
  "totalQuestions": ${totalQuestions}
}

Rules:
- Group questions by type into sections (Section A, B, C etc.)
- Each section = one question type
- difficulty must be exactly "Easy", "Medium", or "Hard"
- Make questions relevant to the title/subject
- Return ONLY the JSON, nothing else`;
};

// Parse and validate AI response
const parseAIResponse = (rawResponse: string): ParsedPaper => {
  let cleaned = rawResponse.trim();
  cleaned = cleaned
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No valid JSON found in AI response");
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  const parsed = JSON.parse(cleaned) as ParsedPaper;

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid paper structure - missing sections");
  }

  parsed.sections.forEach((section, i) => {
    if (!section.title || !section.questions) {
      throw new Error(`Invalid section ${i + 1} structure`);
    }
    section.questions.forEach((q, j) => {
      if (!q.text || !q.difficulty || !q.marks) {
        throw new Error(`Invalid question ${j + 1} in section ${i + 1}`);
      }
      if (!["Easy", "Medium", "Hard"].includes(q.difficulty)) {
        q.difficulty = "Medium";
      }
    });
  });

  return parsed;
};

// Main generate function
export const generateQuestionPaper = async (
  title: string,
  questionTypes: IQuestionType[],
  additionalInstructions: string
): Promise<ParsedPaper> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = buildPrompt(questionTypes, additionalInstructions, title);

  const result = await model.generateContent(prompt);
  const rawResponse = result.response.text();

  const paper = parseAIResponse(rawResponse);

  return paper;
};
