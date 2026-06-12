import { create } from 'zustand';
import { Question } from '@/types/question';

interface ExamState {
  currentQuestions: Question[];
  sessionId?: string | null;
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  isCompleted: boolean;
  timeLeft: number; // in seconds
  mode: 'Learn' | 'Practice' | 'Mock' | null;

  startSession: (questions: Question[], mode: 'Learn' | 'Practice' | 'Mock', duration?: number) => void;
  setSessionId: (id: string | null) => void;
  answerQuestion: (questionId: string, answerIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishSession: () => void;
  resetSession: () => void;
  tick: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  currentQuestions: [],
  sessionId: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  isCompleted: false,
  timeLeft: 0,
  mode: null,

  startSession: (questions, mode, duration = 0) => set({
    currentQuestions: questions,
    mode,
    currentQuestionIndex: 0,
    userAnswers: {},
    isCompleted: false,
    timeLeft: duration,
  }),

  setSessionId: (id) => set({ sessionId: id }),

  answerQuestion: (questionId, answerIndex) => set((state) => ({
    userAnswers: { ...state.userAnswers, [questionId]: answerIndex }
  })),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.currentQuestions.length - 1)
  })),

  prevQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
  })),

  finishSession: () => set({ isCompleted: true }),

  resetSession: () => set({
    currentQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    isCompleted: false,
    timeLeft: 0,
    mode: null
  }),

  tick: () => set((state) => ({
    timeLeft: Math.max(state.timeLeft - 1, 0)
  })),
}));
