export interface Employee {
  id: number
  employee_id: string
  first_name: string | null
  last_name: string | null
  business_unit_name: string | null
  date_of_joining: string | null
  basic_salary: number | null
  allowance: number | null
  statutory_bonus: number | null
  gross_salary: number | null
  arrear_special_allowance: number | null
  total_deductions: number | null
  arrear_statutory_bonus: number | null
  net_salary: number | null
  tax_spend: number | null
  reimbursement_paid: number | null
}