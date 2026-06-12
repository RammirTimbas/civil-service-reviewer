'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api-client'
import { QuestionCard } from '@/components/exam/question-card'
import { Button } from '@/components/ui/button'
import { Loader2, ChevronLeft, CheckCircle2, XCircle, Info } from 'lucide-react'
import { Question } from '@/types/question'
import { cn } from '@/lib/utils'

interface SessionData {
  id: string
  score: number
  total_questions: number
  answers: Record<string, number>
  questions: Record<string, Question>
  type: string
  completed_at: string
}

export default function ExamReviewPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const { data: session, isLoading } = useQuery({
    queryKey: ['exam-session', sessionId],
    queryFn: async () => {
      const { data } = await api.get<SessionData>(`/exams/session/${sessionId}`)
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!session) return <div>Session not found</div>

  const questionList = Object.values(session.questions)

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Results
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-slate-900">Exam Review</h1>
          <p className="text-sm text-slate-500">{new Date(session.completed_at).toLocaleDateString()} • {session.type}</p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-around">
        <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</p>
            <p className="text-3xl font-black text-slate-900">{session.score} / {session.total_questions}</p>
        </div>
        <div className="h-10 w-px bg-slate-100" />
        <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Result</p>
            <p className={cn(
                "text-3xl font-black",
                (session.score / session.total_questions) >= 0.8 ? "text-green-600" : "text-amber-600"
            )}>
                {Math.round((session.score / session.total_questions) * 100)}%
            </p>
        </div>
      </div>

      <div className="space-y-12">
        {questionList.map((question, index) => {
          const selectedAnswer = session.answers[question.id]
          const isCorrect = selectedAnswer === question.correct_answer

          return (
            <div key={question.id} className="space-y-4">
              <div className="flex items-center gap-2 ml-2">
                <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                {isCorrect ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 text-sm font-bold bg-red-50 px-2 py-0.5 rounded-full">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
              </div>
              <QuestionCard
                question={question}
                mode="Learn" // Use Learn mode to show full explanations
                selectedAnswer={selectedAnswer}
                showFeedback={true}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
