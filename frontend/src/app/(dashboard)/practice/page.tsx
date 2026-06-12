'use client'

import { useState, useEffect } from 'react'
import { useQuestions } from '@/hooks/use-questions'
import { QuestionCard } from '@/components/exam/question-card'
import { Button } from '@/components/ui/button'
import { Loader2, GraduationCap, RotateCcw, ArrowRight } from 'lucide-react'
import { useExamStore } from '@/store/use-exam-store'
import api from '@/lib/api-client'

export default function PracticeModePage() {
  const [category, setCategory] = useState<string | undefined>()
  const { data: questions, isLoading, refetch } = useQuestions(category)
  const {
    currentQuestionIndex,
    nextQuestion,
    startSession,
    userAnswers,
    answerQuestion,
    resetSession
  } = useExamStore()

  useEffect(() => {
    if (questions && questions.length > 0) {
      startSession(questions, 'Practice')
    }
    return () => resetSession()
  }, [questions, startSession, resetSession])

  const handleAnswer = async (index: number) => {
    const question = questions![currentQuestionIndex]
    answerQuestion(question.id, index)

    // Track progress on the backend
    try {
      await api.post('/progress/track', {
        question_id: question.id,
        is_correct: index === question.correct_answer,
        mode: 'Practice'
      })
    } catch (error) {
      console.error('Failed to track progress', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No questions available</h3>
        <p className="text-slate-500 mb-6">Try selecting a different category or refresh.</p>
        <Button onClick={() => refetch()} variant="outline">Refresh</Button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = userAnswers[currentQuestion.id]
  const hasAnswered = selectedAnswer !== undefined

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-slate-900 hidden sm:block">Practice Mode</h1>
        </div>

        <div className="flex items-center gap-4">
          <select
            className="text-sm border-slate-200 rounded-md bg-slate-50 px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
            value={category || ''}
            onChange={(e) => setCategory(e.target.value || undefined)}
          >
            <option value="">All Categories</option>
            <option value="Verbal Ability">Verbal Ability</option>
            <option value="Numerical Reasoning">Numerical Reasoning</option>
            <option value="Analytical Ability">Analytical Ability</option>
          </select>

          <div className="h-8 w-px bg-slate-200" />

          <span className="text-sm font-bold text-indigo-600">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        mode="Practice"
        onAnswer={handleAnswer}
        showFeedback={hasAnswered}
        selectedAnswer={selectedAnswer}
      />

      <div className="flex justify-end gap-3">
        {hasAnswered && currentQuestionIndex < questions.length - 1 && (
          <Button
            onClick={nextQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 flex gap-2 items-center animate-in slide-in-from-right-4"
          >
            Next Question
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {hasAnswered && currentQuestionIndex === questions.length - 1 && (
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex gap-2 items-center"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Practice
          </Button>
        )}
      </div>
    </div>
  )
}
