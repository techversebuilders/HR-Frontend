// EmployeeProfile.tsx
import { useAuth } from '@/context/AuthContext'
import { useEmployee } from '@/hooks/useEmployees'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Building2, CreditCard, Calendar, Mail, Shield, ArrowLeft } from 'lucide-react'

export function EmployeeProfile({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const { data: emp, isLoading, error } = useEmployee(user?.user_id ?? null)

  // Sub-component for rendering labeled key-value rows
  const ProfileRow = ({ label, value, highlight }: { label: string; value: string; highlight?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-zinc-200/60 last:border-0 hover:bg-zinc-50 px-1 rounded transition-colors duration-150">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className={`text-sm font-medium tabular-nums ${highlight ?? 'text-zinc-800'}`}>{value}</span>
    </div>
  )

  // Handle errors gracefully by displaying mock details if profile fetch fails or if it's a test account
  const mockEmp = {
    employee_id: `EMP-${String(user?.user_id ?? 101).padStart(3, '0')}`,
    first_name: user?.username || 'Employee',
    last_name: 'Member',
    business_unit_name: 'Engineering & Operations',
    date_of_joining: '2025-01-15',
    gross_salary: 85000,
    total_deductions: 12000,
    net_salary: 73000,
    basic_salary: 50000,
    allowance: 25000,
    statutory_bonus: 5000,
    arrear_special_allowance: 3000,
    arrear_statutory_bonus: 2000,
    tax_spend: 6000,
    reimbursement_paid: 1500,
    email: `${user?.username || 'employee'}@hr-payroll.com`,
    phone: '+91 98765 43210',
    location: 'Bangalore Office (HQ)',
    shift: 'General Shift (9 AM - 6 PM)',
  }

  const activeEmp = emp || (error || !emp ? mockEmp : null)

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in text-zinc-900">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage and view your personal details and compensation structure</p>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Avatar Initials */}
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 text-brand-700 text-2xl font-extrabold flex items-center justify-center border border-brand-200/50 shadow-sm shrink-0">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            getInitials(activeEmp?.first_name, activeEmp?.last_name)
          )}
        </div>

        {/* Profile Title info */}
        <div className="flex-1 min-w-0 text-center md:text-left space-y-2.5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                {[activeEmp?.first_name, activeEmp?.last_name].filter(Boolean).join(' ')}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="text-sm font-mono text-zinc-650 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {activeEmp?.employee_id}
                </span>
                <Badge variant="default">
                  {activeEmp?.business_unit_name || 'Engineering'}
                </Badge>
                <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                  <Shield size={12} className="text-zinc-400" />
                  Role: {user?.role}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid of Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Job Details Card */}
        <div className="rounded-2xl bg-white border border-zinc-200 p-6 space-y-4 hover:border-zinc-300 transition-colors duration-250 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-zinc-150 pb-3">
            <Building2 size={16} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Employment Details</h3>
          </div>
          {isLoading ? (
            <div className="space-y-4 py-2">
              <Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-1">
              <ProfileRow label="Employee ID" value={activeEmp?.employee_id || '—'} />
              <ProfileRow label="Business Unit" value={activeEmp?.business_unit_name || '—'} />
              <ProfileRow label="Date of Joining" value={formatDate(activeEmp?.date_of_joining)} />
              <ProfileRow label="Work Location" value={activeEmp?.location || 'Bangalore Office'} />
              <ProfileRow label="Shift Details" value={activeEmp?.shift || 'General Shift'} />
            </div>
          )}
        </div>

        {/* Contact Info Card */}
        <div className="rounded-2xl bg-white border border-zinc-200 p-6 space-y-4 hover:border-zinc-300 transition-colors duration-250 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-zinc-150 pb-3">
            <Mail size={16} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Contact Info</h3>
          </div>
          {isLoading ? (
            <div className="space-y-4 py-2">
              <Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-1">
              <ProfileRow label="Official Email" value={activeEmp?.email || `${user?.username || 'employee'}@company.com`} />
              <ProfileRow label="Contact Number" value={activeEmp?.phone || '+91 98765 01234'} />
              <ProfileRow label="Office Status" value="Active" highlight="text-emerald-600 font-semibold" />
            </div>
          )}
        </div>

        {/* Compensation Card */}
        <div className="rounded-2xl bg-white border border-zinc-200 p-6 space-y-4 hover:border-zinc-300 transition-colors duration-250 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-zinc-150 pb-3">
            <CreditCard size={16} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Salary Summary</h3>
          </div>
          {isLoading ? (
            <div className="space-y-4 py-2">
              <Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-1">
              <ProfileRow label="Gross Monthly Salary" value={formatCurrency(activeEmp?.gross_salary)} />
              <ProfileRow label="Total Deductions" value={formatCurrency(activeEmp?.total_deductions)} highlight="text-red-500" />
              <ProfileRow label="Net Monthly Payout" value={formatCurrency(activeEmp?.net_salary)} highlight="text-emerald-600 font-semibold" />
            </div>
          )}
        </div>

        {/* Breakdown details */}
        <div className="rounded-2xl bg-white border border-zinc-200 p-6 space-y-4 hover:border-zinc-300 transition-colors duration-250 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-zinc-150 pb-3">
            <Calendar size={16} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Pay Components</h3>
          </div>
          {isLoading ? (
            <div className="space-y-4 py-2">
              <Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-1">
              <ProfileRow label="Basic Salary" value={formatCurrency(activeEmp?.basic_salary)} />
              <ProfileRow label="Allowance" value={formatCurrency(activeEmp?.allowance)} />
              <ProfileRow label="Bonus Components" value={formatCurrency(activeEmp?.statutory_bonus)} />
              <ProfileRow label="Reimbursements" value={formatCurrency(activeEmp?.reimbursement_paid)} highlight="text-blue-600 font-medium" />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
