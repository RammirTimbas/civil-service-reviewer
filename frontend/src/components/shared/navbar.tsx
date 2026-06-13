'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, GraduationCap, LayoutDashboard, User, Trophy } from 'lucide-react'

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
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
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
             <div className="h-4 w-px bg-slate-200 mx-1" />
             <Link
               href="/settings"
               className={cn(
                 "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                 pathname === '/settings'
                   ? "bg-blue-50/80 text-blue-600 shadow-sm"
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               )}
             >
               <User className="w-3.5 h-3.5" />
             </Link>
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

          <Link
            href="/settings"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 transition-all flex-1",
              pathname === '/settings' ? "text-blue-600" : "text-slate-400"
            )}
          >
            <User className={cn("w-4.5 h-4.5", pathname === '/settings' && "scale-105")} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
