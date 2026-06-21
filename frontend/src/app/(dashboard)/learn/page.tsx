'use client'

import { useEffect, useState } from 'react'
import { useLearnStore, LearnStep } from '@/store/use-learn-store'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Loader2,
  X,
  Target,
  AlertCircle,
  ArrowLeft,
  Trophy,
  LayoutGrid,
  Sparkles
} from 'lucide-react'
import api from '@/lib/api-client'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { QuestionCard } from '@/components/exam/question-card'

type CategoryName = 'Verbal Ability' | 'Numerical Reasoning' | 'Analytical Ability' | 'Clerical Operations' | 'General Information';

interface Topic {
  name: string;
  display_title: string;
  count: number;
}

export default function LearnModePage() {
  const {
    currentStep,
    metadata,
    primaryQuestion,
    reinforcements,
    reinforcementIndex,
    startSession,
    setStep,
    submitAnswer,
    userAnswer,
    nextReinforcement,
    reset
  } = useLearnStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null)
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<string | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [loadingTopics, setLoadingTopics] = useState(false)

  const categories: { name: CategoryName; value: string; icon: any; color: string }[] = [
    { name: 'Verbal Ability', value: 'Verbal', icon: BookOpen, color: 'text-blue-600' },
    { name: 'Numerical Reasoning', value: 'Numerical', icon: Target, color: 'text-emerald-600' },
    { name: 'Analytical Ability', value: 'Analytical', icon: Lightbulb, color: 'text-purple-600' },
    { name: 'Clerical Operations', value: 'Clerical', icon: LayoutGrid, color: 'text-orange-600' },
    { name: 'General Information', value: 'General Information', icon: Sparkles, color: 'text-amber-600' },
  ]

  // Reset store when component unmounts
  useEffect(() => {
    return () => reset()
  }, [reset])

  const fetchTopics = async (categoryValue: string) => {
    try {
      setLoadingTopics(true)
      const response = await api.get(`/learn/topics?category=${encodeURIComponent(categoryValue)}`)
      setTopics(response.data)
    } catch (err) {
      console.error('Failed to load topics', err)
    } finally {
      setLoadingTopics(false)
    }
  }

  const startLearningTopic = async (topicName: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/learn/session?category=${encodeURIComponent(selectedCategoryValue || '')}&subcategory=${encodeURIComponent(topicName)}`)
      startSession(response.data)
    } catch (err) {
      console.error('Failed to load learn session', err)
      setError('Could not start this module. Please try another topic.')
    } finally {
      setLoading(false)
    }
  }

  // 1. Category Selection View
  if (!selectedCategory && !primaryQuestion) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">What do you want to learn?</h1>
          <p className="text-sm text-slate-500 font-medium">Select a category to see available mental models.</p>
        </div>

        <div className="grid gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { setSelectedCategory(cat.name); setSelectedCategoryValue(cat.value); fetchTopics(cat.value) }}
              className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform", cat.color)}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{cat.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master core concepts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // 2. Topic Selection View
  if (selectedCategory && !primaryQuestion && !loading) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h2 className="font-black text-slate-900">{selectedCategory} Topics</h2>
        </div>

        {loadingTopics ? (
          <div className="flex h-[30vh] items-center justify-center">
             <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No modules found yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {topics.map((topic) => (
              <button
                key={topic.name}
                onClick={() => startLearningTopic(topic.name)}
                className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 shadow-sm text-left group transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                    {topic.display_title || topic.name}
                  </h3>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {topic.count} {topic.count === 1 ? 'Module' : 'Modules'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Deep-dive into the core patterns and heuristics of {topic.name.toLowerCase()}.
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600/70" />
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Building Learning Module...</p>
      </div>
    )
  }

  if (error || !primaryQuestion || !metadata) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Module Unavailable</h2>
        <p className="text-xs text-slate-500 mb-6">{error || "Check back soon for new content."}</p>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg font-bold"
          onClick={() => {
            setError(null);
            setSelectedCategory(null);
            reset();
          }}
        >
          Try Another Category
        </Button>
      </div>
    )
  }

  const stepIndex = getStepIndex(currentStep)

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-120px)] md:min-h-0 space-y-4">
      {/* Step-Based Progress Header */}
      <div className="sticky top-11 md:top-11 z-30 bg-slate-50/90 backdrop-blur-sm py-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
              "bg-blue-600 text-white shadow-sm"
            )}>
              STEP {stepIndex}: {currentStep.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-bold text-slate-500 truncate max-w-[200px]">
              {metadata.concept.title}
            </span>
          </div>
          <button onClick={() => reset()} className="text-slate-300 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${(stepIndex / 5) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STATE 1: CONCEPT LAYER */}
        {currentStep === 'CONCEPT' && (
          <motion.div
            key="concept"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm overflow-hidden">
              <div className="bg-slate-900 p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center">
                      <BookOpen className="w-3 h-3 text-blue-400" />
                   </div>
                   <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Essential Theory</h2>
                </div>
                <p className="text-lg font-bold leading-tight tracking-tight">{metadata.concept.rule_explanation}</p>
              </div>
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-3">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Key Principles</h3>
                    <ul className="space-y-2">
                      {metadata.concept.key_points?.map((point, i) => (
                        <li key={i} className="flex gap-3 text-xs font-semibold text-slate-600 leading-normal bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Pattern Mastery</h3>
                    <div className="grid gap-2">
                      {metadata.concept.heuristics?.map((h, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-[12px] font-medium text-slate-700 leading-snug">
                          <Target className="w-4 h-4 text-blue-500 shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setStep('WORKED_EXAMPLE')}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl group active:scale-[0.98] transition-all"
            >
              Examine Worked Example
              <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}

        {/* STATE 2: WORKED EXAMPLE */}
        {currentStep === 'WORKED_EXAMPLE' && (
          <motion.div
            key="worked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm p-5 space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-widest">Expert Solution Path</h2>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Solved Case</p>
                <p className="text-base font-bold text-slate-800 leading-tight">{metadata.worked_example.problem}</p>
              </div>

              <div className="space-y-3">
                {metadata.worked_example.solution_steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-[13px] font-semibold text-slate-600 leading-snug">{step}</p>
                  </div>
                ))}
              </div>

              {metadata.worked_example.pattern_recognition_note && (
                <div className="p-3 bg-blue-50 border border-blue-100/50 rounded-xl flex gap-3 items-center">
                  <Target className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-[11px] font-bold text-blue-700">
                    Strategy: <span className="font-medium text-blue-600">{metadata.worked_example.pattern_recognition_note}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
               <Button onClick={() => setStep('CONCEPT')} variant="ghost" className="h-11 px-6 rounded-xl font-bold text-slate-400 text-[10px] uppercase tracking-widest">
                 <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back
               </Button>
               <Button
                onClick={() => setStep('ATTEMPT')}
                className="flex-1 h-11 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-[0.98] transition-all"
               >
                Try Guided Question
               </Button>
            </div>
          </motion.div>
        )}

        {/* STATE 3 & 4: GUIDED QUESTION & DEEP EXPLANATION */}
        {(currentStep === 'ATTEMPT' || currentStep === 'EXPLANATION') && (
          <motion.div
            key="attempt"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Rule Reminder Overlay - Always visible during interaction */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-lg flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">
                Rule Reminder: <span className="text-slate-300 font-medium normal-case ml-1">{metadata.concept.rule_explanation}</span>
              </p>
            </div>

            <QuestionCard
              question={reinforcementIndex === -1 ? primaryQuestion : reinforcements[reinforcementIndex]}
              mode="Learn"
              onAnswer={(id) => submitAnswer(id)}
              showFeedback={currentStep === 'EXPLANATION'}
              selectedAnswer={userAnswer}
            />

            {currentStep === 'ATTEMPT' && (
              <div className="p-3 bg-amber-50/30 border border-amber-100/50 rounded-xl text-[11px] text-amber-800 italic flex gap-3 animate-in fade-in slide-in-from-top-1">
                 <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                 <p><span className="font-bold uppercase text-[9px] mr-1 not-italic">Coach Hint:</span>
                 {reinforcementIndex === -1 ? metadata.guided_hint : "Apply the same logic as the solved case."}</p>
              </div>
            )}

            {currentStep === 'EXPLANATION' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {metadata.misconception_notes && reinforcementIndex === -1 && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl space-y-1.5 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <X className="w-3.5 h-3.5" /> Common Trap
                    </h4>
                    <p className="text-xs font-medium leading-tight">{metadata.misconception_notes}</p>
                  </div>
                )}

                <Button
                  onClick={nextReinforcement}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-[0.98] transition-all"
                >
                  {reinforcementIndex < reinforcements.length - 1 ? "Reinforce Concept" : "Finish Module"}
                  <ChevronRight className="ml-1.5 w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STATE 5: COMPLETE */}
        {currentStep === 'COMPLETE' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-6"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-sm rotate-3 border border-emerald-200">
                <Trophy className="w-8 h-8" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-emerald-400/20 rounded-full blur-xl"
              />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mental Model Built!</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {metadata.concept.title}
              </p>
              <p className="text-xs text-slate-500 font-medium px-8 leading-relaxed mt-4">
                You've successfully mastered this concept. Repetition and pattern recognition are your best tools for the Civil Service Exam.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 max-w-[280px] mx-auto pt-4">
              <Button onClick={() => {
                reset();
                startLearningTopic(primaryQuestion.subcategory || "");
              }} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-[0.98]">
                Start Next Concept
              </Button>
              <Button
                onClick={() => {
                  reset();
                  setSelectedCategory(null);
                }}
                variant="outline"
                className="w-full h-11 rounded-xl font-bold uppercase text-[10px] tracking-widest border-slate-200 text-slate-500 hover:text-slate-700"
              >
                Change Topic
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for bottom layout comfort */}
      <div className="h-12" />
    </div>
  )
}

function getStepIndex(step: LearnStep): number {
  switch(step) {
    case 'CONCEPT': return 1
    case 'WORKED_EXAMPLE': return 2
    case 'ATTEMPT': return 3
    case 'EXPLANATION': return 4
    case 'REINFORCEMENT':
    case 'COMPLETE': return 5
    default: return 1
  }
}
