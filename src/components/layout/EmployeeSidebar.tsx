import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, CreditCard, Clock, CalendarDays, TrendingUp, LogOut, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const nav = [
  { to: '/employee-dashboard',            icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { to: '/employee-dashboard/profile',    icon: User,            label: 'My Profile', end: false },
  { to: '/employee-dashboard/payslip',    icon: CreditCard,      label: 'Payslips',   end: false },
  { to: '/employee-dashboard/attendance', icon: Clock,           label: 'Attendance', end: false },
  { to: '/employee-dashboard/leave',      icon: CalendarDays,    label: 'Leaves',     end: false },
]

interface EmployeeSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function EmployeeSidebar({ isOpen, onClose }: EmployeeSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <aside
      className={cn(
        'w-64 md:w-60 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col min-h-screen transition-transform duration-300 ease-in-out z-50',
        'fixed inset-y-0 left-0 md:static',
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Brand Header */}
      <div className="px-5 py-6 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">Employee Portal</span>
        </div>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 md:hidden focus:outline-none transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose} // Close sidebar on selection (mobile)
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-brand-600/15 text-brand-400 border-l-2 border-brand-500 rounded-l-none pl-2.5'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            )}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="p-3 border-t border-zinc-800 space-y-2">
        {user && (
          <div className="px-3 py-2 bg-zinc-950/40 rounded-lg border border-zinc-800/40 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center text-xs font-semibold uppercase">
              {user.username.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-zinc-200 block truncate leading-none">
                {user.username}
              </span>
              <span className="text-[10px] text-zinc-500 block truncate mt-0.5 capitalize">
                {user.role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-150 cursor-pointer text-left focus:outline-none"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
