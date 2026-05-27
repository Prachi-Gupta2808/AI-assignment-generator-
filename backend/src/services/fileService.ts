import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
const pdf = require("pdf-parse");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Extract text from PDF
const extractFromPDF = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

// Extract text from image using Gemini Vision
const extractFromImage = async (filePath: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const imageData = fs.readFileSync(filePath);
  const base64Image = imageData.toString("base64");
  const mimeType = filePath.endsWith(".png") ? "image/png" : "image/jpeg";

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    },
    "Extract all text and content from this image. Return only the extracted text, nothing else.",
  ]);

  return result.response.text();
};

// Main function
export const extractTextFromFile = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  try {
    if (mimeType === "application/pdf") {
      return await extractFromPDF(filePath);
    } else if (mimeType.startsWith("image/")) {
      return await extractFromImage(filePath);
    }
    return "";
  } catch (error) {
    console.error("Error extracting text from file:", error);
    return "";
  } finally {
    // Delete file after extraction
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
