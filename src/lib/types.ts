// types.ts
export interface Term {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export interface WordItem {
  id: string;
  word: string;
  isDevTerm: boolean;
  definition?: string;
  isCompleted: boolean;
  isCorrect: boolean;
  userInput: string;
}

export interface Stats {
  wpm: number;
  accuracy: number;
  mistakes: number;
  totalTyped: number;
  correctWords: number;
  timeRemaining: number;
  wordsCompleted: number;
}

export type SessionDuration = 30 | 60 | 120; // seconds
