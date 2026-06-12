import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { LogOut, User, CreditCard, Clock, CalendarDays, Sparkles, AlertTriangle, Copy, Check } from 'lucide-react'
import { EmployeeProfile } from './EmployeeProfile'
import { EmployeePayslip } from './EmployeePayslip'
import { EmployeeAttendance } from './EmployeeAttendance'
import { EmployeeLeave } from './EmployeeLeave'
import toast, { Toaster } from 'react-hot-toast'
import { useMyPayslips } from '@/hooks/useEmployees'

type ViewType = 'menu' | 'profile' | 'payslip' | 'attendance' | 'leave'

export function EmployeeDashboard() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState<ViewType>('menu')
  const [showExitModal, setShowExitModal] = useState(false)

  const { data: payslips, isLoading } = useMyPayslips()

  const [copiedName, setCopiedName] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  const activePayslip = payslips?.[0]
  const fullName = activePayslip 
    ? `${activePayslip.first_name || ''} ${activePayslip.last_name || ''}`.trim() 
    : user?.username || 'Employee'
  const empId = activePayslip?.employee_id || `EMP-${String(user?.user_id ?? 101).padStart(3, '0')}`

  const copyToClipboardFallback = (text: string, onSuccess: () => void) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      const successful = document.execCommand('copy')
      if (successful) {
        onSuccess()
        toast.success('Copied to clipboard!')
      } else {
        toast.error('Unable to copy')
      }
    } catch (err) {
      console.error('Fallback copy failed:', err)
      toast.error('Unable to copy')
    }
    document.body.removeChild(textarea)
  }

  const handleCopyName = () => {
    if (!fullName) return
    const onSuccess = () => {
      setCopiedName(true)
      toast.success('Name copied to clipboard!')
      setTimeout(() => setCopiedName(false), 2000)
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullName)
        .then(onSuccess)
        .catch(() => copyToClipboardFallback(fullName, onSuccess))
    } else {
      copyToClipboardFallback(fullName, onSuccess)
    }
  }

  const handleCopyId = () => {
    if (!empId) return
    const onSuccess = () => {
      setCopiedId(true)
      toast.success('Employee ID copied to clipboard!')
      setTimeout(() => setCopiedId(false), 2000)
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(empId)
        .then(onSuccess)
        .catch(() => copyToClipboardFallback(empId, onSuccess))
    } else {
      copyToClipboardFallback(empId, onSuccess)
    }
  }

  // Configure initial history state
  useEffect(() => {
    window.history.replaceState({ view: 'exit-trap' }, '')
    window.history.pushState({ view: 'menu' }, '')
  }, [])

  const navigateToView = (view: ViewType) => {
    setActiveView(view)
    window.history.pushState({ view }, '')
  }

  const handleBackToMenu = () => {
    window.history.back()
  }

  // Intercept the browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { view?: ViewType | 'exit-trap' } | null
      const targetView = state?.view || 'menu'

      if (targetView === 'exit-trap') {
        // User pressed back on the main menu -> show the exit confirmation modal
        setShowExitModal(true)
        // Re-push menu state to block the browser from leaving the site
        window.history.pushState({ view: 'menu' }, '')
      } else {
        // Go back/forward to the target view (e.g. 'menu')
        setActiveView(targetView as ViewType)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Render the selected sub-page component
  const renderActiveView = () => {
    switch (activeView) {
      case 'profile':
        return <EmployeeProfile onBack={handleBackToMenu} />
      case 'payslip':
        return <EmployeePayslip onBack={handleBackToMenu} />
      case 'attendance':
        return <EmployeeAttendance onBack={handleBackToMenu} />
      case 'leave':
        return <EmployeeLeave onBack={handleBackToMenu} />
      default:
        return null
    }
  }

  if (activeView !== 'menu') {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 relative font-sans print:min-h-0 print:bg-white print:p-0 print:m-0">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none print:hidden" />
        
        <div className="relative z-10 print:p-0 print:m-0">
          {renderActiveView()}
        </div>
        
        <div className="print:hidden">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                borderRadius: '12px',
              },
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden select-none">
      {/* Background radial gradients in shadcn style */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.08),rgba(255,255,255,0))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full relative z-10 space-y-8 text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-2xl px-5 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600/10 text-brand-600 flex items-center justify-center border border-brand-500/20">
              <Sparkles size={16} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-bold">Logged In</span>
              <span className="text-xs font-semibold text-zinc-800 block truncate leading-none mt-0.5">{user?.username}</span>
            </div>
          </div>
          <button
            onClick={() => setShowExitModal(true)}
            title="Sign Out"
            className="p-2 bg-zinc-50 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-600 rounded-xl transition-all duration-200 border border-zinc-200 cursor-pointer active:scale-95"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Big Greeting */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Welcome!</h1>
          <p className="text-xs text-zinc-500">Access your employee payroll and dashboard actions</p>
        </div>

        {/* Profile Quick Info (Click to copy name / ID) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-2.5 max-w-[288px] sm:max-w-xs mx-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-2 py-1">
              <div className="h-4 bg-zinc-200 rounded w-2/3 mx-auto"></div>
              <div className="h-3 bg-zinc-200 rounded w-1/3 mx-auto"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Full Name Row */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-zinc-50/50 transition-all">
                <div className="min-w-0 text-left">
                  <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">Full Name</span>
                  <span className="text-sm font-bold text-zinc-800 block truncate">
                    {fullName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyName}
                  title="Copy Name"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer select-none active:scale-95 shrink-0 ml-3 ${
                    copiedName
                      ? 'bg-emerald-500 text-white border border-emerald-500'
                      : 'bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-650 border border-zinc-200'
                  }`}
                >
                  {copiedName ? (
                    <>
                      <Check size={10} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Employee ID Row */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-zinc-50/50 transition-all">
                <div className="min-w-0 text-left">
                  <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">Employee ID</span>
                  <span className="text-xs font-mono font-bold text-zinc-650 block truncate">
                    {empId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Employee ID"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer select-none active:scale-95 shrink-0 ml-3 ${
                    copiedId
                      ? 'bg-emerald-500 text-white border border-emerald-500'
                      : 'bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-650 border border-zinc-200'
                  }`}
                >
                  {copiedId ? (
                    <>
                      <Check size={10} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2x2 Launch Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-[288px] sm:max-w-xs mx-auto">
          
          {/* Profile Card */}
          <button
            onClick={() => navigateToView('profile')}
            title="Profile"
            className="aspect-square rounded-2xl bg-indigo-50/30 hover:bg-indigo-50/80 border border-indigo-100/80 hover:border-indigo-300 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:shadow-lg hover:shadow-indigo-500/5 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <User size={32} className="text-indigo-500 group-hover:text-indigo-650 transition-all duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-bold text-indigo-500 group-hover:text-indigo-700 uppercase tracking-widest mt-1">Profile</span>
          </button>

          {/* Payslip Card */}
          <button
            onClick={() => navigateToView('payslip')}
            title="Payslips"
            className="aspect-square rounded-2xl bg-emerald-50/30 hover:bg-emerald-50/80 border border-emerald-100/80 hover:border-emerald-300 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:shadow-lg hover:shadow-emerald-500/5 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CreditCard size={32} className="text-emerald-500 group-hover:text-emerald-650 transition-all duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-bold text-emerald-500 group-hover:text-emerald-700 uppercase tracking-widest mt-1">Payslips</span>
          </button>

          {/* Attendance Card */}
          <button
            onClick={() => navigateToView('attendance')}
            title="Attendance"
            className="aspect-square rounded-2xl bg-amber-50/30 hover:bg-amber-50/80 border border-amber-100/80 hover:border-amber-300 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:shadow-lg hover:shadow-amber-500/5 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Clock size={32} className="text-amber-500 group-hover:text-amber-650 transition-all duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-bold text-amber-500 group-hover:text-amber-700 uppercase tracking-widest mt-1">Attendance</span>
          </button>

          {/* Leave Card */}
          <button
            onClick={() => navigateToView('leave')}
            title="Leaves"
            className="aspect-square rounded-2xl bg-sky-50/30 hover:bg-sky-50/80 border border-sky-100/80 hover:border-sky-300 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:shadow-lg hover:shadow-sky-500/5 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/0 via-transparent to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CalendarDays size={32} className="text-sky-500 group-hover:text-sky-650 transition-all duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-bold text-sky-500 group-hover:text-sky-700 uppercase tracking-widest mt-1">Leaves</span>
          </button>

        </div>

        {/* Footer */}
        <div className="text-[10px] text-zinc-400 font-mono">
          HR Management Portal v1.0.0
        </div>

      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with premium blur */}
          <div 
            className="fixed inset-0 bg-zinc-900/45 backdrop-blur-[3px] transition-opacity duration-200"
            onClick={() => setShowExitModal(false)}
          />
          
          {/* Modal Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
              <AlertTriangle size={24} />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-zinc-950">Exit Portal?</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Are you sure you want to exit the employee portal? You will be signed out of your session.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl text-xs transition-all border border-zinc-200 cursor-pointer active:scale-98"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false)
                  logout()
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-550 active:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer active:scale-98"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  )
}
