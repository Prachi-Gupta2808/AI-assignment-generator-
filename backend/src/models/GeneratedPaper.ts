import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  questionNumber: number;
  text: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  answer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  sections: ISection[];
  totalMarks: number;
  totalQuestions: number;
  subject: string;
  schoolName: string;
  className: string;
  timeAllowed: string;
  aiMessage: string;
  createdAt: Date;
}

const QuestionSchema = new Schema({
  questionNumber: { type: Number, required: true },
  text: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  marks: { type: Number, required: true },
  answer: { type: String, default: "" },
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const GeneratedPaperSchema = new Schema({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  sections: [SectionSchema],
  totalMarks: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  subject: { type: String, default: "General" },
  schoolName: { type: String, default: "Delhi Public School" },
  className: { type: String, default: "Class 10" },
  timeAllowed: { type: String, default: "3 Hours" },
  aiMessage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGeneratedPaper>(
  "GeneratedPaper",
  GeneratedPaperSchema
);
