'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, GraduationCap, LayoutDashboard, Settings, User } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Practice', href: '/practice', icon: GraduationCap },
  { name: 'Mock Exam', href: '/mock-exam', icon: GraduationCap },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:top-0 md:bottom-auto md:border-t-0 md:border-b h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 font-bold text-xl text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">C</div>
          <span>CSC Reviewer</span>
        </Link>

        <div className="flex flex-1 justify-around md:justify-center md:gap-8 h-full">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 h-full text-xs md:text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600 border-t-2 md:border-t-0 md:border-b-2 border-blue-600"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-slate-900">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </nav>
  )
}
