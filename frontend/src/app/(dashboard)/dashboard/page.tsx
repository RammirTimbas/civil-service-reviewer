'use client'

import { BookOpen, GraduationCap, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Overall Accuracy', value: '78%', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Questions Solved', value: '124', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Current Streak', value: '5 Days', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100' },
]

const categories = [
  { name: 'Verbal Ability', progress: 65 },
  { name: 'Numerical Reasoning', progress: 40 },
  { name: 'Analytical Ability', progress: 55 },
  { name: 'General Information', progress: 30 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, Reviewee!</h1>
        <p className="text-slate-500">Track your progress and keep up the great work.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Progress */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Category Progress</h2>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{cat.name}</span>
                  <span className="text-slate-500">{cat.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/learn"
              className="p-6 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors group"
            >
              <BookOpen className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg">Learn Mode</h3>
              <p className="text-blue-100 text-sm">Study with explanations and hints.</p>
            </Link>
            <Link
              href="/practice"
              className="p-6 bg-white border-2 border-slate-200 text-slate-900 rounded-xl hover:border-blue-400 transition-colors group"
            >
              <GraduationCap className="w-8 h-8 mb-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg">Practice Mode</h3>
              <p className="text-slate-500 text-sm">Test your knowledge with instant feedback.</p>
            </Link>
          </div>

          <Link
            href="/mock-exam"
            className="block p-6 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 transition-colors text-center"
          >
            <h3 className="font-bold text-lg">Start Mock Exam</h3>
            <p className="text-slate-400 text-sm">Simulate the real CSC exam conditions.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
