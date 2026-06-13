'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/use-auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Shield, LogOut, Bell, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type Tab = 'profile' | 'security' | 'notifications'

export default function SettingsPage() {
  const { user, setAuth, logout } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [name, setName] = useState(user?.name || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setStatus(null)
    try {
      await api.put('/users/me', { name })
      if (user) {
        setAuth({ ...user, name }, localStorage.getItem('token') || '')
      }
      setStatus({ type: 'success', message: 'Profile updated successfully!' })
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update profile.' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <header className="px-1">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Account & Preferences</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-1">
          <div className="bg-white rounded-xl border border-slate-200/60 p-1.5 shadow-sm space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all text-left",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all mt-4 border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-elegant p-6 md:p-8 space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Profile Information</h2>
                  <p className="text-xs text-slate-500 font-medium">Update your public profile details.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Email</Label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-slate-50/80 text-slate-500 cursor-not-allowed border-slate-200 font-bold h-10"
                    />
                    <p className="text-[9px] text-slate-400 font-medium italic ml-1">Email cannot be changed for security reasons.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Juan dela Cruz"
                      className="border-slate-200 focus:ring-4 focus:ring-blue-500/10 h-10 font-bold"
                    />
                  </div>

                  {status && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "p-3 rounded-xl flex items-center gap-3",
                        status.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                      )}
                    >
                      {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span className="text-[11px] font-black uppercase tracking-wider">{status.message}</span>
                    </motion.div>
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-elegant p-6 md:p-8 space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Security Settings</h2>
                  <p className="text-xs text-slate-500 font-medium">Keep your account secure.</p>
                </div>

                <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-2">
                  <Shield className="w-8 h-8 text-slate-200 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password updates coming soon</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-elegant p-6 md:p-8 space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Notification Center</h2>
                  <p className="text-xs text-slate-500 font-medium">Manage how you receive alerts.</p>
                </div>

                <div className="space-y-3">
                  {['Study Reminders', 'Exam Date Alerts', 'Performance Reports'].map((pref) => (
                    <div key={pref} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{pref}</span>
                      <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
