export const API_ENDPOINTS = {
  LOGIN: '/login/',
  UPLOAD_CSV: '/upload-csv/',
  EMPLOYEES: '/employees/',
  EMPLOYEE_DETAIL: (id: number | string) => `/employees/${id}/`,
  STATS: '/stats/',
  EMPLOYEE_PAYSLIPS: (employeeId: string) => `/employees/${employeeId}/payslips/`,
  PAYSLIP_DISTRIBUTIONS: '/payslip-distributions/',
  SEND_PAYSLIPS: '/payslips/send/',
  MY_PAYSLIPS: '/payslips/',
} as const
