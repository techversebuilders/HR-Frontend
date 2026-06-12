import { useState } from 'react'
import { Users, DollarSign, TrendingDown, Wallet, CheckCircle, XCircle, Send } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { useStats, usePayslipDistributions, useSendPayslips } from '@/hooks/useEmployees'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/utils'

export function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useStats()
  const { data: distributions, isLoading: isDistributionsLoading } = usePayslipDistributions()
  const sendPayslipsMutation = useSendPayslips()

  const [confirmTarget, setConfirmTarget] = useState<{ month: string; label: string } | null>(null)

  const isLoading = isStatsLoading || isDistributionsLoading

  const handleSend = (month: string, label: string) => {
    setConfirmTarget({ month, label })
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Payroll overview across all business units</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees"    value={stats?.total_employees}  icon={Users}        color="bg-blue-500"    loading={isLoading} isCurrency={false} />
        <StatCard label="Total Gross Salary" value={stats?.total_gross}      icon={DollarSign}   color="bg-brand-600"   loading={isLoading} />
        <StatCard label="Total Net Salary"   value={stats?.total_net}        icon={Wallet}       color="bg-emerald-600" loading={isLoading} />
        <StatCard label="Total Deductions"   value={stats?.total_deductions} icon={TrendingDown} color="bg-red-500"     loading={isLoading} />
      </div>

      {/* Payslip Distribution Status Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">Payslip Distribution Status</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-zinc-400">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-semibold uppercase text-zinc-550">
                <th className="px-6 py-3">Month</th>
                <th className="px-6 py-3">Recipients</th>
                <th className="px-6 py-3">Disbursed Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !distributions || distributions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                    No payslip distribution records found in backend.
                  </td>
                </tr>
              ) : (
                distributions.map((p: any) => {
                  return (
                    <tr key={p.month} className="hover:bg-zinc-800/30 transition-colors text-white">
                      <td className="px-6 py-4 font-medium text-sm">{p.label}</td>
                      <td className="px-6 py-4 text-xs text-zinc-400 tabular-nums">
                        {p.recipients_count} Employees
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400 font-mono">
                        {p.disbursed_date || '—'}
                      </td>
                      <td className="px-6 py-4">
                        {p.is_sent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle size={10} /> Sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-450 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <XCircle size={10} /> Not Sent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.is_sent ? (
                          <span className="text-xs text-zinc-500 italic pr-4">Released</span>
                        ) : (
                          <button
                            onClick={() => handleSend(p.month, p.label)}
                            disabled={sendPayslipsMutation.isPending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                          >
                            {sendPayslipsMutation.isPending && sendPayslipsMutation.variables === p.month ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send size={12} />
                                Send Payslips
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Custom Confirmation Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl scale-100 transition-all duration-300 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
                <Send size={20} />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-semibold text-white">Release Payslips?</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Are you sure you want to send payslips for <span className="font-semibold text-zinc-200">{confirmTarget.label}</span>? 
                  Once sent, they will be immediately visible to all employees.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  sendPayslipsMutation.mutate(confirmTarget.month)
                  setConfirmTarget(null)
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/10 transition-all duration-200 cursor-pointer"
              >
                Release Payslips
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}