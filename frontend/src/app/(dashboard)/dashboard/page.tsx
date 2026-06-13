'use client'

import { BookOpen, GraduationCap, Trophy, Zap, ArrowRight, Target, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Avg. Accuracy', value: '78%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Solved', value: '124', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Streak', value: '5d', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
]

const categories = [
  { name: 'Verbal Ability', progress: 65 },
  { name: 'Numerical Reasoning', progress: 40 },
  { name: 'Analytical Ability', progress: 55 },
  { name: 'General Info', progress: 30 },
]

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-10 px-2">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-[11px] font-medium leading-none">Your progress is looking good!</p>
        </div>
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
           <Clock className="w-3 h-3 text-slate-400" />
           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Exam: Aug 11</span>
        </div>
      </header>

      {/* Very Compact Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label}
            className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3"
          >
            <div className={`w-7 h-7 rounded-md ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{stat.label}</p>
              <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Category mastery section - now more compact */}
        <div className="md:col-span-7 space-y-3">
          <section className="bg-white rounded-lg border border-slate-100 shadow-sm p-3.5">
            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              Progress per Category
            </h2>

            <div className="grid grid-cols-1 gap-2.5">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                    <span className="text-slate-600">{cat.name}</span>
                    <span className="text-blue-600">{cat.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.progress}%` }}
                      transition={{ duration: 1 }}
                      className="bg-blue-500 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-lg p-3.5 text-white flex items-center justify-between overflow-hidden relative">
             <div className="relative z-10 space-y-2">
                <p className="text-[11px] font-medium leading-snug">Increase your score in <span className="text-blue-400 font-bold">Numerical Reasoning</span> to improve your ranking.</p>
                <Link href="/practice">
                  <Button size="sm" className="h-6 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-bold uppercase tracking-wider">
                    Quick Practice
                  </Button>
                </Link>
             </div>
             <Target className="w-12 h-12 text-white/5 -rotate-12 absolute -right-2 -bottom-2" />
          </section>
        </div>

        {/* Action modules - now more like menu items */}
        <div className="md:col-span-5 flex flex-col gap-2">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Quick Start</h2>
          {[
            { title: 'Learn Mode', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Conceptual Study', href: '/learn' },
            { title: 'Practice Mode', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Adaptive Sets', href: '/practice' },
            { title: 'Mock Exam', icon: Trophy, color: 'text-rose-600', bg: 'bg-rose-50', sub: 'Simulate Conditions', href: '/mock-exam' }
          ].map((mode) => (
            <Link
              key={mode.title}
              href={mode.href}
              className="flex items-center gap-3 p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-blue-200 transition-all group"
            >
              <div className={`w-8 h-8 ${mode.bg} rounded flex items-center justify-center ${mode.color} shrink-0`}>
                <mode.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-[11px] leading-none mb-0.5">{mode.title}</h3>
                <p className="text-[9px] text-slate-400 uppercase tracking-tighter truncate">{mode.sub}</p>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
