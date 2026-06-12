import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { API_ENDPOINTS } from '@/lib/endpoints'

export interface AuthData {
  refresh: string
  access: string
  user_id: number
  username: string
  role: 'admin' | 'employee'
}

interface AuthContextType {
  user: AuthData | null
  isLoading: boolean
  login: (id: string, password: string) => Promise<AuthData>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSessionExpired, setIsSessionExpired] = useState(false)

  // Listen for global 401 unauthorized session expiration events
  useEffect(() => {
    const handleExpired = () => {
      if (user?.role === 'admin') {
        setIsSessionExpired(true)
      }
    }
    window.addEventListener('auth-session-expired', handleExpired)
    return () => window.removeEventListener('auth-session-expired', handleExpired)
  }, [user])

  useEffect(() => {
    // Check cache (localStorage) when someone opens the website for the first time
    try {
      const cached = localStorage.getItem('hr_auth_data')
      if (cached) {
        setUser(JSON.parse(cached))
      }
    } catch (e) {
      console.error('Error reading auth cache', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (id: string, password: string): Promise<AuthData> => {
    // Make POST call to http://127.0.0.1:8000/api/login/
    // Since proxy maps /api to http://127.0.0.1:8000, calling /api/login/ is appropriate
    const response = await api.post<AuthData>(API_ENDPOINTS.LOGIN, {
      id,
      password,
    })

    const data = response.data
    localStorage.setItem('hr_auth_data', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('hr_auth_data')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
      {/* Session Expired Feedback Modal */}
      {isSessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm" />
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full relative z-50 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
              <span className="text-xl font-bold font-mono">!</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Session Expired</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your login session has expired or become invalid. Please click the button below to log out and sign in again.
              </p>
            </div>
            <button
              onClick={() => {
                setIsSessionExpired(false)
                logout()
              }}
              className="w-full py-3 bg-brand-600 hover:bg-brand-550 active:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md cursor-pointer active:scale-98"
            >
              Log Out & Sign In
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
