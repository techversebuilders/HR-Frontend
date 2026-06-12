import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchEmployees, fetchEmployee, fetchStats, fetchEmployeePayslips, fetchPayslipDistributions, sendPayslips, fetchMyPayslips } from '@/lib/api'
import toast from 'react-hot-toast'

export const EMPLOYEES_KEY = 'employees'
export const STATS_KEY = 'stats'

export function useEmployees(params: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, params],
    queryFn: () => fetchEmployees(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function useEmployee(id: number | null) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, id],
    queryFn: () => fetchEmployee(id!),
    enabled: id != null,
    staleTime: 60_000,
  })
}

export function useStats() {
  return useQuery({
    queryKey: [STATS_KEY],
    queryFn: fetchStats,
    staleTime: 60_000,
  })
}

export function useEmployeePayslips(employeeId: string | null) {
  return useQuery({
    queryKey: ['payslips', employeeId],
    queryFn: () => fetchEmployeePayslips(employeeId!),
    enabled: !!employeeId,
    staleTime: 30_000,
  })
}

export function usePayslipDistributions() {
  return useQuery({
    queryKey: ['payslip-distributions'],
    queryFn: fetchPayslipDistributions,
    staleTime: 30_000,
  })
}

export function useSendPayslips() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sendPayslips,
    onSuccess: (data) => {
      toast.success(data.message || 'Payslips released successfully!')
      qc.invalidateQueries({ queryKey: ['payslip-distributions'] })
    },
    onError: (err: any) => {
      console.error('Send Payslips API Error:', err?.response?.data || err)
      const msg = err?.response?.data?.error || 'Failed to send payslips.'
      toast.error(msg)
    }
  })
}

export function useMyPayslips() {
  return useQuery({
    queryKey: ['my-payslips'],
    queryFn: fetchMyPayslips,
    staleTime: 30_000,
  })
}