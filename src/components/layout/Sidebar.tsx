import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Upload, TrendingUp, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const nav = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users,           label: 'Employees' },
  { to: '/upload',    icon: Upload,          label: 'Upload'    },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-60 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col min-h-screen">
      <div className="px-5 py-6 flex items-center gap-2.5 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="font-semibold text-white text-sm">HR Payroll</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-brand-600/15 text-brand-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            )}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
      </nav>
      
      {/* User profile & Logout at the bottom */}
      <div className="p-3 border-t border-zinc-800 space-y-2">
        {user && (
          <div className="px-3 py-1.5 text-xs text-zinc-500 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
            <span className="truncate">Active: {user.username}</span>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 transition-colors cursor-pointer text-left focus:outline-none"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}