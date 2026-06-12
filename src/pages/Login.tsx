import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { TrendingUp, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/', { replace: true })
      } else {
        navigate('/employee-dashboard', { replace: true })
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id.trim()) {
      toast.error('Please enter your User ID or Username')
      return
    }
    if (!password) {
      toast.error('Please enter your Password')
      return
    }

    setIsSubmitting(true)
    try {
      const authData = await login(id.trim(), password)
      toast.success(`Welcome back, ${authData.username}!`)
      
      // Redirect based on role
      if (authData.role === 'admin') {
        navigate('/', { replace: true })
      } else {
        navigate('/employee-dashboard', { replace: true })
      }
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Invalid credentials. Please try again.'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:border-zinc-300/80">
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-500/0 via-brand-500/0 to-brand-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-4 animate-pulse">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">HR & Payroll Portal</h2>
          <p className="text-sm text-zinc-500 mt-1.5">Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {/* ID Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block">User ID / Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User size={18} />
              </span>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. admin or EMP001"
                disabled={isSubmitting}
                className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isSubmitting}
                className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl py-3 pl-11 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-zinc-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-550 active:bg-brand-700 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Toast notifications */}
      <Toaster position="top-right" toastOptions={{ style: { background: '#fff', color: '#1f2937', border: '1px solid #e5e7eb' } }} />
    </div>
  )
}
