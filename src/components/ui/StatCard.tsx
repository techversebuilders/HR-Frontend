import { cn, formatCurrency } from '@/lib/utils'
import { Skeleton } from './Skeleton'
import type { LucideIcon } from 'lucide-react'

export function StatCard({ label, value, icon: Icon, color, loading, isCurrency = true }: { label: string; value?: number | null; icon: LucideIcon; color: string; loading?: boolean; isCurrency?: boolean }) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex gap-4 items-start">
      <div className={cn('p-2.5 rounded-xl', color)}><Icon size={20} className="text-white" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-400">{label}</p>
        {loading ? <Skeleton className="h-7 w-32 mt-1" /> : (
          <p className="text-2xl font-semibold text-white mt-0.5 tabular-nums">
            {isCurrency ? formatCurrency(value) : (value?.toLocaleString('en-IN') ?? '—')}
          </p>
        )}
      </div>
    </div>
  )
}