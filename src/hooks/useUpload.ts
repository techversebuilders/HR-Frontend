import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadPayroll } from '@/lib/api'
import toast from 'react-hot-toast'
import { EMPLOYEES_KEY, STATS_KEY } from './useEmployees'

export function useUpload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: uploadPayroll,
    onSuccess: (data) => {
      toast.success(`${data.total_rows} rows uploaded!`)
      qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] })
      qc.invalidateQueries({ queryKey: [STATS_KEY] })
    },
    onError: (err: any) => {
      console.error('Upload API Error:', err?.response?.data || err)
      const data = err?.response?.data
      let message = 'Upload failed'
      if (typeof data === 'string') {
        message = data
      } else if (data && typeof data === 'object') {
        const keys = Object.keys(data)
        if (keys.length > 0) {
          const firstVal = data[keys[0]]
          message = Array.isArray(firstVal) ? firstVal[0] : (typeof firstVal === 'string' ? firstVal : JSON.stringify(firstVal))
        }
      }
      toast.error(message)
    },
  })
}