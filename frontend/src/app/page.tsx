'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            CSC<span className="text-blue-600">Reviewer</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#stats" className="hover:text-blue-600 transition-colors">Methodology</Link>
          <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          <Link href="/register">
            <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-md">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="w-3.5 h-3.5 fill-blue-700" />
            Empowering Future Public Servants
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            The Intelligent Way to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Pass the Civil Service Exam
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
            A comprehensive, data-driven learning platform built specifically for the Philippine Civil Service Exam. Master the patterns, track your growth, and secure your future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-200 transition-all hover:translate-y-[-2px]">
                Start Free Review
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-slate-200 text-lg font-bold hover:bg-slate-50 transition-all">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const features = [
  {
    title: 'Adaptive Learn Mode',
    desc: 'Intelligent explanations that explain why wrong answers are wrong, reinforcing deep conceptual understanding.',
    icon: BookOpen,
    color: 'blue'
  },
  {
    title: 'CSC Exam Simulation',
    desc: 'Simulate the real pressure with timed mock exams following actual Philippine CSC category distributions.',
    icon: Target,
    color: 'indigo'
  },
  {
    title: 'Advanced Analytics',
    desc: 'Identify weak spots instantly. Our dashboard tracks accuracy, streaks, and category-specific progress.',
    icon: Trophy,
    color: 'emerald'
  }
]

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Precision Engineering for Success</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Every feature is designed around established learning science and the specific patterns of past examinations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                f.color === 'blue' ? "bg-blue-100 text-blue-600" :
                f.color === 'indigo' ? "bg-indigo-100 text-indigo-600" :
                "bg-emerald-100 text-emerald-600"
              )}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section id="stats" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">Built on the Pillars of <br /><span className="text-blue-400">Public Service Excellence</span></h2>
            <div className="space-y-6">
              {[
                { title: 'Data-Driven Preparation', desc: 'Content updated to match latest Philippine CSC patterns.' },
                { title: 'Secure & Reliable', desc: 'Enterprise-grade authentication and data protection.' },
                { title: 'Mobile-First Design', desc: 'Study anytime, anywhere on any device.' }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-[2.5rem] shadow-2xl">
            <div className="bg-slate-900 rounded-[2.2rem] p-8 md:p-12 space-y-8">
              <div className="text-center">
                <p className="text-5xl font-black text-white mb-2">94%</p>
                <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">Satisfaction Rate</p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">5k+</p>
                  <p className="text-slate-500 text-xs mt-1">Practice Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">10k+</p>
                  <p className="text-slate-500 text-xs mt-1">Active Reviewees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">Ready to secure your Eligibility?</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto relative z-10">Join thousands of successful examinees who prepared with the most advanced platform in the Philippines.</p>
        <Link href="/register" className="relative z-10">
          <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-blue-600 hover:bg-slate-50 text-xl font-bold transition-transform hover:scale-105">
            Get Started for Free
          </Button>
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">C</div>
            <span>CSC Reviewer</span>
          </div>
          <p className="text-slate-500 max-w-xs leading-relaxed">Dedicated to elevating the standard of civil service in the Philippines through intelligent education.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-slate-900">Platform</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link href="/learn" className="hover:text-blue-600 transition-colors">Learn Mode</Link></li>
            <li><Link href="/practice" className="hover:text-blue-600 transition-colors">Practice Mode</Link></li>
            <li><Link href="/mock-exam" className="hover:text-blue-600 transition-colors">Mock Exam</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-slate-900">Support</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Resources</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-50 flex justify-between items-center">
        <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">© 2024 CSC Reviewer Philippines. All rights reserved.</p>
      </div>
    </footer>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
