import questionsData from "@/data/questions.json";

export interface QuestionOption { value: string; label: string; points: number; }
export interface Question { id: string; question: string; answers: QuestionOption[]; }
export interface CategoryBlock { category: string; questions: Question[]; }

export function loadQuestions(): CategoryBlock[] {
  return questionsData as CategoryBlock[];
}
