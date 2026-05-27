// types/index.ts

export interface Assignment {
  id: string;
  title: string;
  assignedDate: string;
  dueDate: string;
}

export type QuestionTypeSelection = string;

export interface QuestionTypeRowConfig {
  id: string;
  type: QuestionTypeSelection;
  noOfQuestions: number;
  marks: number;
}
