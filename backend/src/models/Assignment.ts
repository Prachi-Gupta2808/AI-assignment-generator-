import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionType {
  type: string;
  numberOfQuestions: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  questionTypes: IQuestionType[];
  additionalInstructions: string;
  fileUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
}

const QuestionTypeSchema = new Schema({
  type: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true },
  marks: { type: Number, required: true },
});

const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  questionTypes: [QuestionTypeSchema],
  additionalInstructions: { type: String, default: "" },
  fileUrl: { type: String },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAssignment>("Assignment", AssignmentSchema);
