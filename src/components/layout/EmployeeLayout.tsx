import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { EmployeeSidebar } from './EmployeeSidebar'
import { Toaster } from 'react-hot-toast'
import { Menu, TrendingUp } from 'lucide-react'

export function EmployeeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Mobile Top Navigation Header */}
      <header className="flex md:hidden items-center justify-between px-5 py-4 bg-zinc-900 border-b border-zinc-800 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">Employee Portal</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 focus:outline-none transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <EmployeeSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content viewport */}
      <main className="flex-1 overflow-auto bg-zinc-950 relative min-w-0">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
        
        {/* Nested route content */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a',
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  )
}
