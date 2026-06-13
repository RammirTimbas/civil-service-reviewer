'use client'

import { useState, useEffect } from 'react'
import { QuestionCard } from '@/components/exam/question-card'
import { Button } from '@/components/ui/button'
import { Loader2, Timer, AlertCircle, Trophy, Home, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useExamStore } from '@/store/use-exam-store'
import { useRouter } from 'next/navigation'
import api from '@/lib/api-client'
import { useAuthStore } from '@/store/use-auth-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MockExamPage() {
  const router = useRouter()
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
    resetSession,
    currentQuestions
  } = useExamStore()

  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<{ score: number, total: number } | null>(null)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleStart = () => {
    setIsSubmitting(true)
    if (!user) {
      api.get('/questions/mock')
        .then((res) => {
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            startSession(res.data, 'Mock', 60 * 60)
            setIsStarted(true)
          }
        })
        .catch(() => alert('Failed to load mock exam.'))
        .finally(() => setIsSubmitting(false))
      return
    }

    api.post('/exams/start', { type: 'Mock' })
      .then((res) => {
        console.log('exams/start response', res?.data)
        if (res && res.data) {
          const questionsPayload = res.data.questions || res.data
          if (Array.isArray(questionsPayload) && questionsPayload.length > 0) {
            startSession(questionsPayload, 'Mock', 60 * 60)
            setIsStarted(true)
          }
        }
      })
      .catch((err) => {
        console.error('Failed to start exam', err)
        const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Failed to start exam.'
        alert(msg)
      })
      .finally(() => setIsSubmitting(false))
  }

  const handleSubmit = async () => {
    if (!confirm('Submit exam?')) return
    setIsSubmitting(true)
    if (!user) {
      setIsSubmitting(false)
      if (confirm('You must be signed in to submit exam results. Sign in now?')) {
        router.push('/(auth)/login')
      }
      return
    }

    try {
      const response = await api.post('/exams/submit', {
        type: 'Mock',
        answers: userAnswers,
        duration_seconds: 3600 - timeLeft
      })
      setResults(response.data)
      finishSession()
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('Session expired or unauthorized. Please sign in again.')
        await logout()
        router.push('/(auth)/login')
        return
      }
      alert('Submission failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => tick(), 1000)
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
      <div className="max-w-md mx-auto py-10 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Timer className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mock Exam</h1>
            <p className="text-xs text-slate-500 font-medium">Full simulation under real conditions.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft text-left space-y-4">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Guidelines
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Time Limit', desc: '60 minutes total.', icon: Timer },
                { title: 'Navigation', desc: 'Jump between questions.', icon: Search },
                { title: 'Final Review', desc: 'Explanations hidden during test.', icon: X }
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <item.icon className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 leading-none mb-1">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl text-sm bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-soft transition-transform active:scale-95"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Begin Simulation'}
          </Button>
          <Link href="/dashboard" className="block text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
             Maybe Later
          </Link>
        </motion.div>
      </div>
    )
  }

  if (isCompleted && results) {
    const percentage = Math.round((results.score / results.total) * 100)
    return (
      <div className="max-w-md mx-auto py-10 px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <div className="space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-soft rotate-3">
              <Trophy className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Complete!</h1>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-6">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Score</p>
                <p className="text-3xl font-bold text-slate-900">{results.score}<span className="text-slate-200 text-xl">/{results.total}</span></p>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div className="text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Result</p>
                <p className={cn("text-3xl font-bold", percentage >= 80 ? "text-emerald-500" : "text-blue-500")}>
                  {percentage}%
                </p>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed px-2">
               {percentage >= 80 ? "Exceptional work! You're ready." : "Solid effort. Keep practicing your weak areas."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" onClick={() => { resetSession(); setIsStarted(false); router.push('/dashboard'); }} className="h-11 rounded-xl font-bold text-xs border-slate-200">
              <Home className="w-3.5 h-3.5 mr-2" /> Dashboard
            </Button>
            <Button size="sm" className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-soft">
              <Search className="w-3.5 h-3.5 mr-2" /> Review
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = currentQuestions[currentQuestionIndex]
  if (!currentQuestion) return null

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-120px)] md:min-h-0">
      <div className="sticky top-14 md:top-14 z-40 bg-slate-50/90 backdrop-blur-md py-3 mb-2">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Progress</span>
                    <span className="font-bold text-slate-900 leading-none text-xs">{currentQuestionIndex + 1} / {currentQuestions.length}</span>
                </div>
                <div className="h-7 w-px bg-slate-200" />
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Time</span>
                    <span className={cn("font-mono font-bold text-xs tabular-nums leading-none", timeLeft < 300 ? "text-rose-500" : "text-blue-600")}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>
            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg h-8 px-4 text-[10px] uppercase tracking-wider" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : 'Submit Exam'}
            </Button>
        </div>
      </div>

      <div className="flex-1 pb-20 md:pb-6">
        <QuestionCard question={currentQuestion} mode="Mock" onAnswer={(idx) => answerQuestion(currentQuestion.id, idx)} selectedAnswer={userAnswers[currentQuestion.id]} />

        {/* Compact Navigation Grid */}
        <div className="mt-6 flex flex-wrap gap-1.5 justify-center">
          {currentQuestions.map((q, idx) => (
            <button key={q.id} onClick={() => useExamStore.setState({ currentQuestionIndex: idx })} className={cn(
              "w-7 h-7 rounded-md text-[9px] font-bold border transition-all",
              idx === currentQuestionIndex ? "border-blue-600 bg-blue-50 text-blue-600" : userAnswers[q.id] !== undefined ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-300"
            )}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 md:relative md:bottom-auto bg-white/90 backdrop-blur-md border-t border-slate-100 p-3 md:bg-transparent md:border-0 md:p-0 md:mt-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={prevQuestion} disabled={currentQuestionIndex === 0} className="h-9 px-4 rounded-lg font-bold text-slate-500 text-xs">
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
          </Button>
          <Button onClick={nextQuestion} disabled={currentQuestionIndex === currentQuestions.length - 1} className="h-9 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-soft flex-1 sm:flex-none">
            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
