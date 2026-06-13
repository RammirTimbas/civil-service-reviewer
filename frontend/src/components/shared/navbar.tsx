'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, GraduationCap, LayoutDashboard, Settings, User, Trophy } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Practice', href: '/practice', icon: GraduationCap },
  { name: 'Mock', href: '/mock-exam', icon: Trophy },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navbar - Pro Minimal */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/40 h-11">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[13px] tracking-tight text-slate-800">
              CSC<span className="text-blue-600">Reviewer</span>
            </span>
          </Link>

          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all",
                    isActive
                      ? "text-blue-600 bg-blue-50/50"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
             <button className="text-slate-400 hover:text-slate-600 p-1">
               <Settings className="w-3.5 h-3.5" />
             </button>
             <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer">
               <User className="w-3.5 h-3.5" />
             </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Tight & Modern */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 pb-safe">
        <div className="flex justify-around items-center h-12">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 transition-all flex-1",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              >
                <Icon className={cn("w-4.5 h-4.5", isActive && "scale-105")} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
