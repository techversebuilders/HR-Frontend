import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Employees } from '@/pages/Employees'
import { EmployeeDetail } from '@/pages/EmployeeDetail'
import { Upload } from '@/pages/Upload'
import { Login } from '@/pages/Login'
import { EmployeeDashboard } from '@/pages/EmployeeDashboard'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/employees"     element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/upload"        element={<Upload />} />
          </Route>
        </Route>

        {/* Employee protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}