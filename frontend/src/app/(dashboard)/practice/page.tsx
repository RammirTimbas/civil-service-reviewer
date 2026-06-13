'use client'

import { useState, useEffect } from 'react'
import { useQuestions } from '@/hooks/use-questions'
import { QuestionCard } from '@/components/exam/question-card'
import { Button } from '@/components/ui/button'
import { Loader2, GraduationCap, RotateCcw, ArrowRight, X, Filter } from 'lucide-react'
import { useExamStore } from '@/store/use-exam-store'
import api from '@/lib/api-client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PracticeModePage() {
  const [category, setCategory] = useState<string | undefined>()
  const [showFilters, setShowFilters] = useState(false)
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

  const handleAnswer = async (index: string) => {
    const question = questions![currentQuestionIndex]
    answerQuestion(question.id, index)

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
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600/70" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generating practice set...</p>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">No questions found</h2>
        <p className="text-xs text-slate-500 mb-6">Try selecting a different category or refresh.</p>
        <div className="flex justify-center gap-3">
            <Button onClick={() => refetch()} variant="outline" size="sm" className="rounded-lg text-xs font-bold">
                <RotateCcw className="w-3.5 h-3.5 mr-2" /> Refresh
            </Button>
            <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-lg text-xs font-bold">Return Home</Button>
            </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = userAnswers[currentQuestion.id]
  const hasAnswered = selectedAnswer !== undefined
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-120px)] md:min-h-0">
      {/* Tightened Header */}
      <div className="sticky top-14 md:top-14 z-30 bg-slate-50/80 backdrop-blur-sm py-3 mb-2">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Practice Session
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
           </div>
           <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    showFilters ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"
                )}
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
              <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </Link>
           </div>
        </div>

        {showFilters && (
            <div className="bg-white border border-slate-200/60 rounded-xl p-3 mb-3 shadow-soft animate-in slide-in-from-top-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Filter by Category</p>
                <div className="flex flex-wrap gap-1.5">
                    {['', 'Verbal Ability', 'Numerical Reasoning', 'Analytical Ability', 'General Info'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setCategory(cat || undefined)
                                setShowFilters(false)
                            }}
                            className={cn(
                                "text-[10px] px-2.5 py-1 rounded-md border font-bold transition-all",
                                (category === cat || (!category && cat === ''))
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
                            )}
                        >
                            {cat || 'All'}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(79,70,229,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20 md:pb-6">
        <QuestionCard
          question={currentQuestion}
          mode="Practice"
          onAnswer={handleAnswer}
          showFeedback={hasAnswered}
          selectedAnswer={selectedAnswer}
        />
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-14 left-0 right-0 md:relative md:bottom-auto bg-white/90 backdrop-blur-md border-t border-slate-100 p-3 md:bg-transparent md:border-0 md:p-0 md:mt-4">
        <div className="max-w-xl mx-auto flex items-center justify-end gap-3">
          {hasAnswered && currentQuestionIndex < questions.length - 1 && (
            <Button
              onClick={nextQuestion}
              className="h-9 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-soft w-full sm:w-auto"
            >
              Next Question
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          )}

          {hasAnswered && currentQuestionIndex === questions.length - 1 && (
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="h-9 px-6 rounded-lg border-slate-200 text-xs font-bold w-full sm:w-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              Practice Again
            </Button>
          )}

          {!hasAnswered && (
             <div className="w-full text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">
                Select an answer to continue
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
