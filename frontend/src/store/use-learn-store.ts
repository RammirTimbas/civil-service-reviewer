import { create } from 'zustand'
import { Question, LearningMetadata } from '@/types/question'

export type LearnStep = 'CONCEPT' | 'WORKED_EXAMPLE' | 'ATTEMPT' | 'EXPLANATION' | 'REINFORCEMENT' | 'COMPLETE'

interface LearnState {
  // Session Data
  primaryQuestion: Question | null
  reinforcements: Question[]
  metadata: LearningMetadata | null

  // Progress State
  currentStep: LearnStep
  reinforcementIndex: number
  userAnswer: string | null
  isCorrect: boolean

  // Actions
  startSession: (data: { primary_question: Question; reinforcement_questions: Question[] }) => void
  setStep: (step: LearnStep) => void
  submitAnswer: (answerId: string) => void
  nextReinforcement: () => void
  reset: () => void
}

export const useLearnStore = create<LearnState>((set, get) => ({
  primaryQuestion: null,
  reinforcements: [],
  metadata: null,
  currentStep: 'CONCEPT',
  reinforcementIndex: -1,
  userAnswer: null,
  isCorrect: false,

  startSession: (data) => {
    set({
      primaryQuestion: data.primary_question,
      reinforcements: data.reinforcement_questions,
      metadata: data.primary_question.learning_metadata || null,
      currentStep: 'CONCEPT',
      reinforcementIndex: -1,
      userAnswer: null,
      isCorrect: false
    })
  },

  setStep: (step) => set({ currentStep: step }),

  submitAnswer: (answerId) => {
    const { primaryQuestion, reinforcements, reinforcementIndex } = get()
    const currentQ = reinforcementIndex === -1 ? primaryQuestion : reinforcements[reinforcementIndex]

    if (!currentQ) return

    set({
      userAnswer: answerId,
      isCorrect: answerId === currentQ.correct_answer,
      currentStep: 'EXPLANATION'
    })
  },

  nextReinforcement: () => {
    const { reinforcementIndex, reinforcements } = get()
    if (reinforcementIndex + 1 < reinforcements.length) {
      set({
        reinforcementIndex: reinforcementIndex + 1,
        currentStep: 'ATTEMPT',
        userAnswer: null,
        isCorrect: false
      })
    } else {
      set({ currentStep: 'COMPLETE' })
    }
  },

  reset: () => set({
    primaryQuestion: null,
    reinforcements: [],
    metadata: null,
    currentStep: 'CONCEPT',
    reinforcementIndex: -1,
    userAnswer: null,
    isCorrect: false
  })
}))
