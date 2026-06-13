'use client'

import { useEffect } from 'react'
import { useQuestions } from '@/hooks/use-questions'
import { QuestionCard } from '@/components/exam/question-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2, BookOpen, X } from 'lucide-react'
import { useExamStore } from '@/store/use-exam-store'
import Link from 'next/link'

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
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600/80" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">No questions found</h2>
        <p className="text-xs text-slate-500 mb-6">We couldn't find any questions for this category.</p>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold">Return to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const hasAnswered = !!userAnswers[currentQuestion.id]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-120px)] md:min-h-0">
      {/* Tightened Progress Header */}
      <div className="sticky top-14 md:top-14 z-30 bg-slate-50/80 backdrop-blur-sm py-3 mb-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Module: Verbal Ability
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
           </div>
           <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
           </Link>
        </div>
        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pb-20 md:pb-6">
        <QuestionCard
          question={currentQuestion}
          mode="Learn"
          onAnswer={(index) => answerQuestion(currentQuestion.id, index)}
          showFeedback={hasAnswered}
          selectedAnswer={userAnswers[currentQuestion.id]}
        />
      </div>

      {/* Compact Navigation Controls */}
      <div className="fixed bottom-14 left-0 right-0 md:relative md:bottom-auto bg-white/90 backdrop-blur-md border-t border-slate-100 p-3 md:bg-transparent md:border-0 md:p-0 md:mt-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="h-9 px-4 rounded-lg font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 text-xs"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="hidden sm:flex items-center gap-1">
             {questions.slice(0, 10).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentQuestionIndex ? 'bg-blue-600' : 'bg-slate-200'}`} />
             ))}
          </div>

          <Button
            onClick={nextQuestion}
            disabled={!hasAnswered || currentQuestionIndex === questions.length - 1}
            className="h-9 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-soft disabled:opacity-50"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
