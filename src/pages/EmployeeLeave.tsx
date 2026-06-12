import { useState, useEffect } from 'react'
import { CalendarPlus, CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface LeaveRequest {
  id: string
  type: string
  startDate: string
  endDate: string
  duration: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  submittedAt: string
}

interface LeaveBalance {
  casual: number
  sick: number
  annual: number
}

export function EmployeeLeave({ onBack }: { onBack: () => void }) {
  const [balance, setBalance] = useState<LeaveBalance>({ casual: 8, sick: 6, annual: 14 })
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: '1', type: 'Annual Leave', startDate: '2026-07-02', endDate: '2026-07-05', duration: 4, reason: 'Family vacation trip', status: 'Approved', submittedAt: '2026-06-05' },
    { id: '2', type: 'Sick Leave', startDate: '2026-05-12', endDate: '2026-05-13', duration: 1.5, reason: 'Dental appointment & checkup', status: 'Approved', submittedAt: '2026-05-11' },
    { id: '3', type: 'Casual Leave', startDate: '2026-04-20', endDate: '2026-04-20', duration: 1, reason: 'Personal work at bank', status: 'Rejected', submittedAt: '2026-04-18' },
  ])

  // Form Fields
  const [leaveType, setLeaveType] = useState('casual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load from localStorage if present
  useEffect(() => {
    const cachedRequests = localStorage.getItem('hr_leave_requests')
    const cachedBalance = localStorage.getItem('hr_leave_balance')
    if (cachedRequests) setRequests(JSON.parse(cachedRequests))
    if (cachedBalance) setBalance(JSON.parse(cachedBalance))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Please fill out all required fields')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) {
      toast.error('End Date cannot be earlier than Start Date')
      return
    }

    // Calculate days duration
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // Check balance
    const currentBalance = balance[leaveType as keyof LeaveBalance]
    if (diffDays > currentBalance) {
      toast.error(`Insufficient balance. You only have ${currentBalance} days left for this leave type.`)
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const newRequest: LeaveRequest = {
        id: String(Date.now()),
        type: leaveType === 'casual' ? 'Casual Leave' : leaveType === 'sick' ? 'Sick Leave' : 'Annual Leave',
        startDate,
        endDate,
        duration: diffDays,
        reason: reason.trim(),
        status: 'Pending',
        submittedAt: new Date().toISOString().split('T')[0]
      }

      // Update state & deduct balances
      const updatedRequests = [newRequest, ...requests]
      const updatedBalance = {
        ...balance,
        [leaveType]: currentBalance - diffDays
      }

      setRequests(updatedRequests)
      setBalance(updatedBalance)

      localStorage.setItem('hr_leave_requests', JSON.stringify(updatedRequests))
      localStorage.setItem('hr_leave_balance', JSON.stringify(updatedBalance))

      // Reset form
      setStartDate('')
      setEndDate('')
      setReason('')
      setIsSubmitting(false)

      toast.success('Leave application submitted successfully! It is currently pending approval.')
    }, 800)
  }

  // Get status color & icon utilities
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return { color: 'text-emerald-700 bg-emerald-50 border-emerald-250', icon: CheckCircle }
      case 'Rejected':
        return { color: 'text-rose-700 bg-rose-50 border-rose-250', icon: XCircle }
      default:
        return { color: 'text-amber-700 bg-amber-50 border-amber-250', icon: Clock }
    }
  }

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

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Leave Management</h1>
        <p className="text-sm text-zinc-505 mt-1">Apply for leave, monitor your balances, and track review status</p>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { key: 'casual', label: 'Casual Leaves', val: balance.casual, max: 12, color: 'text-brand-700 bg-brand-500/10' },
          { key: 'sick', label: 'Sick Leaves', val: balance.sick, max: 10, color: 'text-amber-700 bg-amber-500/10' },
          { key: 'annual', label: 'Annual Leaves', val: balance.annual, max: 18, color: 'text-indigo-700 bg-indigo-500/10' },
        ].map((item) => {
          const percentage = Math.round((item.val / item.max) * 100)
          return (
            <div key={item.key} className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">{item.label}</span>
                <span className="text-2xl font-bold text-zinc-900 block">
                  {item.val} <span className="text-xs font-normal text-zinc-500">/ {item.max} days left</span>
                </span>
              </div>
              
              {/* circular progress indicator */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-zinc-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path
                    className={item.key === 'casual' ? 'text-brand-500' : item.key === 'sick' ? 'text-amber-500' : 'text-indigo-500'}
                    strokeWidth="3"
                    strokeDasharray={`${percentage}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-zinc-600">{percentage}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Leave Request Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 shadow-md relative">
          <div className="flex items-center gap-2 mb-2">
            <CalendarPlus size={18} className="text-brand-600" />
            <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">Apply for Leave</h2>
          </div>

          {/* Leave Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-brand-500 transition-colors cursor-pointer"
            >
              <option value="casual">Casual Leave (Balance: {balance.casual})</option>
              <option value="sick">Sick Leave (Balance: {balance.sick})</option>
              <option value="annual">Annual Leave (Balance: {balance.annual})</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Reason / Comments</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context or explanation for leave..."
              className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-brand-500 transition-colors resize-none placeholder:text-zinc-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-550 active:bg-brand-700 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Submit Application'
            )}
          </button>
        </form>

        {/* Right Side: Leave Request List */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-md">
          <div className="px-6 py-5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Leave Applications</h2>
            <span className="text-xs text-zinc-500 font-medium">History & Status</span>
          </div>

          <div className="divide-y divide-zinc-150 overflow-y-auto max-h-[440px]">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 space-y-1">
                <AlertCircle size={32} className="mx-auto text-zinc-300" />
                <p className="text-sm font-medium">No leave applications found</p>
                <p className="text-xs">Your submitted leaves will appear here.</p>
              </div>
            ) : (
              requests.map((req) => {
                const style = getStatusStyle(req.status)
                const StatusIcon = style.icon
                return (
                  <div key={req.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-zinc-50 transition-all duration-150">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-800">{req.type}</span>
                        <span className="text-xs text-zinc-400 font-mono font-medium">({req.duration} {req.duration === 1 ? 'day' : 'days'})</span>
                      </div>
                      <span className="text-xs text-zinc-500 block font-medium">
                        {new Date(req.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} — {new Date(req.endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <p className="text-xs text-zinc-500 mt-1 italic">"{req.reason}"</p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border flex items-center gap-1.5 ${style.color}`}>
                        <StatusIcon size={12} />
                        {req.status}
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-medium">Submitted: {new Date(req.submittedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
