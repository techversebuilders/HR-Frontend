import { cn } from '@/lib/utils'
const variants = {
  default: 'bg-brand-50 text-brand-700 ring-brand-500/10',
  muted:   'bg-zinc-150/60 text-zinc-650 ring-zinc-200',
}
export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: keyof typeof variants; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', variants[variant], className)}>{children}</span>
}