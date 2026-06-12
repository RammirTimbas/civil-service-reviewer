export type Category =
  | 'Verbal Ability'
  | 'Numerical Reasoning'
  | 'Analytical Ability'
  | 'Clerical Operations'
  | 'General Information';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Option {
  id: string; // "A", "B", "C", "D"
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correct_answer: string; // "A", "B", etc.
  category: Category;
  subcategory?: string;
  difficulty: Difficulty;
  hint?: string;
  explanation: string;
  wrong_answer_explanations?: Record<string, string>; // Maps "A", "B", etc. to text
  tags: string[];
  source?: string;
  version?: number;
  metadata?: Record<string, any>;
}

export interface ExamSession {
  id: string;
  type: 'Mock' | 'Practice' | 'Learn';
  status: 'active' | 'completed' | 'abandoned';
  startTime: string;
  endTime?: string;
  questions: Question[];
  userAnswers: Record<string, string>; // questionId -> optionId ("A", "B", etc.)
  score?: number;
}
