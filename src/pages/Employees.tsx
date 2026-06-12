import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ExternalLink } from 'lucide-react'
import { useEmployees } from '@/hooks/useEmployees'
import { Skeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

export function Employees() {
  const navigate = useNavigate()
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [ordering, setOrdering] = useState('-net_salary')
  const { data, isLoading, isFetching } = useEmployees({ page, search, ordering })
  const totalPages = data ? Math.ceil(data.count / 20) : 1

  const handleCopy = (e: React.MouseEvent, val: string, label: string) => {
    e.stopPropagation()
    if (!val) return
    navigator.clipboard.writeText(val)
    toast.success(`Copied ${label}: "${val}"`)
  }

  const SortBtn = ({ field, label }: { field: string; label: string }) => (
    <button onClick={() => { setOrdering(o => o === field ? `-${field}` : field); setPage(1) }}
      className="flex items-center gap-1 hover:text-white transition-colors">
      {label}<ArrowUpDown size={12} className={ordering.replace('-','') === field ? 'text-brand-400' : 'text-zinc-600'} />
    </button>
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Employees</h1>
          <p className="text-sm text-zinc-400 mt-1">{data ? `${data.count.toLocaleString()} total records` : 'Loading…'}</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input type="text" placeholder="Search by name or ID…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 w-64 transition-colors" />
        </div>
      </div>
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium"><SortBtn field="id" label="ID" /></th>
                <th className="text-left px-4 py-3 font-medium">Password</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium"><SortBtn field="employee_id" label="Employee ID" /></th>
                <th className="text-left px-4 py-3 font-medium"><SortBtn field="first_name" label="First Name" /></th>
                <th className="text-left px-4 py-3 font-medium"><SortBtn field="last_name" label="Last Name" /></th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-full" /></td>)}</tr>
                  ))
                : (data?.results ?? []).map((emp: any) => (
                    <tr key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)}
                      className="hover:bg-zinc-800/50 cursor-pointer transition-colors">
                      <td 
                        onClick={(e) => handleCopy(e, String(emp.id), 'ID')}
                        className="px-5 py-3.5 font-mono text-zinc-400 cursor-copy hover:bg-zinc-800/80 transition-colors"
                        title="Click to copy ID"
                      >
                        {emp.id}
                      </td>
                      <td 
                        onClick={(e) => handleCopy(e, emp.password || '', 'Password')}
                        className="px-4 py-3.5 cursor-copy hover:bg-zinc-800/80 transition-colors"
                        title="Click to copy Password"
                      >
                        <span className="font-mono bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 rounded-lg text-zinc-200 text-xs select-all">
                          {emp.password || '—'}
                        </span>
                      </td>
                      <td 
                        onClick={(e) => handleCopy(e, emp.is_active ? 'Active' : 'Inactive', 'Status')}
                        className="px-4 py-3.5 cursor-copy hover:bg-zinc-800/80 transition-colors"
                        title="Click to copy Status"
                      >
                        {emp.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td 
                        onClick={(e) => handleCopy(e, emp.employee_id || '', 'Employee ID')}
                        className="px-4 py-3.5 font-mono text-zinc-300 cursor-copy hover:bg-zinc-800/80 transition-colors"
                        title="Click to copy Employee ID"
                      >
                        {emp.employee_id}
                      </td>
                      <td 
                        onClick={(e) => handleCopy(e, emp.first_name || '', 'First Name')}
                        className="px-4 py-3.5 text-zinc-200 font-medium cursor-copy hover:bg-zinc-800/80 transition-colors"
                        title="Click to copy First Name"
                      >
                        {emp.first_name || '—'}
                      </td>
                      <td 
                        onClick={(e) => handleCopy(e, emp.last_name || '', 'Last Name')}
                        className="px-4 py-3.5 text-zinc-200 font-medium cursor-copy hover:bg-zinc-800/80 transition-colors"
                        title="Click to copy Last Name"
                      >
                        {emp.last_name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/employees/${emp.id}`)
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
                        >
                          View <ExternalLink size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-xs text-zinc-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isFetching}
              className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || isFetching}
              className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}