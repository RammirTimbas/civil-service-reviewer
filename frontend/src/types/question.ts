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

export interface Concept {
  title: string;
  rule_explanation: string;
  key_points?: string[];
  heuristics?: string[];
}

export interface WorkedExample {
  problem: string;
  solution_steps: string[];
  pattern_recognition_note?: string;
}

export interface LearningMetadata {
  concept: Concept;
  worked_example: WorkedExample;
  guided_hint: string;
  misconception_notes?: string;
  reinforcement_question_ids?: string[];
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
  learning_metadata?: LearningMetadata;
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
