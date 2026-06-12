import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon, FileSpreadsheet, X, CheckCircle2, Loader2 } from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'
import { cn } from '@/lib/utils'

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 3 + i) // [2023, 2024, 2025, 2026, 2027, 2028, 2029]

export function Upload() {
  const [searchParams] = useSearchParams()
  const queryMonth = searchParams.get('month')
  const queryYear = searchParams.get('year')

  const [file, setFile] = useState<File | null>(null)
  const [month, setMonth] = useState<number>(() => queryMonth ? Number(queryMonth) : 6)
  const [year, setYear] = useState<number>(() => queryYear ? Number(queryYear) : 2026)
  
  const { mutate, isPending, isSuccess, data } = useUpload()

  const onDrop = useCallback((accepted: File[]) => { if (accepted[0]) setFile(accepted[0]) }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  })

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Upload Payroll Data</h1>
        <p className="text-sm text-zinc-400 mt-1">Select month, year, and upload the payroll CSV/Excel file</p>
      </div>

      {/* Month & Year Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            disabled={isPending}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={isPending}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drag & Drop zone */}
      <div {...getRootProps()} className={cn('rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all',
        isDragActive ? 'border-brand-500 bg-brand-500/5' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/40')}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <UploadIcon size={24} className="text-zinc-400" />
          </div>
          {isDragActive
            ? <p className="text-brand-400 font-medium">Drop it here!</p>
            : <><p className="text-zinc-200 font-medium">Drag & drop your file here</p><p className="text-sm text-zinc-500">or click to browse</p></>
          }
        </div>
      </div>

      {/* Selected File status info */}
      {file && (
        <div className="flex items-center gap-3 rounded-xl bg-zinc-800/60 border border-zinc-700 px-4 py-3">
          <FileSpreadsheet size={18} className="text-brand-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{file.name}</p>
            <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setFile(null) }} 
            disabled={isPending}
            className="p-1 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Submit upload button */}
      <button 
        onClick={() => file && mutate({ file, month, year })} 
        disabled={!file || isPending}
        className={cn('w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2',
          file && !isPending ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed')}
      >
        {isPending ? <><Loader2 size={16} className="animate-spin" />Uploading…</> : <><UploadIcon size={16} />Upload File</>}
      </button>

      {isSuccess && data && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-300">{data.message}</p>
            <p className="text-xs text-emerald-500 mt-0.5">{data.total_rows} rows inserted into Supabase</p>
          </div>
        </div>
      )}
    </div>
  )
}