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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          {question.category}
        </span>
        <span className={cn(
          "text-xs font-semibold px-2 py-1 rounded uppercase",
          question.difficulty === 'easy' ? "bg-green-100 text-green-700" :
          question.difficulty === 'medium' ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        )}>
          {question.difficulty}
        </span>
      </div>

      <div className="text-lg font-medium text-slate-900 leading-relaxed">
        {question.text}
      </div>

      <div className="grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id
          const isCorrect = option.id === question.correct_answer

          let optionStyles = "border-slate-200 hover:border-blue-400 hover:bg-blue-50"

          if (showFeedback) {
            if (isCorrect) {
              optionStyles = "border-green-500 bg-green-50"
            } else if (isSelected && !isCorrect) {
              optionStyles = "border-red-500 bg-red-50"
            } else {
              optionStyles = "border-slate-200 opacity-60"
            }
          } else if (isSelected) {
            optionStyles = "border-blue-500 bg-blue-50"
          }

          return (
            <button
              key={option.id}
              disabled={showFeedback}
              onClick={() => handleOptionClick(option.id)}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all duration-200 group",
                optionStyles
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border",
                  isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-slate-50 text-slate-500 border-slate-200"
                )}>
                  {option.id}
                </span>
                <span className={cn(
                  "font-medium",
                  isSelected ? "text-blue-900" : "text-slate-700"
                )}>
                  {option.text}
                </span>
              </span>

              {showFeedback && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
            </button>
          )
        })}
      </div>

      {/* Learn/Practice Mode UI */}
      {mode !== 'Mock' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {question.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}
          </div>

          {showHint && question.hint && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <span className="font-bold flex items-center gap-2 mb-1">
                <Info className="w-4 h-4" /> Hint:
              </span>
              {question.hint}
            </div>
          )}

          {showFeedback && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Explanation
                </h4>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {question.explanation}
                </div>

                {selectedAnswer && selectedAnswer !== question.correct_answer && question.wrong_answer_explanations?.[selectedAnswer] && (
                   <div className="mt-4 pt-4 border-t border-slate-200">
                      <h4 className="font-bold text-red-700 text-xs uppercase tracking-wider mb-2">Why choice {selectedAnswer} was incorrect:</h4>
                      <p className="text-sm text-slate-600 italic">
                        {question.wrong_answer_explanations[selectedAnswer]}
                      </p>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
