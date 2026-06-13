'use client'

import { useState } from 'react'
import { Question } from '@/types/question'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Lightbulb, Info } from 'lucide-react'

interface QuestionCardProps {
  question: Question
  mode: 'Learn' | 'Practice' | 'Mock'
  onAnswer?: (id: string) => void
  showFeedback?: boolean
  selectedAnswer?: string | null
}

export function QuestionCard({
  question,
  mode,
  onAnswer,
  showFeedback = false,
  selectedAnswer = null
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false)

  const handleOptionClick = (id: string) => {
    if (!showFeedback && onAnswer) {
      onAnswer(id)
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-soft border border-slate-200/50 overflow-hidden flex flex-col">
      {/* Ultra-compact Header */}
      <div className="px-3 py-1.5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider">
            {question.category}
          </span>
          <span className={cn(
            "text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-wider",
            question.difficulty === 'easy' ? "text-emerald-600" :
            question.difficulty === 'medium' ? "text-amber-600" :
            "text-rose-600"
          )}>
            {question.difficulty}
          </span>
        </div>
        {question.hint && mode !== 'Mock' && !showFeedback && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
          >
            <Lightbulb className={cn("w-3 h-3", showHint && "fill-blue-500 text-blue-500")} />
          </button>
        )}
      </div>

      <div className="p-3 md:p-4 space-y-3 flex-1">
        {/* Question Text - Smaller but readable */}
        <div className="text-[14px] md:text-[15px] font-bold text-slate-800 leading-normal">
          {question.text}
        </div>

        {/* Options - Tight Grid */}
        <div className="grid gap-1.5">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id
            const isCorrect = option.id === question.correct_answer

            let optionStyles = "border-slate-100 bg-slate-50/30 hover:border-blue-200"

            if (showFeedback) {
              if (isCorrect) {
                optionStyles = "border-emerald-200 bg-emerald-50/40"
              } else if (isSelected && !isCorrect) {
                optionStyles = "border-rose-200 bg-rose-50/40"
              } else {
                optionStyles = "border-slate-50 opacity-40"
              }
            } else if (isSelected) {
              optionStyles = "border-blue-500 bg-blue-50/50"
            }

            return (
              <button
                key={option.id}
                disabled={showFeedback}
                onClick={() => handleOptionClick(option.id)}
                className={cn(
                  "group relative flex items-center gap-2.5 p-2 rounded-md border-[1.5px] text-left transition-all",
                  optionStyles
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[9px] font-black border transition-colors",
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-400 border-slate-200 group-hover:border-blue-300 group-hover:text-blue-500"
                )}>
                  {option.id}
                </div>

                <span className={cn(
                  "text-[12px] md:text-[13px] font-semibold leading-tight flex-1",
                  isSelected ? "text-blue-900" : "text-slate-600"
                )}>
                  {option.text}
                </span>

                {showFeedback && isCorrect && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                {showFeedback && isSelected && !isCorrect && <XCircle className="w-3 h-3 text-rose-500 shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Feedback Section - Very Tight */}
        {showFeedback && mode !== 'Mock' && (
          <div className="mt-1 pt-2 border-t border-slate-100">
            <div className="bg-slate-50/50 rounded-md p-2.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-black text-[9px] uppercase tracking-wider">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                Explanation
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {question.explanation}
              </p>

              {selectedAnswer && selectedAnswer !== question.correct_answer && question.wrong_answer_explanations?.[selectedAnswer] && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-200/40">
                  <div className="text-rose-700 font-black text-[8px] uppercase tracking-widest mb-0.5">
                    Choice {selectedAnswer} Insight
                  </div>
                  <p className="text-[10px] text-slate-500 italic leading-snug font-medium">
                    {question.wrong_answer_explanations[selectedAnswer]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showHint && question.hint && !showFeedback && (
          <div className="p-2 bg-blue-50/30 border border-blue-100/50 rounded-md text-[11px] text-blue-800 italic animate-in slide-in-from-top-1">
             <span className="font-bold uppercase text-[8px] mr-1">Hint:</span> {question.hint}
          </div>
        )}
      </div>
    </div>
  )
}
