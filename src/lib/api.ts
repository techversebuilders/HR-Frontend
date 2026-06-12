import axios from 'axios'
import { API_ENDPOINTS } from './endpoints'

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://backend-a0rw.onrender.com/api')
export const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(
  (config) => {
    try {
      const cached = localStorage.getItem('hr_auth_data')
      if (cached) {
        const authData = JSON.parse(cached)
        if (authData?.access) {
          config.headers.Authorization = `Bearer ${authData.access}`
        }
      }
    } catch (err) {
      console.error('Error adding auth header to request', err)
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const cached = localStorage.getItem('hr_auth_data')
        if (cached) {
          const authData = JSON.parse(cached)
          if (authData?.role === 'employee') {
            // If the logged in user is an employee, never log out automatically
            return Promise.reject(error)
          }
        }
      } catch (err) {
        console.error('Error checking user role on 401 error', err)
      }
      window.dispatchEvent(new Event('auth-session-expired'))
    }
    return Promise.reject(error)
  }
)

class HttpClient {
  private getHeaders(customHeaders: any = {}) {
    const headers: any = { ...customHeaders }
    try {
      const cached = localStorage.getItem('hr_auth_data')
      if (cached) {
        const authData = JSON.parse(cached)
        if (authData?.access) {
          headers['Authorization'] = `Bearer ${authData.access}`
        }
      }
    } catch (err) {
      console.error('Error reading auth cache for HttpClient headers', err)
    }
    return headers
  }

  async get<T = any>(url: string, config: any = {}) {
    return api.get<T>(url, {
      ...config,
      headers: this.getHeaders(config.headers),
    })
  }

  async post<T = any>(url: string, data?: any, config: any = {}) {
    return api.post<T>(url, data, {
      ...config,
      headers: this.getHeaders(config.headers),
    })
  }

  async put<T = any>(url: string, data?: any, config: any = {}) {
    return api.put<T>(url, data, {
      ...config,
      headers: this.getHeaders(config.headers),
    })
  }

  async patch<T = any>(url: string, data?: any, config: any = {}) {
    return api.patch<T>(url, data, {
      ...config,
      headers: this.getHeaders(config.headers),
    })
  }

  async delete<T = any>(url: string, config: any = {}) {
    return api.delete<T>(url, {
      ...config,
      headers: this.getHeaders(config.headers),
    })
  }
}

export const httpClient = new HttpClient()

export const uploadPayroll = async ({ file, month, year }: { file: File; month: number; year: number }) => {
  const form = new FormData()
  form.append('file', file)
  form.append('month', String(month))
  form.append('year', String(year))
  const { data } = await httpClient.post(API_ENDPOINTS.UPLOAD_CSV, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const fetchEmployees = async (params: any) => {
  const { data } = await httpClient.get(API_ENDPOINTS.EMPLOYEES, { params })
  return data
}

export const fetchEmployee = async (id: number) => {
  const { data } = await httpClient.get(API_ENDPOINTS.EMPLOYEE_DETAIL(id))
  return data
}

export const fetchStats = async () => {
  const { data } = await httpClient.get(API_ENDPOINTS.STATS)
  return data
}

export const fetchEmployeePayslips = async (employeeId: string) => {
  const { data } = await httpClient.get(API_ENDPOINTS.EMPLOYEE_PAYSLIPS(employeeId))
  return data
}

export const fetchPayslipDistributions = async () => {
  const { data } = await httpClient.get(API_ENDPOINTS.PAYSLIP_DISTRIBUTIONS)
  return data
}

export const sendPayslips = async (month: string) => {
  const { data } = await httpClient.post(API_ENDPOINTS.SEND_PAYSLIPS, { month })
  return data
}

export const fetchMyPayslips = async () => {
  const { data } = await httpClient.get(API_ENDPOINTS.MY_PAYSLIPS)
  return data
}