'use client'

import {
  BookOpen,
  GraduationCap,
  Trophy,
  Zap,
  ArrowRight,
  Target,
  Clock,
  Star,
  ChevronRight,
  Medal,
  Filter,
  Loader2,
  TrendingUp,
  Layout,
  Sparkles,
  ZapIcon,
  Crown,
  History,
  Activity,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import api from '@/lib/api-client'
import { useAuthStore } from '@/store/use-auth-store'
import { cn } from '@/lib/utils'

const LEADERBOARD_CATEGORIES = [
  { id: 'all', name: 'Overall' },
  { id: 'Verbal Ability', name: 'Verbal' },
  { id: 'Numerical Reasoning', name: 'Numerical' },
  { id: 'Analytical Ability', name: 'Analytical' },
  { id: 'Clerical Operations', name: 'Clerical' },
  { id: 'General Information', name: 'General' },
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [stats, setStats] = useState<any[]>([])
  const [categoryProgress, setCategoryProgress] = useState<any[]>([])
  const [leaders, setLeaders] = useState<any[]>([])
  const [myRank, setMyRank] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)
  const [examSchedule, setExamSchedule] = useState<any | null>(null)

  useEffect(() => {
    // 1. Fetch Global Stats
    api.get('/users/stats')
      .then((res) => {
        const d = res.data
        setStats([
          { label: 'Mastery', value: (d.overall_accuracy ?? 0) + '%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Solved', value: (d.questions_solved ?? 0).toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Streak', value: (d.study_streak ?? 0) + 'd', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
        ])
      })
      .catch(console.error)

    // 2. Fetch Category Breakdown
    api.get('/progress/stats')
      .then((res) => {
        setCategoryProgress(res.data)
      })
      .catch(console.error)

    // 3. Fetch exam schedule
    api.get('/exams/schedule')
      .then((res) => setExamSchedule(res.data))
      .catch(() => setExamSchedule(null))
  }, [user])

  // 3. Fetch Leaderboard based on filter
  useEffect(() => {
    setLoadingLeaderboard(true)
    const categoryParam = selectedCategory === 'all' ? '' : `&category=${encodeURIComponent(selectedCategory)}`
    api.get(`/users/leaderboard?metric=total_correct&limit=5${categoryParam}`)
      .then((res) => {
        setLeaders(res.data.leaders || [])
        setMyRank({ rank: res.data.my_rank, value: res.data.my_value })
      })
      .catch(console.error)
      .finally(() => setLoadingLeaderboard(false))
  }, [selectedCategory])

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 px-4 pt-8 bg-slate-50/30 min-h-screen">

      {/* --- HERO SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-600/10 text-[8px] font-black text-blue-600 uppercase tracking-widest rounded-full border border-blue-600/20">
              Candidate ID: {user?.id?.slice(-6).toUpperCase() || '6X7892'}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Welcome back, <br />
            <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Scholar'}</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-sm leading-tight">
            Outperforming <span className="text-slate-900 font-bold">82% of candidates</span>.
          </p>
        </motion.div>

        {/* Global Performance Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
           <div className="bg-slate-900 text-white p-4 rounded-[1.5rem] shadow-lg flex flex-col justify-between h-[110px] w-[150px] relative overflow-hidden group">
              <div className="z-10">
                <Clock className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Exam Date</p>
                <p className="text-lg font-black tracking-tight leading-none">{examSchedule ? examSchedule.readable : 'TBD'}</p>
              </div>
              <p className="z-10 text-[8px] font-bold text-blue-400 uppercase tracking-tighter">
                {examSchedule ? (
                  examSchedule.status === 'upcoming' ? `${examSchedule.days_left} Days Left` : (
                    examSchedule.status === 'today' ? 'Today' : 'Passed'
                  )
                ) : 'Not set'}
              </p>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
           </div>

           <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-md shadow-slate-200/30 flex flex-col justify-between h-[110px] w-[150px]">
              <div className="flex justify-between items-start">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <div className="flex items-center text-emerald-600 font-black text-[9px]">
                  <ChevronUp className="w-2 h-2" /> 12%
                </div>
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Performance</p>
                <p className="text-lg font-black text-slate-900 tracking-tight leading-none">Top 15%</p>
              </div>
           </div>
        </motion.div>
      </div>

      {/* --- QUICK START --- */}
      <section className="space-y-3">
        <h2 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
           <ZapIcon className="w-3 h-3 text-amber-500 fill-amber-500" />
           Quick Start
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: 'Learn', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Concept mastery.', href: '/learn' },
            { title: 'Practice', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Adaptive sets.', href: '/practice' },
            { title: 'Mock Exam', icon: Trophy, color: 'text-rose-600', bg: 'bg-rose-50', desc: 'Timed simulation.', href: '/mock-exam' },
          ].map((mode) => (
            <Link
              key={mode.title}
              href={mode.href}
              className="group relative flex items-center gap-3 p-4 bg-white border border-slate-200/50 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform", mode.bg, mode.color)}>
                <mode.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-sm leading-none mb-0.5">{mode.title}</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{mode.desc}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* --- DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN (7/12) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-start gap-2 shadow-sm">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Skill Proficiency */}
          <section className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 px-1">
               <h2 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  Skill Proficiency
               </h2>
               <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
               </div>
            </div>

            <div className="grid grid-cols-1 gap-y-5">
              {categoryProgress.length === 0 ? (
                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">No data recorded</p>
                </div>
              ) : (
                categoryProgress.map((cat, idx) => (
                  <div key={cat._id || idx} className="space-y-2">
                    <div className="flex justify-between items-end px-0.5">
                      <div>
                        <p className="text-xs font-black text-slate-800 tracking-tight leading-none mb-0.5">{cat._id || 'General'}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">{cat.total} Attempts</p>
                      </div>
                      <div className="text-right">
                         <p className="text-base font-black text-blue-600 tracking-tighter leading-none">{Math.round((cat.correct / cat.total) * 100)}%</p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cat.correct / cat.total) * 100}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.1 }}
                        className={cn(
                          "h-full rounded-full",
                          (cat.correct / cat.total) > 0.8 ? "bg-emerald-500" :
                          (cat.correct / cat.total) > 0.5 ? "bg-blue-600" : "bg-amber-500"
                        )}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Tactical Advantage Banner */}
          <section className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg">
             <div className="relative z-10 space-y-4 max-w-[90%]">
                <div className="flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-blue-400" />
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Tactical Advantage</span>
                </div>
                <h3 className="text-xl font-black leading-tight tracking-tight">
                   Optimize <span className="text-blue-500 italic">Verbal Analogies</span>.
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-snug">
                   Accuracy peaking. Master the 'Functional Relationships' model to cement this strength.
                </p>
                <div className="pt-1">
                   <Button size="sm" className="h-8 bg-white text-slate-900 hover:bg-slate-100 rounded-lg px-4 font-black uppercase text-[9px] tracking-widest transition-transform hover:scale-105">
                      Execute
                   </Button>
                </div>
             </div>
             <Target className="absolute -top-4 -right-4 w-24 h-24 text-white/5 -rotate-12" />
          </section>
        </div>

        {/* RIGHT COLUMN: LEADERBOARD (5/12) */}
        <div className="lg:col-span-5 h-full">
          <section className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-lg flex flex-col h-full sticky top-20 overflow-hidden">

            {/* Header Area */}
            <div className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100">
               <div className="flex items-center justify-between mb-6">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2 tracking-tighter leading-none">
                       <Crown className="w-5 h-5 text-amber-500" />
                       Leaderboard
                    </h3>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Candidate Rankings</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors shadow-sm cursor-pointer group">
                    <Filter className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
               </div>

               {/* Filters */}
               <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                  {LEADERBOARD_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[8px] font-black whitespace-nowrap transition-all uppercase tracking-widest border",
                        selectedCategory === cat.id
                          ? "bg-slate-900 text-white border-slate-900 scale-105"
                          : "bg-white text-slate-400 hover:bg-slate-100 border-slate-200"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
               </div>
            </div>

            {/* List Area */}
            <div className="flex-1 p-4 space-y-2 min-h-[380px]">
              <AnimatePresence mode="wait">
                {loadingLeaderboard ? (
                  <div className="h-full flex flex-col items-center justify-center py-16 space-y-3">
                     <Loader2 className="w-6 h-6 animate-spin text-blue-100" />
                     <p className="text-[8px] font-black text-slate-200 uppercase tracking-[0.3em]">Syncing Standings</p>
                  </div>
                ) : (
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    {leaders.map((l, i) => (
                      <div
                        key={l.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-2xl transition-all relative group border",
                          l.id === user?.id
                            ? "bg-blue-50 border-blue-200 ring-1 ring-blue-100/50 shadow-sm"
                            : "bg-white border-slate-50 hover:border-blue-100 hover:shadow-md"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 relative z-10">
                          {/* Rank Indicator */}
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0",
                            i === 0 ? "bg-amber-100 text-amber-600" :
                            i === 1 ? "bg-slate-100 text-slate-500" :
                            i === 2 ? "bg-orange-100 text-orange-600" :
                            "bg-slate-50 text-slate-400"
                          )}>
                            {i + 1}
                          </div>

                          {/* Profile Avatar */}
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-50 p-0.5 overflow-hidden shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${l.name}`} alt={l.name} className="w-full h-full object-cover rounded-md" />
                          </div>

                          <div className="min-w-0">
                            <p className={cn("text-xs font-black truncate tracking-tight leading-tight", "text-slate-800")}>{l.name} {l.id === user?.id && "(You)"}</p>
                            <p className={cn("text-[8px] font-bold uppercase tracking-widest leading-none mt-0.5", "text-slate-400")}>
                               {Math.round(l.value)} <span className="text-[7px]">XP</span>
                            </p>
                          </div>
                        </div>

                        {i < 3 && <Medal className={cn("w-5 h-5", i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : "text-orange-400")} />}
                        {l.id === user?.id && <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-full" />}
                      </div>
                    ))}
                    {leaders.length === 0 && (
                      <div className="text-center py-20 opacity-20">
                         <Trophy className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                         <p className="text-[8px] font-black uppercase tracking-widest">No Data Points</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* STICKY "YOU" STANDING - COMPACT PREMIUM DESIGN */}
            {myRank && (
              <div className="p-3 bg-blue-600 text-white border-t border-blue-500/30 relative group overflow-hidden shadow-[0_-8px_30px_rgba(37,99,235,0.25)]">
                <div className="flex items-center justify-between relative z-10 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500 border border-white/10">
                      <span className="text-[8px] font-black opacity-60 leading-none mb-0.5 uppercase">Rank</span>
                      <span className="text-lg font-black leading-none italic">#{myRank.rank}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-[8px] font-black text-blue-100 uppercase tracking-widest leading-none">Your Standing</p>
                        <Sparkles className="w-2 h-2 text-white animate-pulse" />
                      </div>
                      <p className="text-xs font-black tracking-tight leading-none truncate">Top 15% Elite Scholar</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-1 mb-1">
                      <span className="text-xl font-black tabular-nums tracking-tighter text-white leading-none">{Math.round(myRank.value)}</span>
                      <span className="text-[8px] font-bold text-blue-200 uppercase tracking-widest leading-none">XP</span>
                    </div>
                    <div className="h-1 w-12 bg-white/20 rounded-full overflow-hidden ml-auto">
                       <div className="h-full w-[78%] bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </div>
                  </div>
                </div>
                {/* Visual Flair */}
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-1000" />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
