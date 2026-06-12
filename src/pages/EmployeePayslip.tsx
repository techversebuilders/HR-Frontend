import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMyPayslips } from '@/hooks/useEmployees'
import { ArrowLeft, Calendar, Download } from 'lucide-react'

export function EmployeePayslip({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const { data: payslips, isLoading: isPayslipsLoading, error } = useMyPayslips()
  const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null)

  const isLoading = isPayslipsLoading

  const handleDownload = (p: any) => {
    setSelectedPayslipId(p.id)
    // Small timeout to allow state to update before opening print dialog
    setTimeout(() => {
      window.print()
    }, 150)
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6 sm:space-y-8 text-zinc-900 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-sm mt-4">Loading your payslips...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6 sm:space-y-8 text-zinc-900">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-zinc-505 hover:text-zinc-850 transition-colors cursor-pointer focus:outline-none print:hidden"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
          <p className="font-semibold">Failed to load employee profile or session.</p>
          <p className="text-xs text-red-500 mt-1">Please try logging in again or contact administrator.</p>
        </div>
      </div>
    )
  }

  const activePayslip = payslips?.find((p: any) => p.id === selectedPayslipId) || payslips?.[0]

  // Extract pay figures from the active payslip
  const basic = activePayslip?.basic_salary ?? 0
  const allowance = activePayslip?.allowance ?? 0
  const bonus = activePayslip?.statutory_bonus ?? 0
  const specialAllowance = activePayslip?.arrear_special_allowance ?? 0
  const gross = basic + allowance + bonus + specialAllowance

  const pf = activePayslip?.pf ?? 0
  const pt = activePayslip?.pt ?? 0
  const tax = activePayslip?.tds ?? 0
  const deductions = activePayslip?.total_deductions ?? 0
  const net = activePayslip?.net_salary ?? 0

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6 sm:space-y-8 print:space-y-0 print:p-0 print:m-0 print:bg-white print:text-black text-zinc-900">
      
      {/* Back Button (Hidden on Print) */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-850 transition-colors cursor-pointer focus:outline-none print:hidden"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Screen Layout: Simple List of payslips (Hidden on Print) */}
      <div className="space-y-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Payslips</h1>
          <p className="text-sm text-zinc-500 mt-1">View and download your monthly statements.</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm divide-y divide-zinc-100 overflow-hidden">
          {!payslips || payslips.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 text-sm">
              No records found.
            </div>
          ) : (
            payslips.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center border border-brand-500/10">
                    <Calendar size={18} />
                  </div>
                  <span className="font-semibold text-zinc-800 text-sm sm:text-base">{p.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(p)}
                  className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm border border-zinc-900 active:scale-98"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Printable Payslip Container (Only Visible when printing/saving as PDF) */}
      {activePayslip && (
        <div className="print:block hidden">
          <PrintablePayslip
            username={`${activePayslip.first_name || ''} ${activePayslip.last_name || ''}`.trim() || user?.username || 'Employee'}
            employeeId={activePayslip.employee_id}
            businessUnit={activePayslip.business_unit_name || 'HR Corporate'}
            month={activePayslip.label}
            monthId={activePayslip.month}
            userId={user?.user_id || 0}
            basic={basic}
            allowance={allowance}
            bonus={bonus}
            specialAllowance={specialAllowance}
            gross={gross}
            pf={pf}
            pt={pt}
            tax={tax}
            deductions={deductions}
            net={net}
          />
        </div>
      )}

    </div>
  )
}

/* 
================================================================================
📄 PRINTABLE PAYSLIP FORMAT (EDIT THIS COMPONENT TO CHANGE THE PAYSLIP FORMAT)
================================================================================
You can customize the layout, text, columns, earnings, and deductions below.
This section is automatically formatted for A4 print and PDF download output.
*/
interface PrintablePayslipProps {
  username: string
  employeeId: string
  businessUnit: string
  month: string
  monthId: string
  userId: number
  basic: number
  allowance: number
  bonus: number
  specialAllowance: number
  gross: number
  pf: number
  pt: number
  tax: number
  deductions: number
  net: number
}

export function PrintablePayslip(props: PrintablePayslipProps) {
  return (
   <div
  className="bg-white text-black mx-auto"
  style={{
    width: '100%',
    maxWidth: '190mm',
    fontSize: '11px',
  }}
>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase">
          HR CORPORATE SERVICES
        </h1>

        <h2 className="text-lg font-bold uppercase">
          FORM XV See Rule77(2)(b)
        </h2>

        <h3 className="text-xl font-bold mt-1">
          Wage Slip {props.month.toUpperCase()}
        </h3>
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-2 gap-y-3 mb-6 text-sm">
        <div className="flex">
          <span className="font-bold w-28">Emp ID</span>
          <span>{props.employeeId}</span>
        </div>

        <div className="flex">
          <span className="font-bold w-36">Employee Name:</span>
          <span>{props.username}</span>
        </div>

        <div className="flex">
          <span className="font-bold w-28">ESI No.</span>
          <span>3204126760</span>
        </div>

        <div className="flex">
          <span className="font-bold w-36">NDP</span>
          <span>30</span>
        </div>

        <div className="flex">
          <span className="font-bold w-28">UAN</span>
          <span>102331691964</span>
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full border-collapse border border-black text-sm">
        <thead>
          <tr>
            <th className="border border-black p-2 text-left">
              Earnings
            </th>

            <th className="border border-black p-2 text-right">
              Amount
            </th>

            <th className="border border-black p-2 text-left">
              Deductions
            </th>

            <th className="border border-black p-2 text-right">
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border border-black p-2">
              BASIC
            </td>

            <td className="border border-black p-2 text-right">
              {props.basic.toFixed(2)}
            </td>

            <td className="border border-black p-2">
              PF
            </td>

            <td className="border border-black p-2 text-right">
              {props.pf.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2">
              BONUS
            </td>

            <td className="border border-black p-2 text-right">
              {props.bonus.toFixed(2)}
            </td>

            <td className="border border-black p-2">
              PT
            </td>

            <td className="border border-black p-2 text-right">
              {props.pt.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2">
              HRA & ALLOWANCES
            </td>

            <td className="border border-black p-2 text-right">
              {props.allowance.toFixed(2)}
            </td>

            <td className="border border-black p-2">
              TDS
            </td>

            <td className="border border-black p-2 text-right">
              {props.tax.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2">
              SPECIAL ALLOWANCE
            </td>

            <td className="border border-black p-2 text-right">
              {props.specialAllowance.toFixed(2)}
            </td>

            <td className="border border-black p-2"></td>

            <td className="border border-black p-2"></td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold">
              Total
            </td>

            <td className="border border-black p-2 text-right font-bold">
              {props.gross.toFixed(2)}
            </td>

            <td className="border border-black p-2 font-bold">
              Total
            </td>

            <td className="border border-black p-2 text-right font-bold">
              {props.deductions.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold">
              Net Pay
            </td>

            <td
              colSpan={3}
              className="border border-black p-2 text-right font-bold"
            >
              {props.net.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold">
              In Words
            </td>

            <td
              colSpan={3}
              className="border border-black p-2"
            >
              Rupees {Math.round(props.net).toLocaleString()} Only
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature */}
      <div className="mt-4 text-right text-sm">
        Signature
      </div>
    </div>
  )
}