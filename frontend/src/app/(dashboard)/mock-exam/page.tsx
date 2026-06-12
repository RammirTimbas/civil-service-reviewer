'use client'

import { useState, useEffect } from 'react'
import { useMockExam } from '@/hooks/use-questions'
import { QuestionCard } from '@/components/exam/question-card'
import { Button } from '@/components/ui/button'
import { Loader2, Timer, AlertCircle, Trophy, Home, Search } from 'lucide-react'
import { useExamStore } from '@/store/use-exam-store'
import { useRouter } from 'next/navigation'
import api from '@/lib/api-client'
import { cn } from '@/lib/utils'

export default function MockExamPage() {
  const router = useRouter()
  const { data: questions, isLoading, refetch } = useMockExam()
  const {
    currentQuestionIndex,
    nextQuestion,
    prevQuestion,
    startSession,
    userAnswers,
    answerQuestion,
    timeLeft,
    tick,
    isCompleted,
    finishSession,
    resetSession
  } = useExamStore()
  const { currentQuestions } = useExamStore()

  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<{ score: number, total: number } | null>(null)

  const handleStart = () => {
    // If user is not authenticated, fall back to client-side question fetch
    setIsSubmitting(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    console.log('MockExam: starting, token present?', !!token)
    if (!token) {
      // fetch mock questions without creating a server session
      api.get('/questions/mock')
        .then((res) => {
          console.log('MockExam: /questions/mock response', res)
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            startSession(res.data, 'Mock', 60 * 60)
            useExamStore.getState().setSessionId(null)
            setIsStarted(true)
          } else {
            console.warn('MockExam: /questions/mock returned empty or unexpected format', res?.data)
            alert('No questions available for mock exam.')
          }
        })
        .catch((err) => {
          console.error('Failed to load mock questions (unauthenticated)', err)
          alert('Failed to load mock exam. Please try again or sign in.')
        })
        .finally(() => setIsSubmitting(false))
      return
    }

    // Create a server-side exam session and fetch questions when authenticated
    api.post('/exams/start', { type: 'Mock' })
      .then((res) => {
        console.log('MockExam: /exams/start response', res)
        if (res && res.data) {
          const questionsPayload = res.data.questions || res.data
          if (Array.isArray(questionsPayload) && questionsPayload.length > 0) {
            startSession(questionsPayload, 'Mock', 60 * 60)
            useExamStore.getState().setSessionId(res.data.session_id || null)
            setIsStarted(true)
          } else {
            console.warn('MockExam: /exams/start returned no questions; falling back to /questions/mock', res.data)
            // Attempt client-side fetch as a fallback when server session lacks questions
            api.get('/questions/mock')
              .then((r) => {
                console.log('MockExam: fallback /questions/mock response', r)
                if (r && r.data && Array.isArray(r.data) && r.data.length > 0) {
                  startSession(r.data, 'Mock', 60 * 60)
                  useExamStore.getState().setSessionId(res.data.session_id || null)
                  setIsStarted(true)
                } else {
                  alert('No questions available for mock exam.')
                }
              })
              .catch((err) => {
                console.error('MockExam: fallback fetch failed', err)
                alert('Failed to start exam. Please try again later.')
              })
          }
        }
      })
      .catch((err) => {
        if (err?.response) {
          console.error('Failed to start exam', err.response.data)
        } else {
          console.error('Failed to start exam', err)
        }
        alert('Failed to start exam. Please try again.')
      })
      .finally(() => setIsSubmitting(false))
  }

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit the exam?')) return

    setIsSubmitting(true)
    try {
      const response = await api.post('/exams/submit', {
        type: 'Mock',
        answers: userAnswers,
        duration_seconds: 3600 - timeLeft
      })
      setResults(response.data)
      finishSession()
    } catch (error) {
      console.error('Submission failed', error)
      alert('Failed to submit exam. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        tick()
      }, 1000)
    } else if (timeLeft === 0 && isStarted && !isCompleted) {
      handleSubmit()
    }
    return () => clearInterval(timer)
  }, [isStarted, isCompleted, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Timer className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Mock Exam Simulation</h1>
          <p className="text-slate-600">
            Real CSC exam simulation. 1 hour, randomized categories, no hints.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 text-left space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Rules & Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
            <li>Timer starts as soon as you click "Start Exam".</li>
            <li>You can go back and forth between questions.</li>
            <li>Unanswered questions will be marked as incorrect.</li>
          </ul>
        </div>

        <Button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 font-bold"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Start Exam'}
        </Button>
      </div>
    )
  }

  if (isCompleted && results) {
    const percentage = Math.round((results.score / results.total) * 100)

    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12 animate-in fade-in duration-700">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Trophy className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Well Done!</h1>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Score</p>
              <p className="text-5xl font-black text-slate-900">{results.score}<span className="text-slate-300 text-2xl font-normal ml-1">/{results.total}</span></p>
            </div>
            <div className="h-16 w-px bg-slate-100" />
            <div className="text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Accuracy</p>
              <p className={cn(
                "text-5xl font-black",
                percentage >= 80 ? "text-green-500" : percentage >= 50 ? "text-blue-500" : "text-red-500"
              )}>
                {percentage}%
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50">
             <p className="text-slate-600 text-sm">
               {percentage >= 80 ? "Excellent work! You are ready for the real thing." : "Good try! Keep practicing to improve your score."}
             </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => {
                resetSession()
                setIsStarted(false)
                router.push('/dashboard')
            }}
            variant="outline"
            className="flex-1 py-6 rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 rounded-xl">
            <Search className="w-4 h-4 mr-2" />
            Review Answers
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = currentQuestions[currentQuestionIndex]

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">No questions loaded</h1>
          <p className="text-slate-600">Please start the exam to load questions.</p>
        </div>
        <div className="pt-6">
          <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">Start Exam</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-6">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Question</span>
                <span className="font-black text-slate-900">{currentQuestionIndex + 1} / {currentQuestions.length}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Time Remaining</span>
                <span className={cn(
                    "font-mono font-black text-lg tabular-nums",
                    timeLeft < 300 ? "text-red-500 animate-pulse" : "text-blue-600"
                )}>
                    {formatTime(timeLeft)}
                </span>
            </div>
        </div>

        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="rounded-lg h-9"
            >
                Prev
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={nextQuestion}
                disabled={currentQuestionIndex === currentQuestions.length - 1}
                className="rounded-lg h-9"
            >
                Next
            </Button>
            <Button
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg h-9 px-4"
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finish Exam'}
            </Button>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        mode="Mock"
        onAnswer={(index) => answerQuestion(currentQuestion.id, index)}
        selectedAnswer={userAnswers[currentQuestion.id]}
      />

      {/* Progress Bar */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 bg-white rounded-2xl border border-slate-200">
        {currentQuestions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => useExamStore.setState({ currentQuestionIndex: idx })}
            className={cn(
              "h-10 rounded-lg text-xs font-bold border transition-all",
              idx === currentQuestionIndex ? "border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-50" :
              userAnswers[q.id] !== undefined ? "bg-slate-900 border-slate-900 text-white" :
              "border-slate-100 text-slate-300 hover:border-slate-300"
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
