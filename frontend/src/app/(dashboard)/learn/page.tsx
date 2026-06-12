'use client'

import { useState, useEffect } from 'react'
import { useQuestions } from '@/hooks/use-questions'
import { QuestionCard } from '@/components/exam/question-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react'
import { useExamStore } from '@/store/use-exam-store'

export default function LearnModePage() {
  const { data: questions, isLoading } = useQuestions()
  const {
    currentQuestionIndex,
    nextQuestion,
    prevQuestion,
    startSession,
    userAnswers,
    answerQuestion
  } = useExamStore()

  useEffect(() => {
    if (questions && questions.length > 0) {
      startSession(questions, 'Learn')
    }
  }, [questions, startSession])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No questions found. Check back later!</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const hasAnswered = !!userAnswers[currentQuestion.id]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">Learn Mode</h1>
            <p className="text-xs text-slate-600">Study each question with detailed explanations.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            Progress: {currentQuestionIndex + 1} / {questions.length}
          </span>
          <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        mode="Learn"
        onAnswer={(index) => answerQuestion(currentQuestion.id, index)}
        showFeedback={hasAnswered}
        selectedAnswer={userAnswers[currentQuestion.id]}
      />

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="hidden sm:flex gap-1">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentQuestionIndex ? 'bg-blue-600' :
                userAnswers[questions[idx].id] !== undefined ? 'bg-green-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
