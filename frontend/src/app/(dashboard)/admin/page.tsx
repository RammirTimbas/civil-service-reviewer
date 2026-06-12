'use client'

import { useState } from 'react'
import { useQuestions } from '@/hooks/use-questions'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Upload,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: questions, isLoading } = useQuestions()

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Question Management</h1>
          <p className="text-slate-500 text-sm">Create, edit, and manage your examination database.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Upload className="w-4 h-4" />
            Bulk Import
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Questions', value: questions?.length || 0, color: 'text-blue-600' },
          { label: 'Verbal Ability', value: questions?.filter(q => q.category === 'Verbal Ability').length || 0, color: 'text-emerald-600' },
          { label: 'Numerical', value: questions?.filter(q => q.category === 'Numerical Reasoning').length || 0, color: 'text-amber-600' },
          { label: 'Difficulty: Hard', value: questions?.filter(q => q.difficulty === 'Hard').length || 0, color: 'text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 text-slate-600">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Question</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Difficulty</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : questions?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No questions found.
                  </td>
                </tr>
              ) : (
                questions?.map((question) => (
                  <tr key={question.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {question.text}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {question.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 px-2 py-1 bg-slate-100 rounded">
                        {question.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                        question.difficulty === 'Easy' ? "text-emerald-600 bg-emerald-50" :
                        question.difficulty === 'Medium' ? "text-amber-600 bg-amber-50" :
                        "text-red-600 bg-red-50"
                      )}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {questions?.length || 0} questions</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
