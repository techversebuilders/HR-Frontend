import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Toaster } from 'react-hot-toast'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto"><Outlet /></main>
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
    </div>
  )
}