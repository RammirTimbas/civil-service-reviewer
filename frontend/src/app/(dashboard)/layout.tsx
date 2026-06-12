import { Navbar } from '@/components/shared/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-4 md:pt-24 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
