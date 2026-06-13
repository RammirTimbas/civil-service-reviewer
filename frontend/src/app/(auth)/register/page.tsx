'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2, Mail, Lock, User, GraduationCap, ArrowRight, ShieldCheck, Zap, BookOpen, Sparkles } from 'lucide-react'
import api from '@/lib/api-client'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* Left Column: Pro Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]"
          />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-md w-full">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Join the Elite
            </div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Your Career in <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Public Service Starts.</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">Get the competitive edge with our data-driven reviewer platform.</p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, text: 'Verified Question Banks', color: 'text-emerald-400' },
              { icon: Zap, text: 'Adaptive Study Algorithms', color: 'text-blue-400' },
              { icon: BookOpen, text: 'Comprehensive Coverage', color: 'text-amber-400' }
            ].map((item, i) => (
              <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + (i * 0.1) }} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-sm shadow-sm">
                <div className={`w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-slate-200 font-bold text-xs">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Column: Centered Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50/50">
        <div className="w-full max-w-[360px] flex flex-col justify-center h-full">
          <div className="text-center lg:text-left mb-4 space-y-1">
            <Link href="/" className="inline-flex items-center gap-2 group mb-1">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900">CSC<span className="text-blue-600">Reviewer</span></span>
            </Link>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-[12px] text-slate-500 font-medium italic">Join thousands of successful reviewees.</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-elegant space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-2 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black rounded-xl text-center uppercase tracking-widest">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-2.5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="text" required className="w-full pl-11 pr-4 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" placeholder="Juan dela Cruz" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="email" required className="w-full pl-11 pr-4 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" placeholder="name@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="password" required className="w-full pl-11 pr-4 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="password" required className="w-full pl-11 pr-4 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-premium mt-2 transition-transform active:scale-95">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Account"}
              </Button>
            </form>
          </motion.div>

          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">
            Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
