
export enum Provider {
  Gemini = 'Gemini',
  OpenRouter = 'OpenRouter',
}

export interface ApiConfig {
  provider: Provider;
  geminiKey: string;
  openRouterKey: string;
  openRouterModel: string;
}

export type QuestionType = 'multiple-choice' | 'fill-in-the-blank';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  type: QuestionType;
}

export interface Quiz {
  subject: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect?: boolean;
  explanation?: string;
}
