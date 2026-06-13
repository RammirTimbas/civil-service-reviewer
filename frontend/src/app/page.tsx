'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/40 h-12">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:rotate-2">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900">
            CSC<span className="text-blue-600">Reviewer</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          </div>
          <Link href="/register">
            <Button size="sm" className="h-7 px-4 bg-blue-600 hover:bg-blue-700 font-bold text-[10px] uppercase tracking-wider rounded-md">
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 fill-blue-600" />
            Empowering Public Servants
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-5">
            The Intelligent Path to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Civil Service Eligibility
            </span>
          </h1>
          <p className="max-w-lg mx-auto text-[14px] md:text-[16px] text-slate-500 font-medium leading-relaxed mb-8">
            Adaptive study tools, real-time analytics, and high-yield question banks designed specifically for the Philippine CSC Exam.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/register">
              <Button className="h-10 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95">
                Start Free Review
                <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="h-10 px-6 rounded-lg text-slate-600 text-xs font-bold uppercase tracking-wider">
                Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { title: 'Adaptive Learn Mode', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Concept-focused study with instant explanations.' },
    { title: 'Exam Simulations', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Timed mock exams following official CSC blueprints.' },
    { title: 'Performance Tracking', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Detailed analytics to identify and fix weak spots.' }
  ]

  return (
    <section id="features" className="py-12 bg-slate-50 border-t border-slate-200/40">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm-flat group"
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105", f.bg, f.color)}>
                <f.icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2 leading-none">{f.title}</h3>
              <p className="text-slate-500 text-[12px] font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[9px] font-bold">C</div>
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">CSC Reviewer Philippines</span>
        </div>
        <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Link href="#" className="hover:text-blue-600">Privacy</Link>
           <Link href="#" className="hover:text-blue-600">Terms</Link>
           <Link href="#" className="hover:text-blue-600">Support</Link>
        </div>
      </div>
    </footer>
  )
}
