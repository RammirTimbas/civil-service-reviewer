import { Navbar } from '@/components/shared/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-4 md:pt-20 pb-20 md:pb-10">
        {children}
      </main>
    </div>
  )
}
