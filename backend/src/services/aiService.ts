import { GoogleGenerativeAI } from "@google/generative-ai";
import { IQuestionType } from "../models/Assignment";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export interface ParsedQuestion {
  questionNumber: number;
  text: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  answer?: string;
}

export interface ParsedSection {
  title: string;
  instruction: string;
  questions: ParsedQuestion[];
}

export interface ParsedPaper {
  subject: string;
  schoolName: string;
  className: string;
  timeAllowed: string;
  aiMessage: string;
  sections: ParsedSection[];
  totalMarks: number;
  totalQuestions: number;
}

const buildPrompt = (
  questionTypes: IQuestionType[],
  additionalInstructions: string,
  title: string,
  extractedText?: string
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

  const referenceSection = extractedText
    ? `Reference Material (generate questions based on this content):
${extractedText}

`
    : "";

  return `You are an expert teacher creating a question paper.

${referenceSection}Assignment Title: ${title}
Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}

Question Types Required:
${questionDetails}

Additional Instructions: ${additionalInstructions || "None"}

IMPORTANT: Respond with ONLY a valid JSON object. No extra text, no markdown, no backticks.

{
  "subject": "subject name based on title",
  "schoolName": "Delhi Public School, Sector-4, Bokaro",
  "className": "Class 10",
  "timeAllowed": "3 Hours",
  "aiMessage": "Here is your customized Question Paper for [subject]. All questions are based on the curriculum.",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "questions": [
        {
          "questionNumber": 1,
          "text": "question text here",
          "difficulty": "Easy",
          "marks": 2,
          "answer": "brief answer here"
        }
      ]
    }
  ],
  "totalMarks": ${totalMarks},
  "totalQuestions": ${totalQuestions}
}

Rules:
- Group questions by type into sections (Section A, B, C etc.)
- difficulty must be exactly "Easy", "Medium", or "Hard"
- Each question must have a brief answer for the answer key
- Make questions based on reference material if provided
- aiMessage should be a friendly note about the paper
- Return ONLY the JSON, nothing else`;
};

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
    throw new Error("Invalid paper structure");
  }

  parsed.sections.forEach((section) => {
    section.questions.forEach((q) => {
      if (!["Easy", "Medium", "Hard"].includes(q.difficulty)) {
        q.difficulty = "Medium";
      }
    });
  });

  return parsed;
};

export const generateQuestionPaper = async (
  title: string,
  questionTypes: IQuestionType[],
  additionalInstructions: string,
  extractedText?: string
): Promise<ParsedPaper> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = buildPrompt(
    questionTypes,
    additionalInstructions,
    title,
    extractedText
  );

  const result = await model.generateContent(prompt);
  const rawResponse = result.response.text();
  return parseAIResponse(rawResponse);
};
