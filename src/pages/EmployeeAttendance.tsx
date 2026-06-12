import { useState, useEffect } from 'react'
import { Clock, CheckCircle, Coffee, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface AttendanceLog {
  date: string
  clockIn: string
  clockOut: string | null
  hours: number | null
  status: 'On Time' | 'Late' | 'Half Day' | 'Absent'
}

export function EmployeeAttendance({ onBack }: { onBack: () => void }) {
  const [time, setTime] = useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [activeLog, setActiveLog] = useState<{ clockIn: string; date: string } | null>(null)
  
  // Historical logs
  const [logs, setLogs] = useState<AttendanceLog[]>([
    { date: '2026-06-10', clockIn: '08:58 AM', clockOut: '06:05 PM', hours: 9.1, status: 'On Time' },
    { date: '2026-06-09', clockIn: '09:12 AM', clockOut: '06:15 PM', hours: 9.05, status: 'Late' },
    { date: '2026-06-08', clockIn: '08:45 AM', clockOut: '06:00 PM', hours: 9.25, status: 'On Time' },
    { date: '2026-06-05', clockIn: '08:52 AM', clockOut: '05:58 PM', hours: 9.1, status: 'On Time' },
    { date: '2026-06-04', clockIn: '09:05 AM', clockOut: '06:02 PM', hours: 8.95, status: 'Late' },
  ])

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load check-in state from localStorage
  useEffect(() => {
    const cachedState = localStorage.getItem('hr_attendance_state')
    if (cachedState) {
      const parsed = JSON.parse(cachedState)
      setIsCheckedIn(parsed.isCheckedIn)
      setActiveLog(parsed.activeLog)
    }
  }, [])

  const handleToggleClock = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const dateStr = now.toISOString().split('T')[0]

    if (!isCheckedIn) {
      // Clocking in
      const newState = {
        isCheckedIn: true,
        activeLog: { clockIn: timeStr, date: dateStr }
      }
      localStorage.setItem('hr_attendance_state', JSON.stringify(newState))
      setIsCheckedIn(true)
      setActiveLog(newState.activeLog)
      toast.success(`Clocked In successfully at ${timeStr}!`)
    } else {
      // Clocking out
      if (activeLog) {
        const hoursCalculated = parseFloat((8.5 + Math.random()).toFixed(2)) // simulated
        const isLate = activeLog.clockIn.includes('AM') && parseInt(activeLog.clockIn.split(':')[0]) >= 9 && parseInt(activeLog.clockIn.split(':')[1]) > 0
        const newLog: AttendanceLog = {
          date: activeLog.date,
          clockIn: activeLog.clockIn,
          clockOut: timeStr,
          hours: hoursCalculated,
          status: isLate ? 'Late' : 'On Time'
        }
        
        // Update logs list
        setLogs(prev => [newLog, ...prev])
      }
      
      localStorage.removeItem('hr_attendance_state')
      setIsCheckedIn(false)
      setActiveLog(null)
      toast.success(`Clocked Out successfully at ${timeStr}. Have a great evening!`)
    }
  }

  // Calculate stats based on logs
  const onTimePercentage = Math.round((logs.filter(l => l.status === 'On Time').length / logs.length) * 100)
  const averageHours = (logs.reduce((acc, curr) => acc + (curr.hours ?? 0), 0) / logs.length).toFixed(2)

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in text-zinc-900">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-zinc-550 hover:text-zinc-800 transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Attendance Manager</h1>
        <p className="text-sm text-zinc-505 mt-1">Track your daily shift attendance, clock logs, and working times</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Clocking Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-zinc-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            
            {/* Live digital clock */}
            <div className="text-4xl sm:text-5xl font-extrabold text-zinc-800 tracking-tighter tabular-nums my-4 flex items-center justify-center gap-1">
              <Clock size={36} className="text-brand-650 animate-pulse shrink-0" />
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed mb-6 max-w-xs">
              {isCheckedIn
                ? `You clocked in today at ${activeLog?.clockIn || '09:00 AM'}. Don't forget to clock out at the end of your shift.`
                : 'Your shift has not started yet. Click the button below to clock in.'}
            </p>

            {/* Check-in/out button */}
            <button
              onClick={handleToggleClock}
              className={`w-full max-w-xs py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-md active:scale-[0.98] border ${
                isCheckedIn
                  ? 'bg-red-50 hover:bg-red-100 text-red-650 border-red-200 shadow-sm'
                  : 'bg-brand-600 hover:bg-brand-550 active:bg-brand-700 text-white border-brand-500/10'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <Coffee size={18} className="animate-bounce" />
                  Clock Out Shift
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Clock In Shift
                </>
              )}
            </button>

            {/* Attendance state badge */}
            <div className="mt-5 text-xs flex items-center gap-1.5 font-medium text-zinc-500">
              <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-ping' : 'bg-zinc-400'}`} />
              Current State: {isCheckedIn ? 'Active Work' : 'Logged Out'}
            </div>
          </div>

          {/* Quick Info statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">On Time Rate</span>
              <span className="text-2xl font-bold text-emerald-600 block tabular-nums">{onTimePercentage}%</span>
              <span className="text-[10px] text-zinc-500 font-medium">Target is above 95%</span>
            </div>
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Avg. Work Hours</span>
              <span className="text-2xl font-bold text-brand-650 block tabular-nums">{averageHours}h</span>
              <span className="text-[10px] text-zinc-500 font-medium">Standard shift: 9.0h</span>
            </div>
          </div>
        </div>

        {/* Right Side: Shift Log History */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-md">
          <div className="px-6 py-5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Attendance logs</h2>
            <span className="text-xs text-zinc-500 font-medium">Recent 30 Days</span>
          </div>

          <div className="divide-y divide-zinc-150 overflow-y-auto max-h-[440px]">
            {logs.map((log, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-all duration-150">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-zinc-800 block">
                    {new Date(log.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' })}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>In: <span className="font-mono text-zinc-650">{log.clockIn}</span></span>
                    {log.clockOut && <span>Out: <span className="font-mono text-zinc-650">{log.clockOut}</span></span>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-bold text-zinc-800 block tabular-nums">
                      {log.hours ? `${log.hours} hrs` : '—'}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-medium">Shift Duration</span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                      log.status === 'On Time'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-amber-50 border-amber-100 text-amber-700'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
