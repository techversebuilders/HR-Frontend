import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, CreditCard, Calendar } from 'lucide-react'
import { useEmployee } from '@/hooks/useEmployees'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

function Row({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className={`text-sm font-medium tabular-nums ${highlight ?? 'text-white'}`}>{value}</span>
    </div>
  )
}

export function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: emp, isLoading } = useEmployee(id ? Number(id) : null)

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to Employees
      </button>
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-600/20 text-brand-400 text-xl font-bold flex items-center justify-center shrink-0">
          {isLoading ? '?' : getInitials(emp?.first_name, emp?.last_name)}
        </div>
        <div className="flex-1 min-w-0">
          {isLoading
            ? <><Skeleton className="h-6 w-40 mb-2" /><Skeleton className="h-4 w-24" /></>
            : <>
                <h1 className="text-xl font-semibold text-white">{[emp?.first_name, emp?.last_name].filter(Boolean).join(' ') || 'Unknown'}</h1>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm font-mono text-zinc-400">{emp?.employee_id}</span>
                  <Badge variant="muted">{emp?.business_unit_name ?? 'Unknown'}</Badge>
                </div>
              </>
          }
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-3"><Building2 size={14} className="text-zinc-500" /><p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Details</p></div>
          <Row label="Employee ID"    value={emp?.employee_id ?? '—'} />
          <Row label="Business Unit"  value={emp?.business_unit_name ?? '—'} />
          <Row label="Date of Joining" value={formatDate(emp?.date_of_joining)} />
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-3"><CreditCard size={14} className="text-zinc-500" /><p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Salary Summary</p></div>
          <Row label="Gross Salary"     value={formatCurrency(emp?.gross_salary)} />
          <Row label="Total Deductions" value={formatCurrency(emp?.total_deductions)} highlight="text-red-400" />
          <Row label="Net Salary"       value={formatCurrency(emp?.net_salary)} highlight="text-emerald-400" />
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-3"><Calendar size={14} className="text-zinc-500" /><p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Earnings Breakdown</p></div>
          <Row label="Basic Salary"             value={formatCurrency(emp?.basic_salary)} />
          <Row label="Allowance"                value={formatCurrency(emp?.allowance)} />
          <Row label="Statutory Bonus"          value={formatCurrency(emp?.statutory_bonus)} />
          <Row label="Arrear Special Allowance" value={formatCurrency(emp?.arrear_special_allowance)} />
          <Row label="Arrear Statutory Bonus"   value={formatCurrency(emp?.arrear_statutory_bonus)} />
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-3"><CreditCard size={14} className="text-zinc-500" /><p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Other</p></div>
          <Row label="Tax Spend"          value={formatCurrency(emp?.tax_spend)} highlight="text-amber-400" />
          <Row label="Reimbursement Paid" value={formatCurrency(emp?.reimbursement_paid)} highlight="text-blue-400" />
        </div>
      </div>
    </div>
  )
}