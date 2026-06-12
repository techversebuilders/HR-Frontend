import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  allowedRoles: ('admin' | 'employee')[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-400 text-sm mt-4">Loading your session...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect authenticated users trying to access unauthorized role views to their home view
    if (user.role === 'admin') {
      return <Navigate to="/" replace />
    } else {
      return <Navigate to="/employee-dashboard" replace />
    }
  }

  return <Outlet />
}
